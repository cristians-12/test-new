import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: MockRepository<Product>;

  const mockCategory = {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    description: null,
    created_at: new Date('2025-01-01'),
  };

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    image_url: 'https://example.com/img.png',
    description: 'A test product',
    price: 50000,
    category_id: 1,
    category: mockCategory as any,
    stock: 10,
    is_active: true,
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<MockRepository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated products with default params', async () => {
      const mockQb: any = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockProduct], 1]),
      };
      repository.createQueryBuilder = jest.fn().mockReturnValue(mockQb);

      const result = await service.findAll({});

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(mockQb.orderBy).toHaveBeenCalledWith('product.created_at', 'DESC');
      expect(mockQb.skip).toHaveBeenCalledWith(0);
      expect(mockQb.take).toHaveBeenCalledWith(20);
      expect(result).toEqual({
        data: [mockProduct],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      });
    });

    it('should filter by category_id', async () => {
      const mockQb: any = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      repository.createQueryBuilder = jest.fn().mockReturnValue(mockQb);

      await service.findAll({ category_id: 1 });

      expect(mockQb.andWhere).toHaveBeenCalledWith(
        'product.category_id = :category_id',
        { category_id: 1 },
      );
    });

    it('should filter by search term', async () => {
      const mockQb: any = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      repository.createQueryBuilder = jest.fn().mockReturnValue(mockQb);

      await service.findAll({ search: 'laptop' });

      expect(mockQb.andWhere).toHaveBeenCalledWith(
        '(unaccent(product.name) ILIKE unaccent(:search) OR unaccent(product.description) ILIKE unaccent(:search))',
        { search: '%laptop%' },
      );
    });

    it('should filter by min_price', async () => {
      const mockQb: any = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      repository.createQueryBuilder = jest.fn().mockReturnValue(mockQb);

      await service.findAll({ min_price: 10000 });

      expect(mockQb.andWhere).toHaveBeenCalledWith('product.price >= :min_price', {
        min_price: 10000,
      });
    });

    it('should filter by max_price', async () => {
      const mockQb: any = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      repository.createQueryBuilder = jest.fn().mockReturnValue(mockQb);

      await service.findAll({ max_price: 100000 });

      expect(mockQb.andWhere).toHaveBeenCalledWith('product.price <= :max_price', {
        max_price: 100000,
      });
    });

    it('should apply pagination correctly', async () => {
      const mockQb: any = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      repository.createQueryBuilder = jest.fn().mockReturnValue(mockQb);

      const result = await service.findAll({ page: 3, limit: 10 });

      expect(mockQb.skip).toHaveBeenCalledWith(20);
      expect(mockQb.take).toHaveBeenCalledWith(10);
      expect(result.meta).toEqual({ total: 0, page: 3, limit: 10, totalPages: 0 });
    });

    it('should combine multiple filters', async () => {
      const mockQb: any = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockProduct], 1]),
      };
      repository.createQueryBuilder = jest.fn().mockReturnValue(mockQb);

      const result = await service.findAll({
        category_id: 1,
        search: 'laptop',
        min_price: 10000,
        max_price: 200000,
        page: 1,
        limit: 5,
      });

      expect(mockQb.andWhere).toHaveBeenCalledTimes(4);
      expect(result.data).toEqual([mockProduct]);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      repository.findOneBy = jest.fn().mockResolvedValue(mockProduct);

      const result = await service.findOne(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product not found', async () => {
      repository.findOneBy = jest.fn().mockResolvedValue(null);

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
      repository.create = jest.fn().mockReturnValue(mockProduct);
      repository.save = jest.fn().mockResolvedValue(mockProduct);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const dto = { name: 'Updated Product', price: 99000 };
      const updatedProduct = { ...mockProduct, ...dto };

      repository.findOneBy = jest.fn().mockResolvedValue(mockProduct);
      repository.save = jest.fn().mockResolvedValue(updatedProduct);

      const result = await service.update(1, dto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Product');
      expect(result.price).toBe(99000);
    });

    it('should throw NotFoundException when updating non-existent product', async () => {
      repository.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(service.update(999, { name: 'x' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a product and return confirmation', async () => {
      repository.findOneBy = jest.fn().mockResolvedValue(mockProduct);
      repository.remove = jest.fn().mockResolvedValue(mockProduct);

      const result = await service.remove(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.remove).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual({ message: 'Producto #1 eliminado' });
    });

    it('should throw NotFoundException when removing non-existent product', async () => {
      repository.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
