import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateProductDto } from '../create-product.dto';
import { UpdateProductDto } from '../update-product.dto';
import { QueryProductDto } from '../query-product.dto';
import { CreateCategoryDto } from '../create-category.dto';
import { UpdateCategoryDto } from '../update-category.dto';

describe('CreateProductDto', () => {
  it('should validate a correct dto', async () => {
    const dto = plainToInstance(CreateProductDto, {
      name: 'Laptop',
      price: 1500000,
      category_id: 1,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with all optional fields', async () => {
    const dto = plainToInstance(CreateProductDto, {
      name: 'Laptop',
      price: 1500000,
      category_id: 1,
      image_url: 'https://example.com/img.png',
      description: 'Gaming laptop',
      stock: 5,
      is_active: true,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail without name', async () => {
    const dto = plainToInstance(CreateProductDto, {
      price: 1000,
      category_id: 1,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const nameError = errors.find((e) => e.property === 'name');
    expect(nameError).toBeDefined();
  });

  it('should fail without price', async () => {
    const dto = plainToInstance(CreateProductDto, {
      name: 'Item',
      category_id: 1,
    });
    const errors = await validate(dto);
    const priceError = errors.find((e) => e.property === 'price');
    expect(priceError).toBeDefined();
  });

  it('should fail without category_id', async () => {
    const dto = plainToInstance(CreateProductDto, {
      name: 'Item',
      price: 1000,
    });
    const errors = await validate(dto);
    const catError = errors.find((e) => e.property === 'category_id');
    expect(catError).toBeDefined();
  });

  it('should fail with negative price', async () => {
    const dto = plainToInstance(CreateProductDto, {
      name: 'Item',
      price: -500,
      category_id: 1,
    });
    const errors = await validate(dto);
    const priceError = errors.find((e) => e.property === 'price');
    expect(priceError).toBeDefined();
  });

  it('should fail with non-string name', async () => {
    const dto = plainToInstance(CreateProductDto, {
      name: 123,
      price: 1000,
      category_id: 1,
    });
    const errors = await validate(dto);
    const nameError = errors.find((e) => e.property === 'name');
    expect(nameError).toBeDefined();
  });

  it('should fail with negative stock', async () => {
    const dto = plainToInstance(CreateProductDto, {
      name: 'Item',
      price: 1000,
      category_id: 1,
      stock: -1,
    });
    const errors = await validate(dto);
    const stockError = errors.find((e) => e.property === 'stock');
    expect(stockError).toBeDefined();
  });

  it('should fail with non-integer category_id', async () => {
    const dto = plainToInstance(CreateProductDto, {
      name: 'Item',
      price: 1000,
      category_id: 1.5,
    });
    const errors = await validate(dto);
    const catError = errors.find((e) => e.property === 'category_id');
    expect(catError).toBeDefined();
  });
});

describe('UpdateProductDto', () => {
  it('should validate with empty dto (all optional)', async () => {
    const dto = plainToInstance(UpdateProductDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with partial fields', async () => {
    const dto = plainToInstance(UpdateProductDto, {
      name: 'Updated',
      price: 99000,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with negative price', async () => {
    const dto = plainToInstance(UpdateProductDto, { price: -100 });
    const errors = await validate(dto);
    const priceError = errors.find((e) => e.property === 'price');
    expect(priceError).toBeDefined();
  });

  it('should fail with negative stock', async () => {
    const dto = plainToInstance(UpdateProductDto, { stock: -5 });
    const errors = await validate(dto);
    const stockError = errors.find((e) => e.property === 'stock');
    expect(stockError).toBeDefined();
  });

  it('should validate with category_id', async () => {
    const dto = plainToInstance(UpdateProductDto, { category_id: 2 });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});

describe('QueryProductDto', () => {
  it('should validate with empty query', async () => {
    const dto = plainToInstance(QueryProductDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should transform string numbers to actual numbers', async () => {
    const dto = plainToInstance(QueryProductDto, {
      page: '2',
      limit: '10',
      min_price: '5000',
      max_price: '100000',
      category_id: '3',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(typeof dto.page).toBe('number');
    expect(typeof dto.limit).toBe('number');
    expect(typeof dto.category_id).toBe('number');
  });

  it('should validate with all fields', async () => {
    const dto = plainToInstance(QueryProductDto, {
      category_id: 1,
      search: 'laptop',
      min_price: 10000,
      max_price: 500000,
      page: 1,
      limit: 20,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with page < 1', async () => {
    const dto = plainToInstance(QueryProductDto, { page: 0 });
    const errors = await validate(dto);
    const pageError = errors.find((e) => e.property === 'page');
    expect(pageError).toBeDefined();
  });

  it('should fail with limit < 1', async () => {
    const dto = plainToInstance(QueryProductDto, { limit: 0 });
    const errors = await validate(dto);
    const limitError = errors.find((e) => e.property === 'limit');
    expect(limitError).toBeDefined();
  });

  it('should fail with negative min_price', async () => {
    const dto = plainToInstance(QueryProductDto, { min_price: -1 });
    const errors = await validate(dto);
    const minError = errors.find((e) => e.property === 'min_price');
    expect(minError).toBeDefined();
  });
});

describe('CreateCategoryDto', () => {
  it('should validate a correct dto', async () => {
    const dto = plainToInstance(CreateCategoryDto, {
      name: 'Electronics',
      slug: 'electronics',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with description', async () => {
    const dto = plainToInstance(CreateCategoryDto, {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail without name', async () => {
    const dto = plainToInstance(CreateCategoryDto, { slug: 'test' });
    const errors = await validate(dto);
    const nameError = errors.find((e) => e.property === 'name');
    expect(nameError).toBeDefined();
  });

  it('should fail without slug', async () => {
    const dto = plainToInstance(CreateCategoryDto, { name: 'Test' });
    const errors = await validate(dto);
    const slugError = errors.find((e) => e.property === 'slug');
    expect(slugError).toBeDefined();
  });

  it('should fail with non-string name', async () => {
    const dto = plainToInstance(CreateCategoryDto, { name: 123, slug: 'test' });
    const errors = await validate(dto);
    const nameError = errors.find((e) => e.property === 'name');
    expect(nameError).toBeDefined();
  });
});

describe('UpdateCategoryDto', () => {
  it('should validate with empty dto (all optional)', async () => {
    const dto = plainToInstance(UpdateCategoryDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with partial fields', async () => {
    const dto = plainToInstance(UpdateCategoryDto, { name: 'Updated' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with slug update', async () => {
    const dto = plainToInstance(UpdateCategoryDto, { slug: 'new-slug' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
