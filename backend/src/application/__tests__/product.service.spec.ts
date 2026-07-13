import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { NotFoundException } from '@nestjs/common';
import type { IProductRepository } from '../../domain/port/output/product.repository';
import type { IProduct } from '../../domain/model/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let repository: IProductRepository;

  const mockCategory = {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    description: null,
    created_at: new Date('2025-01-01'),
  };

  const mockProduct: IProduct = {
    id: 1,
    name: 'Test Product',
    image_url: 'https://example.com/img.png',
    description: 'A test product',
    price: 50000,
    category_id: 1,
    stock: 10,
    is_active: true,
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-01'),
  };

  const mockProductRepo: IProductRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: 'IProductRepository',
          useValue: mockProductRepo,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<IProductRepository>('IProductRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated products with default params', async () => {
      const expected = {
        data: [mockProduct],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      };
      (mockProductRepo.findAll as jest.Mock).mockResolvedValue(expected);

      const result = await service.findAll({});

      expect(mockProductRepo.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(expected);
    });

    it('should pass query params to repository', async () => {
      const query = { category_id: 1, search: 'laptop', page: 2, limit: 5 };
      (mockProductRepo.findAll as jest.Mock).mockResolvedValue({ data: [], meta: { total: 0, page: 2, limit: 5, totalPages: 0 } });

      await service.findAll(query);

      expect(mockProductRepo.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      (mockProductRepo.findOne as jest.Mock).mockResolvedValue(mockProduct);

      const result = await service.findOne(1);

      expect(mockProductRepo.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product not found', async () => {
      (mockProductRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Producto #999 no encontrado');
    });
  });

  describe('create', () => {
    it('should create and save a product', async () => {
      const dto = {
        name: 'New Product',
        price: 75000,
        category_id: 1,
      };
      (mockProductRepo.create as jest.Mock).mockResolvedValue(mockProduct);
      (mockProductRepo.save as jest.Mock).mockResolvedValue(mockProduct);

      const result = await service.create(dto);

      expect(mockProductRepo.create).toHaveBeenCalledWith(dto);
      expect(mockProductRepo.save).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const dto = { name: 'Updated Product', price: 99000 };
      const updatedProduct = { ...mockProduct, ...dto };

      (mockProductRepo.findOne as jest.Mock).mockResolvedValue(mockProduct);
      (mockProductRepo.save as jest.Mock).mockResolvedValue(updatedProduct);

      const result = await service.update(1, dto);

      expect(mockProductRepo.findOne).toHaveBeenCalledWith(1);
      expect(mockProductRepo.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Product');
      expect(result.price).toBe(99000);
    });

    it('should throw NotFoundException when updating non-existent product', async () => {
      (mockProductRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.update(999, { name: 'x' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a product and return confirmation', async () => {
      (mockProductRepo.findOne as jest.Mock).mockResolvedValue(mockProduct);
      (mockProductRepo.remove as jest.Mock).mockResolvedValue(undefined);

      const result = await service.remove(1);

      expect(mockProductRepo.findOne).toHaveBeenCalledWith(1);
      expect(mockProductRepo.remove).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual({ message: 'Producto #1 eliminado' });
    });

    it('should throw NotFoundException when removing non-existent product', async () => {
      (mockProductRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
