import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from '../payment.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import type { IPaymentRepository } from '../../domain/port/output/payment.repository';
import type { IProductRepository } from '../../domain/port/output/product.repository';
import type { IWompiGateway } from '../../domain/port/output/wompi.gateway';
import type { IPayment } from '../../domain/model/payment.model';
import { PaymentStatus } from '../../domain/model/payment.model';
import type { IProduct } from '../../domain/model/product.model';

const computeSignature = async (events: any[]): Promise<string> => {
  const eventsJson = JSON.stringify(events);
  const encoder = new TextEncoder();
  const data = encoder.encode(eventsJson);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

describe('PaymentService', () => {
  let service: PaymentService;

  const mockPayment: IPayment = {
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

  const mockProduct: IProduct = {
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

  const mockPaymentRepo: IPaymentRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findOneByReference: jest.fn(),
    findPending: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockProductRepo: IProductRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockWompiGateway: IWompiGateway = {
    getAcceptanceToken: jest.fn(),
    tokenizeCard: jest.fn(),
    createTransaction: jest.fn(),
    getTransaction: jest.fn(),
    generateSignature: jest.fn(),
    validateWebhookSignature: jest.fn(),
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

    (mockWompiGateway.generateSignature as jest.Mock).mockResolvedValue('abc123');
    (mockWompiGateway.getAcceptanceToken as jest.Mock).mockResolvedValue('token_abc');
    (mockWompiGateway.tokenizeCard as jest.Mock).mockResolvedValue('card_token_123');
    (mockWompiGateway.createTransaction as jest.Mock).mockResolvedValue({ data: { id: 123 } });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: 'IPaymentRepository',
          useValue: mockPaymentRepo,
        },
        {
          provide: 'IProductRepository',
          useValue: mockProductRepo,
        },
        {
          provide: 'IWompiGateway',
          useValue: mockWompiGateway,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a payment successfully', async () => {
      (mockProductRepo.findOne as jest.Mock).mockResolvedValue(mockProduct);
      (mockPaymentRepo.findOneByReference as jest.Mock).mockResolvedValue(null);
      (mockPaymentRepo.create as jest.Mock).mockResolvedValue(mockPayment);
      (mockPaymentRepo.save as jest.Mock).mockResolvedValue(mockPayment);

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
      expect(mockProductRepo.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if product not found', async () => {
      (mockProductRepo.findOne as jest.Mock).mockResolvedValue(null);

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
      (mockProductRepo.findOne as jest.Mock).mockResolvedValue({
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
      (mockProductRepo.findOne as jest.Mock).mockResolvedValue({
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
      (mockProductRepo.findOne as jest.Mock).mockResolvedValue(mockProduct);
      (mockPaymentRepo.findOneByReference as jest.Mock).mockResolvedValue(mockPayment);

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
      (mockPaymentRepo.findAll as jest.Mock).mockResolvedValue([mockPayment]);

      const result = await service.findAll();
      expect(result).toEqual([mockPayment]);
      expect(mockPaymentRepo.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a payment by id', async () => {
      (mockPaymentRepo.findOne as jest.Mock).mockResolvedValue(mockPayment);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPayment);
      expect(mockPaymentRepo.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if payment not found', async () => {
      (mockPaymentRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByReference', () => {
    it('should return a payment by reference', async () => {
      (mockPaymentRepo.findOneByReference as jest.Mock).mockResolvedValue(mockPayment);

      const result = await service.findByReference('test_ref_123');

      expect(result).toEqual(mockPayment);
      expect(mockPaymentRepo.findOneByReference).toHaveBeenCalledWith('test_ref_123');
    });

    it('should throw NotFoundException if payment not found by reference', async () => {
      (mockPaymentRepo.findOneByReference as jest.Mock).mockResolvedValue(null);

      await expect(service.findByReference('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('refreshPendingPayments', () => {
    it('should return all payments after refreshing pending ones', async () => {
      (mockPaymentRepo.findPending as jest.Mock).mockResolvedValue([]);
      (mockPaymentRepo.findAll as jest.Mock).mockResolvedValue([mockPayment]);

      const result = await service.refreshPendingPayments();
      expect(result).toEqual([mockPayment]);
      expect(mockPaymentRepo.findPending).toHaveBeenCalled();
      expect(mockPaymentRepo.findAll).toHaveBeenCalled();
    });
  });

  describe('handleWebhook', () => {
    it('should throw BadRequestException for invalid signature', async () => {
      (mockWompiGateway.validateWebhookSignature as jest.Mock).mockResolvedValue(false);

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

      (mockWompiGateway.validateWebhookSignature as jest.Mock).mockResolvedValue(true);
      (mockPaymentRepo.findAll as jest.Mock).mockResolvedValue([
        { ...mockPayment, wompi_transaction_id: '123' },
      ]);
      (mockProductRepo.findOne as jest.Mock).mockResolvedValue(mockProduct);
      (mockPaymentRepo.save as jest.Mock).mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.APPROVED,
      });

      await service.handleWebhook('valid_signature', events);

      expect(mockPaymentRepo.save).toHaveBeenCalled();
    });

    it('should handle non-transaction.updated events gracefully', async () => {
      const events = [{ event: 'other.event', data: {} }];
      (mockWompiGateway.validateWebhookSignature as jest.Mock).mockResolvedValue(true);

      await service.handleWebhook('valid_signature', events);

      expect(mockPaymentRepo.findAll).not.toHaveBeenCalled();
    });

    it('should handle missing transaction data', async () => {
      const events = [
        { event: 'transaction.updated', data: {} },
      ];
      (mockWompiGateway.validateWebhookSignature as jest.Mock).mockResolvedValue(true);

      await service.handleWebhook('valid_signature', events);

      expect(mockPaymentRepo.findAll).not.toHaveBeenCalled();
    });
  });

  describe('mapWompiStatus', () => {
    const statusTests = [
      { wompiStatus: 'APPROVED', expected: PaymentStatus.APPROVED },
      { wompiStatus: 'DECLINED', expected: PaymentStatus.DECLINED },
      { wompiStatus: 'VOIDED', expected: PaymentStatus.VOIDED },
      { wompiStatus: 'ERROR', expected: PaymentStatus.ERROR },
      { wompiStatus: 'UNKNOWN', expected: PaymentStatus.ERROR },
    ];

    it.each(statusTests)('should map $wompiStatus to $expected', async ({ wompiStatus, expected }) => {
      const events = [
        {
          event: 'transaction.updated',
          data: { transaction: { id: 123, status: wompiStatus } },
        },
      ];

      (mockWompiGateway.validateWebhookSignature as jest.Mock).mockResolvedValue(true);
      (mockPaymentRepo.findAll as jest.Mock).mockResolvedValue([
        { ...mockPayment, wompi_transaction_id: '123' },
      ]);
      (mockProductRepo.findOne as jest.Mock).mockResolvedValue(mockProduct);
      (mockPaymentRepo.save as jest.Mock).mockResolvedValue({
        ...mockPayment,
        status: expected,
      });

      await service.handleWebhook('valid_signature', events);

      const savedPayment = (mockPaymentRepo.save as jest.Mock).mock.calls[0][0];
      expect(savedPayment.status).toBe(expected);
    });
  });
});
