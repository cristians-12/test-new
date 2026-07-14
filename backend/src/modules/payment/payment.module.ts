import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentOrmEntity } from '../../adapters/outbound/persistence/typeorm/payment.orm-entity';
import { ProductOrmEntity } from '../../adapters/outbound/persistence/typeorm/product.orm-entity';
import { PaymentTypeOrmRepository } from '../../adapters/outbound/persistence/typeorm/payment.repository';
import { ProductTypeOrmRepository } from '../../adapters/outbound/persistence/typeorm/product.repository';
import { PaymentService } from '../../application/payment.service';
import { PaymentsController } from '../../adapters/inbound/rest/payments.controller';
import { WompiModule } from '../../config/wompi/wompi.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentOrmEntity, ProductOrmEntity]),
    WompiModule,
    ProductModule,
  ],
  controllers: [PaymentsController],
  providers: [
    {
      provide: 'IPaymentRepository',
      useClass: PaymentTypeOrmRepository,
    },
    {
      provide: 'IPaymentUseCase',
      useClass: PaymentService,
    },
  ],
  exports: ['IPaymentUseCase'],
})
export class PaymentModule {}
