import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IPaymentRepository } from '../../../../domain/port/output/payment.repository';
import type { IPayment } from '../../../../domain/model/payment.model';
import { PaymentStatus } from '../../../../domain/model/payment.model';
import { PaymentOrmEntity } from './payment.orm-entity';

@Injectable()
export class PaymentTypeOrmRepository implements IPaymentRepository {
  constructor(
    @InjectRepository(PaymentOrmEntity)
    private readonly repo: Repository<PaymentOrmEntity>,
  ) {}

  async findAll(): Promise<IPayment[]> {
    const entities = await this.repo.find({ order: { created_at: 'DESC' } });
    return entities as unknown as IPayment[];
  }

  async findOne(id: number): Promise<IPayment | null> {
    const entity = await this.repo.findOneBy({ id });
    return entity as unknown as IPayment | null;
  }

  async findOneByReference(reference: string): Promise<IPayment | null> {
    const entity = await this.repo.findOneBy({ reference });
    return entity as unknown as IPayment | null;
  }

  async findPending(): Promise<IPayment[]> {
    const entities = await this.repo.find({
      where: { status: PaymentStatus.PENDING },
    });
    return entities as unknown as IPayment[];
  }

  async create(data: Partial<IPayment>): Promise<IPayment> {
    const entity = this.repo.create(data);
    return entity as unknown as IPayment;
  }

  async save(payment: IPayment): Promise<IPayment> {
    const entity = await this.repo.save(payment as unknown as PaymentOrmEntity);
    return entity as unknown as IPayment;
  }
}
