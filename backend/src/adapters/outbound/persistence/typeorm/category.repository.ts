import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ICategoryRepository } from '../../../../domain/port/output/category.repository';
import type { ICategory } from '../../../../domain/model/category.model';
import { CategoryOrmEntity } from './category.orm-entity';

@Injectable()
export class CategoryTypeOrmRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly repo: Repository<CategoryOrmEntity>,
  ) {}

  async findAll(): Promise<ICategory[]> {
    const entities = await this.repo.find({ order: { name: 'ASC' } });
    return entities as unknown as ICategory[];
  }

  async findOne(id: number): Promise<ICategory | null> {
    const entity = await this.repo.findOneBy({ id });
    return entity as unknown as ICategory | null;
  }

  async findOneBySlug(slug: string): Promise<ICategory | null> {
    const entity = await this.repo.findOneBy({ slug });
    return entity as unknown as ICategory | null;
  }

  async create(data: Partial<ICategory>): Promise<ICategory> {
    const entity = this.repo.create(data);
    return entity as unknown as ICategory;
  }

  async save(category: ICategory): Promise<ICategory> {
    const entity = await this.repo.save(category as unknown as CategoryOrmEntity);
    return entity as unknown as ICategory;
  }

  async remove(category: ICategory): Promise<void> {
    await this.repo.remove(category as unknown as CategoryOrmEntity);
  }
}
