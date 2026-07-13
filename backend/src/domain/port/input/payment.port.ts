import type { IPayment } from '../../model/payment.model';
import type { CreatePaymentDto } from '../../dto/create-payment.dto';

export interface IPaymentUseCase {
  create(dto: CreatePaymentDto): Promise<IPayment>;
  findAll(): Promise<IPayment[]>;
  findOne(id: number): Promise<IPayment>;
  findByReference(reference: string): Promise<IPayment>;
  refreshPendingPayments(): Promise<IPayment[]>;
  handleWebhook(signature: string, events: any[]): Promise<void>;
}
