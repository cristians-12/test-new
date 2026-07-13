import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentStatus } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Product } from '../products/product.entity';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly wompiApiUrl: string;
  private readonly wompiPublicKey: string;
  private readonly wompiPrivateKey: string;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly configService: ConfigService,
  ) {
    this.wompiApiUrl = this.configService.get(
      'WOMPI_API_URL',
      'https://api-sandbox.co.uat.wompi.dev/v1',
    );
    this.wompiPublicKey = this.configService.get('WOMPI_PUBLIC_KEY', '');
    this.wompiPrivateKey = this.configService.get('WOMPI_PRIVATE_KEY', '');
  }

  async create(dto: CreatePaymentDto) {
    const products = await Promise.all(
      dto.items.map(async (item) => {
        const product = await this.productRepo.findOneBy({ id: item.product_id });
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

    const existing = await this.paymentRepo.findOneBy({ reference });
    if (existing) {
      throw new BadRequestException('La referencia ya existe');
    }

    const totalAmount = products.reduce(
      (sum, { product, quantity }) => sum + product.price * quantity,
      0,
    );

    const productNames = products.map(({ product }) => product.name).join(', ');
    const productQuantities = products.map(({ quantity }) => quantity);

    const payment = this.paymentRepo.create({
      reference,
      amount_in_cents: totalAmount * 100,
      currency: 'COP',
      customer_email: dto.customer_email,
      product_id: products[0].product.id,
      product_name: productNames,
      product_quantity: productQuantities,
      status: PaymentStatus.PENDING,
    });

    const savedPayment = await this.paymentRepo.save(payment);

    try {
      const wompiResponse = await this.createWompiTransaction(
        savedPayment,
        dto.acceptance_token,
        {
          card_number: dto.card_number,
          cvv: dto.cvv,
          exp_month: dto.exp_month,
          exp_year: dto.exp_year,
          card_holder: dto.card_holder,
        },
      );
      savedPayment.wompi_transaction_id = wompiResponse.data?.id?.toString() || null;
      savedPayment.response_data = wompiResponse;
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
    return this.paymentRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  async refreshPendingPayments() {
    const pendingPayments = await this.paymentRepo.find({
      where: { status: PaymentStatus.PENDING },
    });

    const results = await Promise.all(
      pendingPayments.map(async (payment) => {
        if (payment.wompi_transaction_id) {
          try {
            const response = await fetch(
              `${this.wompiApiUrl}/transactions/${payment.wompi_transaction_id}`,
              {
                headers: {
                  Authorization: `Bearer ${this.wompiPrivateKey}`,
                },
              },
            );
            if (response.ok) {
              const data = await response.json();
              const wompiStatus = data?.data?.status;
              if (wompiStatus) {
                const newStatus = this.mapWompiStatus(wompiStatus);
                if (newStatus !== payment.status) {
                  payment.status = newStatus;
                  payment.response_data = data;
                  if (newStatus === PaymentStatus.APPROVED) {
                    const product = await this.productRepo.findOneBy({
                      id: payment.product_id || undefined,
                    });
                    if (product && product.stock > 0) {
                      product.stock -= 1;
                      await this.productRepo.save(product);
                    }
                  }
                  await this.paymentRepo.save(payment);
                }
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

    return this.paymentRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const payment = await this.paymentRepo.findOneBy({ id });
    if (!payment) {
      throw new NotFoundException(`Pago #${id} no encontrado`);
    }

    if (payment.status === PaymentStatus.PENDING && payment.wompi_transaction_id) {
      try {
        const response = await fetch(
          `${this.wompiApiUrl}/transactions/${payment.wompi_transaction_id}`,
          {
            headers: {
              Authorization: `Bearer ${this.wompiPrivateKey}`,
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          const wompiStatus = data?.data?.status;
          if (wompiStatus) {
            const newStatus = this.mapWompiStatus(wompiStatus);
            if (newStatus !== payment.status) {
              payment.status = newStatus;
              payment.response_data = data;
              if (newStatus === PaymentStatus.APPROVED) {
                const product = await this.productRepo.findOneBy({
                  id: payment.product_id || undefined,
                });
                if (product && product.stock > 0) {
                  product.stock -= 1;
                  await this.productRepo.save(product);
                }
              }
              await this.paymentRepo.save(payment);
            }
          }
        }
      } catch (error) {
        this.logger.warn('Error consultando estado en Wompi', error);
      }
    }

    return payment;
  }

  async findByReference(reference: string) {
    const payment = await this.paymentRepo.findOneBy({ reference });
    if (!payment) {
      throw new NotFoundException(`Pago con referencia ${reference} no encontrado`);
    }
    return payment;
  }

  async handleWebhook(signature: string, events: any[]) {
    this.logger.log(`Webhook recibido: ${events.length} eventos`);

    const isValidSignature = await this.validateWebhookSignature(events, signature);
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

  private async validateWebhookSignature(events: any[], receivedSignature: string): Promise<boolean> {
    if (!receivedSignature) return false;

    const eventsJson = JSON.stringify(events);

    const encoder = new TextEncoder();
    const data = encoder.encode(eventsJson);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const computedSignature = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return computedSignature === receivedSignature;
  }

  private async updateTransactionStatus(
    wompiTransactionId: string,
    status: string,
  ) {
    const payment = await this.paymentRepo.findOneBy({
      wompi_transaction_id: wompiTransactionId,
    });

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
      const product = await this.productRepo.findOneBy({
        id: payment.product_id || undefined,
      });
      if (product && product.stock > 0) {
        product.stock -= 1;
        await this.productRepo.save(product);
      }
    }

    await this.paymentRepo.save(payment);
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

  private async createWompiTransaction(
    payment: Payment,
    acceptanceToken?: string,
    cardData?: {
      card_number: string;
      cvv: string;
      exp_month: string;
      exp_year: string;
      card_holder: string;
    },
  ) {
    const token = acceptanceToken || (await this.getAcceptanceToken());

    let paymentMethod: Record<string, any> = { type: 'CARD', installments: 1 };

    if (cardData) {
      const cardToken = await this.tokenizeCard(cardData);
      paymentMethod = {
        type: 'CARD',
        token: cardToken,
        installments: 1,
      };
    }

    const payload = {
      acceptance_token: token,
      amount_in_cents: payment.amount_in_cents,
      currency: payment.currency,
      customer_email: payment.customer_email,
      payment_method: paymentMethod,
      reference: payment.reference,
      signature: await this.generateSignature(payment.reference, payment.amount_in_cents),
    };

    const response = await fetch(`${this.wompiApiUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.wompiPrivateKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error Wompi: ${JSON.stringify(errorData)}`,
      );
    }

    return response.json();
  }

  private async tokenizeCard(cardData: {
    card_number: string;
    cvv: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
  }): Promise<string> {
    const payload = {
      number: cardData.card_number.replace(/\s/g, ''),
      cvc: cardData.cvv,
      exp_month: cardData.exp_month,
      exp_year: cardData.exp_year.slice(-2),
      card_holder: cardData.card_holder,
    };

    const response = await fetch(`${this.wompiApiUrl}/tokens/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.wompiPublicKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error tokenizing card: ${JSON.stringify(errorData)}`,
      );
    }

    const data = await response.json();
    return data?.data?.id || '';
  }

  private async getAcceptanceToken(): Promise<string> {
    const response = await fetch(
      `${this.wompiApiUrl}/merchants/${this.wompiPublicKey}`,
    );

    if (!response.ok) {
      throw new Error('Error al obtener acceptance token');
    }

    const data = await response.json();
    return data?.data?.presigned_acceptance?.acceptance_token || '';
  }

  private async generateSignature(
    reference: string,
    amountInCents: number,
  ): Promise<string> {
    const integrityKey = this.configService.get('WOMPI_INTEGRITY_KEY', '');

    const concatenated = `${reference}${amountInCents}COP${integrityKey}`;

    const encoder = new TextEncoder();
    const data = encoder.encode(concatenated);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
