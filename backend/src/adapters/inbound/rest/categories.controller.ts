import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Inject,
} from '@nestjs/common';
import type { ICategoryUseCase } from '../../../domain/port/input/category.port';
import { CreateCategoryDto } from '../../../domain/dto/create-category.dto';
import { UpdateCategoryDto } from '../../../domain/dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(
    @Inject('ICategoryUseCase')
    private readonly categoriesService: ICategoryUseCase,
  ) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
