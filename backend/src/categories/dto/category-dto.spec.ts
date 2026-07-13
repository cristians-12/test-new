import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateCategoryDto } from './create-category.dto';
import { UpdateCategoryDto } from './update-category.dto';

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

  it('should validate setting description to null', async () => {
    const dto = plainToInstance(UpdateCategoryDto, { description: null });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with slug update', async () => {
    const dto = plainToInstance(UpdateCategoryDto, { slug: 'new-slug' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
