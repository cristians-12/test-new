import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import type { IProductUseCase } from '../../../domain/port/input/product.port';
import { CreateProductDto } from '../../../domain/dto/create-product.dto';
import { UpdateProductDto } from '../../../domain/dto/update-product.dto';
import { QueryProductDto } from '../../../domain/dto/query-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject('IProductUseCase')
    private readonly productsService: IProductUseCase,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  async findAll(@Query() query: QueryProductDto) {
    const cacheKey = `products:all:${JSON.stringify(query)}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;
    const result = await this.productsService.findAll(query);
    await this.cacheManager.set(cacheKey, result, 60000);
    return result;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const cacheKey = `products:${id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const product = await this.productsService.findOne(id);
    await this.cacheManager.set(cacheKey, product, 60000);
    return product;
  }

  @Post()
  async create(@Body() dto: CreateProductDto) {
    const result = await this.productsService.create(dto);
    await this.cacheManager.clear();
    return result;
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    const result = await this.productsService.update(id, dto);
    await this.cacheManager.clear();
    return result;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.productsService.remove(id);
    await this.cacheManager.clear();
    return result;
  }
}
