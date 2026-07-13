import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { Payment, PaymentStatus } from './payment.entity';
import { Product } from '../products/product.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockComputeSignature = async (events: any[]): Promise<string> => {
  const eventsJson = JSON.stringify(events);
  const encoder = new TextEncoder();
  const data = encoder.encode(eventsJson);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

describe('PaymentsService', () => {
  let service: PaymentsService;

  const mockPayment = {
    id: 1,
    reference: 'test_ref_123',
    amount_in_cents: 50000,
    currency: 'COP',
    customer_email: 'test@example.com',
    status: PaymentStatus.PENDING,
    wompi_transaction_id: null,
    product_id: 1,
    product_name: 'Test Product',
    product_quantity: [2],
    payment_method: null,
    response_data: null,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 500,
    stock: 10,
    is_active: true,
    category_id: 1,
    image_url: null,
    description: null,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockPaymentRepo = {
    create: jest.fn().mockReturnValue(mockPayment),
    save: jest.fn().mockResolvedValue(mockPayment),
    find: jest.fn().mockResolvedValue([mockPayment]),
    findOneBy: jest.fn(),
  };

  const mockProductRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue: string) => {
      const config: Record<string, string> = {
        WOMPI_API_URL: 'https://sandbox.wompi.co/v1',
        WOMPI_PUBLIC_KEY: 'pub_test',
        WOMPI_PRIVATE_KEY: 'prv_test',
        WOMPI_EVENTS_KEY: 'events_test',
        WOMPI_INTEGRITY_KEY: 'integrity_test',
      };
      return config[key] || defaultValue;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepo,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepo,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a payment successfully', async () => {
      mockProductRepo.findOneBy.mockResolvedValue(mockProduct);
      mockPaymentRepo.findOneBy.mockResolvedValue(null);
      mockPaymentRepo.create.mockReturnValue(mockPayment);
      mockPaymentRepo.save.mockResolvedValue(mockPayment);

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: { id: 123 } }),
      });

      const result = await service.create({
        items: [{ product_id: 1, quantity: 2 }],
        customer_email: 'test@example.com',
        card_number: '4242424242424242',
        cvv: '123',
        exp_month: '12',
        exp_year: '2025',
        card_holder: 'APPROVED',
      });

      expect(result).toEqual(mockPayment);
      expect(mockProductRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepo.findOneBy.mockResolvedValue(null);

      await expect(
        service.create({
          items: [{ product_id: 999, quantity: 1 }],
          customer_email: 'test@example.com',
          card_number: '4242424242424242',
          cvv: '123',
          exp_month: '12',
          exp_year: '2025',
          card_holder: 'APPROVED',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if product is inactive', async () => {
      mockProductRepo.findOneBy.mockResolvedValue({
        ...mockProduct,
        is_active: false,
      });

      await expect(
        service.create({
          items: [{ product_id: 1, quantity: 1 }],
          customer_email: 'test@example.com',
          card_number: '4242424242424242',
          cvv: '123',
          exp_month: '12',
          exp_year: '2025',
          card_holder: 'APPROVED',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if product has no stock', async () => {
      mockProductRepo.findOneBy.mockResolvedValue({
        ...mockProduct,
        stock: 0,
      });

      await expect(
        service.create({
          items: [{ product_id: 1, quantity: 1 }],
          customer_email: 'test@example.com',
          card_number: '4242424242424242',
          cvv: '123',
          exp_month: '12',
          exp_year: '2025',
          card_holder: 'APPROVED',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if reference already exists', async () => {
      mockProductRepo.findOneBy.mockResolvedValue(mockProduct);
      mockPaymentRepo.findOneBy.mockResolvedValue(mockPayment);

      await expect(
        service.create({
          items: [{ product_id: 1, quantity: 1 }],
          customer_email: 'test@example.com',
          reference: 'existing_ref',
          card_number: '4242424242424242',
          cvv: '123',
          exp_month: '12',
          exp_year: '2025',
          card_holder: 'APPROVED',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all payments ordered by created_at DESC', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockPayment]);
      expect(mockPaymentRepo.find).toHaveBeenCalledWith({
        order: { created_at: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a payment by id', async () => {
      mockPaymentRepo.findOneBy.mockResolvedValue(mockPayment);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPayment);
      expect(mockPaymentRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if payment not found', async () => {
      mockPaymentRepo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByReference', () => {
    it('should return a payment by reference', async () => {
      mockPaymentRepo.findOneBy.mockResolvedValue(mockPayment);

      const result = await service.findByReference('test_ref_123');

      expect(result).toEqual(mockPayment);
      expect(mockPaymentRepo.findOneBy).toHaveBeenCalledWith({
        reference: 'test_ref_123',
      });
    });

    it('should throw NotFoundException if payment not found by reference', async () => {
      mockPaymentRepo.findOneBy.mockResolvedValue(null);

      await expect(service.findByReference('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('refreshPendingPayments', () => {
    it('should return all payments after refreshing pending ones', async () => {
      const result = await service.refreshPendingPayments();
      expect(result).toEqual([mockPayment]);
      expect(mockPaymentRepo.find).toHaveBeenCalled();
    });
  });

  describe('handleWebhook', () => {
    it('should throw BadRequestException for invalid signature', async () => {
      await expect(
        service.handleWebhook('invalid_signature', [
          {
            event: 'transaction.updated',
            data: { transaction: { id: 123, reference: 'test_ref', status: 'APPROVED' } },
          },
        ]),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update transaction status on valid webhook event', async () => {
      const events = [
        {
          event: 'transaction.updated',
          data: { transaction: { id: 123, reference: 'test_ref', status: 'APPROVED' } },
        },
      ];
      const validSignature = await mockComputeSignature(events);

      const paymentWithWompiId = { ...mockPayment, wompi_transaction_id: '123' };
      mockPaymentRepo.findOneBy.mockResolvedValue(paymentWithWompiId);
      mockProductRepo.findOneBy.mockResolvedValue(mockProduct);
      mockPaymentRepo.save.mockResolvedValue({
        ...paymentWithWompiId,
        status: PaymentStatus.APPROVED,
      });
      mockProductRepo.save.mockResolvedValue({ ...mockProduct, stock: 9 });

      await service.handleWebhook(validSignature, events);

      expect(mockPaymentRepo.findOneBy).toHaveBeenCalledWith({
        wompi_transaction_id: '123',
      });
    });

    it('should handle non-transaction.updated events gracefully', async () => {
      const events = [{ event: 'other.event', data: {} }];
      const validSignature = await mockComputeSignature(events);

      await service.handleWebhook(validSignature, events);

      expect(mockPaymentRepo.findOneBy).not.toHaveBeenCalled();
    });

    it('should handle missing transaction data', async () => {
      const events = [
        { event: 'transaction.updated', data: {} },
      ];
      const validSignature = await mockComputeSignature(events);

      await service.handleWebhook(validSignature, events);

      expect(mockPaymentRepo.findOneBy).not.toHaveBeenCalled();
    });
  });

  describe('mapWompiStatus', () => {
    it('should map APPROVED status', async () => {
      const events = [
        {
          event: 'transaction.updated',
          data: { transaction: { id: 123, status: 'APPROVED' } },
        },
      ];
      const validSignature = await mockComputeSignature(events);

      const paymentWithWompiId = { ...mockPayment, wompi_transaction_id: '123' };
      mockPaymentRepo.findOneBy.mockResolvedValue(paymentWithWompiId);
      mockProductRepo.findOneBy.mockResolvedValue(mockProduct);
      mockPaymentRepo.save.mockResolvedValue({
        ...paymentWithWompiId,
        status: PaymentStatus.APPROVED,
      });
      mockProductRepo.save.mockResolvedValue({ ...mockProduct, stock: 9 });

      await service.handleWebhook(validSignature, events);

      const savedPayment = mockPaymentRepo.save.mock.calls[0][0];
      expect(savedPayment.status).toBe(PaymentStatus.APPROVED);
    });

    it('should map DECLINED status', async () => {
      const events = [
        {
          event: 'transaction.updated',
          data: { transaction: { id: 456, status: 'DECLINED' } },
        },
      ];
      const validSignature = await mockComputeSignature(events);

      const paymentWithWompiId = { ...mockPayment, wompi_transaction_id: '456' };
      mockPaymentRepo.findOneBy.mockResolvedValue(paymentWithWompiId);
      mockPaymentRepo.save.mockResolvedValue({
        ...paymentWithWompiId,
        status: PaymentStatus.DECLINED,
      });

      await service.handleWebhook(validSignature, events);

      const savedPayment = mockPaymentRepo.save.mock.calls[0][0];
      expect(savedPayment.status).toBe(PaymentStatus.DECLINED);
    });

    it('should map VOIDED status', async () => {
      const events = [
        {
          event: 'transaction.updated',
          data: { transaction: { id: 789, status: 'VOIDED' } },
        },
      ];
      const validSignature = await mockComputeSignature(events);

      const paymentWithWompiId = { ...mockPayment, wompi_transaction_id: '789' };
      mockPaymentRepo.findOneBy.mockResolvedValue(paymentWithWompiId);
      mockPaymentRepo.save.mockResolvedValue({
        ...paymentWithWompiId,
        status: PaymentStatus.VOIDED,
      });

      await service.handleWebhook(validSignature, events);

      const savedPayment = mockPaymentRepo.save.mock.calls[0][0];
      expect(savedPayment.status).toBe(PaymentStatus.VOIDED);
    });

    it('should map ERROR status', async () => {
      const events = [
        {
          event: 'transaction.updated',
          data: { transaction: { id: 999, status: 'ERROR' } },
        },
      ];
      const validSignature = await mockComputeSignature(events);

      const paymentWithWompiId = { ...mockPayment, wompi_transaction_id: '999' };
      mockPaymentRepo.findOneBy.mockResolvedValue(paymentWithWompiId);
      mockPaymentRepo.save.mockResolvedValue({
        ...paymentWithWompiId,
        status: PaymentStatus.ERROR,
      });

      await service.handleWebhook(validSignature, events);

      const savedPayment = mockPaymentRepo.save.mock.calls[0][0];
      expect(savedPayment.status).toBe(PaymentStatus.ERROR);
    });

    it('should map unknown status to ERROR', async () => {
      const events = [
        {
          event: 'transaction.updated',
          data: { transaction: { id: 111, status: 'UNKNOWN' } },
        },
      ];
      const validSignature = await mockComputeSignature(events);

      const paymentWithWompiId = { ...mockPayment, wompi_transaction_id: '111' };
      mockPaymentRepo.findOneBy.mockResolvedValue(paymentWithWompiId);
      mockPaymentRepo.save.mockResolvedValue({
        ...paymentWithWompiId,
        status: PaymentStatus.ERROR,
      });

      await service.handleWebhook(validSignature, events);

      const savedPayment = mockPaymentRepo.save.mock.calls[0][0];
      expect(savedPayment.status).toBe(PaymentStatus.ERROR);
    });
  });
});
