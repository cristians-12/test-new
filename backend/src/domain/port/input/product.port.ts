import type { IProduct } from '../../model/product.model';
import type { CreateProductDto } from '../../dto/create-product.dto';
import type { UpdateProductDto } from '../../dto/update-product.dto';
import type { QueryProductDto } from '../../dto/query-product.dto';

export interface IProductUseCase {
  findAll(query: QueryProductDto): Promise<{ data: IProduct[]; meta: any }>;
  findOne(id: number): Promise<IProduct>;
  create(dto: CreateProductDto): Promise<IProduct>;
  update(id: number, dto: UpdateProductDto): Promise<IProduct>;
  remove(id: number): Promise<{ message: string }>;
}
