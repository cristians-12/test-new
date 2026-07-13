import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../categories.controller';
import type { ICategoryUseCase } from '../../../../domain/port/input/category.port';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const mockCategory = {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices',
    created_at: new Date('2025-01-01'),
  };

  const mockCategoriesService: ICategoryUseCase = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findOneBySlug: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: 'ICategoryUseCase',
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      (mockCategoriesService.findAll as jest.Mock).mockResolvedValue([mockCategory]);

      const result = await controller.findAll();

      expect(mockCategoriesService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockCategory]);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      (mockCategoriesService.findOne as jest.Mock).mockResolvedValue(mockCategory);

      const result = await controller.findOne(1);

      expect(mockCategoriesService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCategory);
    });
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto = { name: 'Clothing', slug: 'clothing' };
      (mockCategoriesService.create as jest.Mock).mockResolvedValue({ ...mockCategory, ...dto });

      const result = await controller.create(dto);

      expect(mockCategoriesService.create).toHaveBeenCalledWith(dto);
      expect(result.name).toBe('Clothing');
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto = { name: 'Updated' };
      const updated = { ...mockCategory, name: 'Updated' };
      (mockCategoriesService.update as jest.Mock).mockResolvedValue(updated);

      const result = await controller.update(1, dto);

      expect(mockCategoriesService.update).toHaveBeenCalledWith(1, dto);
      expect(result.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', async () => {
      const expected = { message: 'Categoría #1 eliminada' };
      (mockCategoriesService.remove as jest.Mock).mockResolvedValue(expected);

      const result = await controller.remove(1);

      expect(mockCategoriesService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expected);
    });
  });
});
