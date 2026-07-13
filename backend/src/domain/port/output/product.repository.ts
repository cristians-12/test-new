import type { IProduct } from '../../model/product.model';
import type { QueryProductDto } from '../../dto/query-product.dto';

export interface IProductRepository {
  findAll(query: QueryProductDto): Promise<{ data: IProduct[]; meta: any }>;
  findOne(id: number): Promise<IProduct | null>;
  create(data: Partial<IProduct>): Promise<IProduct>;
  save(product: IProduct): Promise<IProduct>;
  remove(product: IProduct): Promise<void>;
}
