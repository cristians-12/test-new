export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  VOIDED = 'VOIDED',
  ERROR = 'ERROR',
}

export interface IPayment {
  id: number;
  reference: string;
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  status: PaymentStatus;
  wompi_transaction_id: string | null;
  product_id: number | null;
  product_name: string | null;
  product_quantity: number[] | null;
  payment_method: Record<string, any> | null;
  response_data: Record<string, any> | null;
  created_at: Date;
  updated_at: Date;
}
