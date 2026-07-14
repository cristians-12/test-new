import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import type { ICategoryRepository } from '../../domain/port/output/category.repository';
import type { ICategory } from '../../domain/model/category.model';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: ICategoryRepository;

  const mockCategory: ICategory = {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices',
    created_at: new Date('2025-01-01'),
  };

  const mockCategoryRepo: ICategoryRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findOneBySlug: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: 'ICategoryRepository',
          useValue: mockCategoryRepo,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<ICategoryRepository>('ICategoryRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all categories ordered by name', async () => {
      (mockCategoryRepo.findAll as jest.Mock).mockResolvedValue([mockCategory]);

      const result = await service.findAll();

      expect(mockCategoryRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockCategory]);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      (mockCategoryRepo.findOne as jest.Mock).mockResolvedValue(mockCategory);

      const result = await service.findOne(1);

      expect(mockCategoryRepo.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException when not found', async () => {
      (mockCategoryRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneBySlug', () => {
    it('should return a category by slug', async () => {
      (mockCategoryRepo.findOneBySlug as jest.Mock).mockResolvedValue(mockCategory);

      const result = await service.findOneBySlug('electronics');

      expect(mockCategoryRepo.findOneBySlug).toHaveBeenCalledWith('electronics');
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException when slug not found', async () => {
      (mockCategoryRepo.findOneBySlug as jest.Mock).mockResolvedValue(null);

      await expect(service.findOneBySlug('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and save a category', async () => {
      const dto = { name: 'Clothing', slug: 'clothing' };
      (mockCategoryRepo.findOneBySlug as jest.Mock).mockResolvedValue(null);
      (mockCategoryRepo.create as jest.Mock).mockResolvedValue(mockCategory);
      (mockCategoryRepo.save as jest.Mock).mockResolvedValue(mockCategory);

      const result = await service.create(dto);

      expect(mockCategoryRepo.findOneBySlug).toHaveBeenCalledWith('clothing');
      expect(mockCategoryRepo.create).toHaveBeenCalledWith(dto);
      expect(mockCategoryRepo.save).toHaveBeenCalled();
      expect(result).toEqual(mockCategory);
    });

    it('should throw ConflictException when slug already exists', async () => {
      (mockCategoryRepo.findOneBySlug as jest.Mock).mockResolvedValue(mockCategory);

      await expect(
        service.create({ name: 'Electronics 2', slug: 'electronics' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update an existing category', async () => {
      const dto = { name: 'Updated Category' };
      const updated = { ...mockCategory, ...dto };

      (mockCategoryRepo.findOne as jest.Mock).mockResolvedValue(mockCategory);
      (mockCategoryRepo.save as jest.Mock).mockResolvedValue(updated);

      const result = await service.update(1, dto);

      expect(mockCategoryRepo.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Category');
    });

    it('should throw NotFoundException when updating non-existent category', async () => {
      (mockCategoryRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.update(999, { name: 'x' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should check slug uniqueness when changing slug', async () => {
      const dto = { slug: 'new-slug' };

      (mockCategoryRepo.findOne as jest.Mock).mockResolvedValue(mockCategory);
      (mockCategoryRepo.findOneBySlug as jest.Mock).mockResolvedValue(null);
      (mockCategoryRepo.save as jest.Mock).mockResolvedValue({ ...mockCategory, ...dto });

      await service.update(1, dto);

      expect(mockCategoryRepo.findOneBySlug).toHaveBeenCalledWith('new-slug');
    });

    it('should throw ConflictException when new slug already exists', async () => {
      const dto = { slug: 'taken-slug' };
      const otherCategory = { ...mockCategory, id: 2, slug: 'taken-slug' };

      (mockCategoryRepo.findOne as jest.Mock).mockResolvedValue(mockCategory);
      (mockCategoryRepo.findOneBySlug as jest.Mock).mockResolvedValue(otherCategory);

      await expect(service.update(1, dto)).rejects.toThrow(ConflictException);
    });

    it('should not check slug if slug unchanged', async () => {
      const dto = { name: 'Just name change' };

      (mockCategoryRepo.findOne as jest.Mock).mockResolvedValue(mockCategory);
      (mockCategoryRepo.save as jest.Mock).mockResolvedValue({ ...mockCategory, ...dto });

      await service.update(1, dto);

      expect(mockCategoryRepo.findOneBySlug).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a category and return confirmation', async () => {
      (mockCategoryRepo.findOne as jest.Mock).mockResolvedValue(mockCategory);
      (mockCategoryRepo.remove as jest.Mock).mockResolvedValue(undefined);

      const result = await service.remove(1);

      expect(mockCategoryRepo.findOne).toHaveBeenCalledWith(1);
      expect(mockCategoryRepo.remove).toHaveBeenCalledWith(mockCategory);
      expect(result).toEqual({ message: 'Categoría #1 eliminada' });
    });

    it('should throw NotFoundException when removing non-existent category', async () => {
      (mockCategoryRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
