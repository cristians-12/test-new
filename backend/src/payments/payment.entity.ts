import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  VOIDED = 'VOIDED',
  ERROR = 'ERROR',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  reference!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount_in_cents!: number;

  @Column({ length: 3, default: 'COP' })
  currency!: string;

  @Column()
  customer_email!: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column({ type: 'varchar', nullable: true })
  wompi_transaction_id!: string | null;

  @Column({ type: 'int', nullable: true })
  product_id!: number | null;

  @Column({ type: 'varchar', nullable: true })
  product_name!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  product_quantity!: number[] | null;

  @Column({ type: 'jsonb', nullable: true })
  payment_method!: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  response_data!: Record<string, any> | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
