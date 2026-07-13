import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryOrmEntity } from '../../adapters/outbound/persistence/typeorm/category.orm-entity';
import { CategoryTypeOrmRepository } from '../../adapters/outbound/persistence/typeorm/category.repository';
import { CategoryService } from '../../application/category.service';
import { CategoriesController } from '../../adapters/inbound/rest/categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryOrmEntity])],
  controllers: [CategoriesController],
  providers: [
    {
      provide: 'ICategoryRepository',
      useClass: CategoryTypeOrmRepository,
    },
    {
      provide: 'ICategoryUseCase',
      useClass: CategoryService,
    },
  ],
  exports: ['ICategoryRepository', 'ICategoryUseCase'],
})
export class CategoryModule {}
