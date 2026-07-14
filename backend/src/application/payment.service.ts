import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IPaymentUseCase } from '../domain/port/input/payment.port';
import type { IPaymentRepository } from '../domain/port/output/payment.repository';
import type { IProductRepository } from '../domain/port/output/product.repository';
import type { IWompiGateway } from '../domain/port/output/wompi.gateway';
import type { IPayment } from '../domain/model/payment.model';
import { PaymentStatus } from '../domain/model/payment.model';
import type { CreatePaymentDto } from '../domain/dto/create-payment.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService implements IPaymentUseCase {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepo: IPaymentRepository,
    @Inject('IProductRepository')
    private readonly productRepo: IProductRepository,
    @Inject('IWompiGateway')
    private readonly wompiGateway: IWompiGateway,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreatePaymentDto) {
    const products = await Promise.all(
      dto.items.map(async (item) => {
        const product = await this.productRepo.findOne(item.product_id);
        if (!product) {
          throw new NotFoundException(`Producto #${item.product_id} no encontrado`);
        }
        if (!product.is_active) {
          throw new BadRequestException(`Producto #${item.product_id} no esta disponible`);
        }
        if (product.stock < item.quantity) {
          throw new BadRequestException(`Stock insuficiente para ${product.name}`);
        }
        return { product, quantity: item.quantity };
      }),
    );

    const reference = dto.reference || `ref_${Date.now()}`;
    const existing = await this.paymentRepo.findOneByReference(reference);
    if (existing) {
      throw new BadRequestException('La referencia ya existe');
    }

    const totalAmount = products.reduce(
      (sum, { product, quantity }) => sum + product.price * quantity,
      0,
    );

    const productNames = products.map(({ product }) => product.name).join(', ');
    const productQuantities = products.map(({ quantity }) => quantity);

    const payment = await this.paymentRepo.create({
      reference,
      amount_in_cents: totalAmount * 100,
      currency: 'COP',
      customer_email: dto.customer_email,
      product_id: products[0].product.id,
      product_name: productNames,
      product_quantity: productQuantities,
      status: PaymentStatus.PENDING,
    });

    const savedPayment = await this.paymentRepo.save(payment as IPayment);

    try {
      const integrityKey = this.configService.get('WOMPI_INTEGRITY_KEY', '');
      const signature = await this.wompiGateway.generateSignature(
        reference,
        savedPayment.amount_in_cents,
        integrityKey,
      );

      const acceptanceToken = dto.acceptance_token || (await this.wompiGateway.getAcceptanceToken());

      let paymentMethod: Record<string, any> = { type: 'CARD', installments: 1 };

      if (dto.card_number) {
        const cardToken = await this.wompiGateway.tokenizeCard({
          card_number: dto.card_number,
          cvv: dto.cvv,
          exp_month: dto.exp_month,
          exp_year: dto.exp_year,
          card_holder: dto.card_holder,
        });
        paymentMethod = {
          type: 'CARD',
          token: cardToken,
          installments: 1,
        };
      }

      const wompiResponse = await this.wompiGateway.createTransaction({
        acceptance_token: acceptanceToken,
        amount_in_cents: savedPayment.amount_in_cents,
        currency: savedPayment.currency,
        customer_email: savedPayment.customer_email,
        payment_method: paymentMethod,
        reference: savedPayment.reference,
        signature,
      });

      savedPayment.wompi_transaction_id = wompiResponse.data?.id?.toString() || null;
      savedPayment.response_data = wompiResponse as any;
      await this.paymentRepo.save(savedPayment);
    } catch (error) {
      this.logger.error('Error al crear transaccion en Wompi', error);
      savedPayment.status = PaymentStatus.ERROR;
      savedPayment.response_data = { error: (error as Error).message };
      await this.paymentRepo.save(savedPayment);
    }

    return savedPayment;
  }

  async findAll() {
    return this.paymentRepo.findAll();
  }

  async findOne(id: number) {
    const payment = await this.paymentRepo.findOne(id);
    if (!payment) {
      throw new NotFoundException(`Pago #${id} no encontrado`);
    }

    if (payment.status === PaymentStatus.PENDING && payment.wompi_transaction_id) {
      try {
        const data = await this.wompiGateway.getTransaction(payment.wompi_transaction_id);
        const wompiStatus = data?.data?.status;
        if (wompiStatus) {
          const newStatus = this.mapWompiStatus(wompiStatus);
          if (newStatus !== payment.status) {
            payment.status = newStatus;
            payment.response_data = data as any;
            if (newStatus === PaymentStatus.APPROVED) {
              await this.decrementStock(payment.product_id);
            }
            await this.paymentRepo.save(payment);
          }
        }
      } catch (error) {
        this.logger.warn('Error consultando estado en Wompi', error);
      }
    }

    return payment;
  }

  async findByReference(reference: string) {
    const payment = await this.paymentRepo.findOneByReference(reference);
    if (!payment) {
      throw new NotFoundException(`Pago con referencia ${reference} no encontrado`);
    }
    return payment;
  }

  async refreshPendingPayments() {
    const pendingPayments = await this.paymentRepo.findPending();

    await Promise.all(
      pendingPayments.map(async (payment) => {
        if (payment.wompi_transaction_id) {
          try {
            const data = await this.wompiGateway.getTransaction(payment.wompi_transaction_id);
            const wompiStatus = data?.data?.status;
            if (wompiStatus) {
              const newStatus = this.mapWompiStatus(wompiStatus);
              if (newStatus !== payment.status) {
                payment.status = newStatus;
                payment.response_data = data as any;
                if (newStatus === PaymentStatus.APPROVED) {
                  await this.decrementStock(payment.product_id);
                }
                await this.paymentRepo.save(payment);
              }
            }
          } catch (error) {
            this.logger.warn(
              `Error consultando transaccion ${payment.wompi_transaction_id}`,
              error,
            );
          }
        }
        return payment;
      }),
    );

    return this.paymentRepo.findAll();
  }

  async handleWebhook(signature: string, events: any[]) {
    this.logger.log(`Webhook recibido: ${events.length} eventos`);

    const isValidSignature = await this.wompiGateway.validateWebhookSignature(events, signature);
    if (!isValidSignature) {
      this.logger.warn('Firma del webhook invalida');
      throw new BadRequestException('Firma del webhook invalida');
    }

    for (const event of events) {
      this.logger.log(`Evento: ${event.event}`);
      if (event.event === 'transaction.updated') {
        const transaction = event.data?.transaction;
        if (transaction) {
          this.logger.log(`Transaccion ${transaction.id}: ${transaction.status}`);
          await this.updateTransactionStatus(
            transaction.id.toString(),
            transaction.status,
          );
        }
      }
    }
  }

  private async updateTransactionStatus(
    wompiTransactionId: string,
    status: string,
  ) {
    const payments = await this.paymentRepo.findAll();
    const payment = payments.find((p) => p.wompi_transaction_id === wompiTransactionId);

    if (!payment) {
      this.logger.warn(
        `Pago no encontrado para transaccion Wompi: ${wompiTransactionId}`,
      );
      return;
    }

    const newStatus = this.mapWompiStatus(status);
    this.logger.log(`Actualizando pago ${payment.id}: ${payment.status} → ${newStatus}`);
    payment.status = newStatus;

    if (newStatus === PaymentStatus.APPROVED) {
      await this.decrementStock(payment.product_id);
    }

    await this.paymentRepo.save(payment);
  }

  private async decrementStock(productId: number | null) {
    if (!productId) return;
    const product = await this.productRepo.findOne(productId);
    if (product && product.stock > 0) {
      product.stock -= 1;
      await this.productRepo.save(product);
    }
  }

  private mapWompiStatus(wompiStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      APPROVED: PaymentStatus.APPROVED,
      DECLINED: PaymentStatus.DECLINED,
      VOIDED: PaymentStatus.VOIDED,
      ERROR: PaymentStatus.ERROR,
      PENDING: PaymentStatus.PENDING,
    };
    return statusMap[wompiStatus.toUpperCase()] || PaymentStatus.ERROR;
  }
}
