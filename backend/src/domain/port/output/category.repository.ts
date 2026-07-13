import type { ICategory } from '../../model/category.model';

export interface ICategoryRepository {
  findAll(): Promise<ICategory[]>;
  findOne(id: number): Promise<ICategory | null>;
  findOneBySlug(slug: string): Promise<ICategory | null>;
  create(data: Partial<ICategory>): Promise<ICategory>;
  save(category: ICategory): Promise<ICategory>;
  remove(category: ICategory): Promise<void>;
}
