import type { ICategory } from '../../model/category.model';
import type { CreateCategoryDto } from '../../dto/create-category.dto';
import type { UpdateCategoryDto } from '../../dto/update-category.dto';

export interface ICategoryUseCase {
  findAll(): Promise<ICategory[]>;
  findOne(id: number): Promise<ICategory>;
  findOneBySlug(slug: string): Promise<ICategory>;
  create(dto: CreateCategoryDto): Promise<ICategory>;
  update(id: number, dto: UpdateCategoryDto): Promise<ICategory>;
  remove(id: number): Promise<{ message: string }>;
}
