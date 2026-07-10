import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: MockRepository<Category>;

  const mockCategory: Category = {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices',
    products: [],
    created_at: new Date('2025-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<MockRepository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all categories ordered by name', async () => {
      repository.find = jest.fn().mockResolvedValue([mockCategory]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({ order: { name: 'ASC' } });
      expect(result).toEqual([mockCategory]);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      repository.findOneBy = jest.fn().mockResolvedValue(mockCategory);

      const result = await service.findOne(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException when not found', async () => {
      repository.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneBySlug', () => {
    it('should return a category by slug', async () => {
      repository.findOneBy = jest.fn().mockResolvedValue(mockCategory);

      const result = await service.findOneBySlug('electronics');

      expect(repository.findOneBy).toHaveBeenCalledWith({ slug: 'electronics' });
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException when slug not found', async () => {
      repository.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(service.findOneBySlug('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and save a category', async () => {
      const dto = { name: 'Clothing', slug: 'clothing', description: null };
      repository.findOneBy = jest.fn().mockResolvedValue(null);
      repository.create = jest.fn().mockReturnValue(mockCategory);
      repository.save = jest.fn().mockResolvedValue(mockCategory);

      const result = await service.create(dto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ slug: 'clothing' });
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(mockCategory);
      expect(result).toEqual(mockCategory);
    });

    it('should throw ConflictException when slug already exists', async () => {
      repository.findOneBy = jest.fn().mockResolvedValue(mockCategory);

      await expect(
        service.create({ name: 'Electronics 2', slug: 'electronics', description: null }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update an existing category', async () => {
      const dto = { name: 'Updated Category' };
      const updated = { ...mockCategory, ...dto };

      repository.findOneBy = jest.fn().mockResolvedValueOnce(mockCategory);
      repository.save = jest.fn().mockResolvedValue(updated);

      const result = await service.update(1, dto);

      expect(repository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Category');
    });

    it('should throw NotFoundException when updating non-existent category', async () => {
      repository.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(service.update(999, { name: 'x' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should check slug uniqueness when changing slug', async () => {
      const dto = { slug: 'new-slug' };

      repository.findOneBy = jest
        .fn()
        .mockResolvedValueOnce(mockCategory) // findOne for existing category
        .mockResolvedValueOnce(null); // findOneBy for slug check

      repository.save = jest.fn().mockResolvedValue({ ...mockCategory, ...dto });

      await service.update(1, dto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ slug: 'new-slug' });
    });

    it('should throw ConflictException when new slug already exists', async () => {
      const dto = { slug: 'taken-slug' };
      const otherCategory = { ...mockCategory, id: 2, slug: 'taken-slug' };

      repository.findOneBy = jest
        .fn()
        .mockResolvedValueOnce(mockCategory) // findOne
        .mockResolvedValueOnce(otherCategory); // slug check

      await expect(service.update(1, dto)).rejects.toThrow(ConflictException);
    });

    it('should not check slug if slug unchanged', async () => {
      const dto = { name: 'Just name change' };

      repository.findOneBy = jest.fn().mockResolvedValue(mockCategory);
      repository.save = jest.fn().mockResolvedValue({ ...mockCategory, ...dto });

      await service.update(1, dto);

      // Only called once (for findOne), not for slug check
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a category and return confirmation', async () => {
      repository.findOneBy = jest.fn().mockResolvedValue(mockCategory);
      repository.remove = jest.fn().mockResolvedValue(mockCategory);

      const result = await service.remove(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.remove).toHaveBeenCalledWith(mockCategory);
      expect(result).toEqual({ message: 'Categoría #1 eliminada' });
    });

    it('should throw NotFoundException when removing non-existent category', async () => {
      repository.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
