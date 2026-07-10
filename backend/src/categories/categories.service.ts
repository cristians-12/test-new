import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll() {
    return this.categoryRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Categoría #${id} no encontrada`);
    }
    return category;
  }

  async findOneBySlug(slug: string) {
    const category = await this.categoryRepo.findOneBy({ slug });
    if (!category) {
      throw new NotFoundException(`Categoría "${slug}" no encontrada`);
    }
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const existing = await this.categoryRepo.findOneBy({ slug: dto.slug });
    if (existing) {
      throw new ConflictException(`El slug "${dto.slug}" ya existe`);
    }
    const category = this.categoryRepo.create(dto);
    return this.categoryRepo.save(category);
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.categoryRepo.findOneBy({ slug: dto.slug });
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
