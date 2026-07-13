import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) { }

  async findAll(query: QueryProductDto) {
    const { category_id, search, min_price, max_price, page = 1, limit = 20 } = query;

    const qb = this.productRepo.createQueryBuilder('product');

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
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Producto #${id} no encontrado`);
    }
    return product;
  }

  async create(dto: CreateProductDto) {
    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
    return { message: `Producto #${id} eliminado` };
  }
}
