import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IProductRepository } from '../../../../domain/port/output/product.repository';
import type { IProduct } from '../../../../domain/model/product.model';
import { ProductOrmEntity } from './product.orm-entity';
import type { QueryProductDto } from '../../../../domain/dto/query-product.dto';

@Injectable()
export class ProductTypeOrmRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repo: Repository<ProductOrmEntity>,
  ) {}

  async findAll(query: QueryProductDto) {
    const { category_id, search, min_price, max_price, page = 1, limit = 20 } = query;

    const qb = this.repo.createQueryBuilder('product');

    if (category_id !== undefined) {
      qb.andWhere('product.category_id = :category_id', { category_id });
    }

    if (search) {
      qb.andWhere(
        '(unaccent(product.name) ILIKE unaccent(:search) OR unaccent(product.description) ILIKE unaccent(:search))',
        { search: `%${search}%` },
      );
    }

    if (min_price !== undefined) {
      qb.andWhere('product.price >= :min_price', { min_price });
    }

    if (max_price !== undefined) {
      qb.andWhere('product.price <= :max_price', { max_price });
    }

    qb.orderBy('product.created_at', 'DESC');

    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data: data as unknown as IProduct[],
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<IProduct | null> {
    const entity = await this.repo.findOneBy({ id });
    return entity as unknown as IProduct | null;
  }

  async create(data: Partial<IProduct>): Promise<IProduct> {
    const entity = this.repo.create(data);
    return entity as unknown as IProduct;
  }

  async save(product: IProduct): Promise<IProduct> {
    const entity = await this.repo.save(product as unknown as ProductOrmEntity);
    return entity as unknown as IProduct;
  }

  async remove(product: IProduct): Promise<void> {
    await this.repo.remove(product as unknown as ProductOrmEntity);
  }
}
