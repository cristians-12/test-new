import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from '../../adapters/outbound/persistence/typeorm/product.orm-entity';
import { ProductTypeOrmRepository } from '../../adapters/outbound/persistence/typeorm/product.repository';
import { ProductService } from '../../application/product.service';
import { ProductsController } from '../../adapters/inbound/rest/products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [ProductsController],
  providers: [
    {
      provide: 'IProductRepository',
      useClass: ProductTypeOrmRepository,
    },
    {
      provide: 'IProductUseCase',
      useClass: ProductService,
    },
  ],
  exports: ['IProductRepository', 'IProductUseCase'],
})
export class ProductModule {}
