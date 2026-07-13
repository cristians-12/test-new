import { Inject, Injectable } from '@nestjs/common';
import type { ICategoryUseCase } from '../domain/port/input/category.port';
import type { ICategoryRepository } from '../domain/port/output/category.repository';
import type { ICategory } from '../domain/model/category.model';
import type { CreateCategoryDto } from '../domain/dto/create-category.dto';
import type { UpdateCategoryDto } from '../domain/dto/update-category.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

@Injectable()
export class CategoryService implements ICategoryUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async findAll() {
    return this.categoryRepo.findAll();
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne(id);
    if (!category) {
      throw new NotFoundException(`Categoría #${id} no encontrada`);
    }
    return category;
  }

  async findOneBySlug(slug: string) {
    const category = await this.categoryRepo.findOneBySlug(slug);
    if (!category) {
      throw new NotFoundException(`Categoría "${slug}" no encontrada`);
    }
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const existing = await this.categoryRepo.findOneBySlug(dto.slug);
    if (existing) {
      throw new ConflictException(`El slug "${dto.slug}" ya existe`);
    }
    const category = await this.categoryRepo.create(dto);
    return this.categoryRepo.save(category as ICategory);
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.categoryRepo.findOneBySlug(dto.slug);
      if (existing) {
        throw new ConflictException(`El slug "${dto.slug}" ya existe`);
      }
    }

    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
    return { message: `Categoría #${id} eliminada` };
  }
}
