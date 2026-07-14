import type { IPayment } from '../../model/payment.model';
import { PaymentStatus } from '../../model/payment.model';

export interface IPaymentRepository {
  findAll(): Promise<IPayment[]>;
  findOne(id: number): Promise<IPayment | null>;
  findOneByReference(reference: string): Promise<IPayment | null>;
  findPending(): Promise<IPayment[]>;
  create(data: Partial<IPayment>): Promise<IPayment>;
  save(payment: IPayment): Promise<IPayment>;
}
