import { Inject, Injectable } from '@nestjs/common';
import type { IProductUseCase } from '../domain/port/input/product.port';
import type { IProductRepository } from '../domain/port/output/product.repository';
import type { IProduct } from '../domain/model/product.model';
import type { CreateProductDto } from '../domain/dto/create-product.dto';
import type { UpdateProductDto } from '../domain/dto/update-product.dto';
import type { QueryProductDto } from '../domain/dto/query-product.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductService implements IProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepo: IProductRepository,
  ) {}

  async findAll(query: QueryProductDto) {
    return this.productRepo.findAll(query);
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne(id);
    if (!product) {
      throw new NotFoundException(`Producto #${id} no encontrado`);
    }
    return product;
  }

  async create(dto: CreateProductDto) {
    const product = await this.productRepo.create(dto);
    return this.productRepo.save(product as IProduct);
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
