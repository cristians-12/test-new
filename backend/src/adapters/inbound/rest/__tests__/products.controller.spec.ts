import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ProductsController } from '../products.controller';
import type { IProductUseCase } from '../../../../domain/port/input/product.port';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    image_url: 'https://example.com/img.png',
    description: 'A test product',
    price: 50000,
    category_id: 1,
    category: { id: 1, name: 'Electronics', slug: 'electronics' },
    stock: 10,
    is_active: true,
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-01'),
  };

  const mockCacheManager = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    clear: jest.fn().mockResolvedValue(undefined),
  };

  const mockProductsService: IProductUseCase = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockCacheManager.get.mockResolvedValue(null);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: 'IProductUseCase',
          useValue: mockProductsService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll with query params', async () => {
      const query = { category_id: 1, page: 1, limit: 10 };
      const expected = {
        data: [mockProduct],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      };
      (mockProductsService.findAll as jest.Mock).mockResolvedValue(expected);

      const result = await controller.findAll(query);

      expect(mockProductsService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });

    it('should return cached result when available', async () => {
      const cachedResult = { data: [mockProduct], meta: { total: 1, page: 1, limit: 20, totalPages: 1 } };
      mockCacheManager.get.mockResolvedValue(cachedResult);

      const result = await controller.findAll({});

      expect(result).toEqual(cachedResult);
      expect(mockProductsService.findAll).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      (mockProductsService.findOne as jest.Mock).mockResolvedValue(mockProduct);

      const result = await controller.findOne(1);

      expect(mockProductsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto = {
        name: 'New Product',
        price: 75000,
        category_id: 1,
      };
      (mockProductsService.create as jest.Mock).mockResolvedValue({ ...mockProduct, ...dto });

      const result = await controller.create(dto);

      expect(mockProductsService.create).toHaveBeenCalledWith(dto);
      expect(result.name).toBe('New Product');
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto = { name: 'Updated' };
      const updated = { ...mockProduct, name: 'Updated' };
      (mockProductsService.update as jest.Mock).mockResolvedValue(updated);

      const result = await controller.update(1, dto);

      expect(mockProductsService.update).toHaveBeenCalledWith(1, dto);
      expect(result.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', async () => {
      const expected = { message: 'Producto #1 eliminado' };
      (mockProductsService.remove as jest.Mock).mockResolvedValue(expected);

      const result = await controller.remove(1);

      expect(mockProductsService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expected);
    });
  });
});
