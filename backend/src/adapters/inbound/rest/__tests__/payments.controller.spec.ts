import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from '../payments.controller';
import type { IPaymentUseCase } from '../../../../domain/port/input/payment.port';
import { PaymentStatus } from '../../../../domain/model/payment.model';

describe('PaymentsController', () => {
  let controller: PaymentsController;

  const mockPaymentsService: IPaymentUseCase = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByReference: jest.fn(),
    refreshPendingPayments: jest.fn(),
    handleWebhook: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: 'IPaymentUseCase',
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a payment', async () => {
      const dto = {
        items: [{ product_id: 1, quantity: 2 }],
        customer_email: 'test@example.com',
        card_number: '4242424242424242',
        cvv: '123',
        exp_month: '12',
        exp_year: '2025',
        card_holder: 'Test',
      };
      const expectedPayment = {
        id: 1,
        reference: 'ref_123',
        amount_in_cents: 50000,
        currency: 'COP',
        customer_email: 'test@example.com',
        status: PaymentStatus.PENDING,
        product_id: 1,
        product_name: 'Test Product',
        product_quantity: [2],
      };

      (mockPaymentsService.create as jest.Mock).mockResolvedValue(expectedPayment);

      const result = await controller.create(dto);

      expect(result).toEqual(expectedPayment);
      expect(mockPaymentsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all payments', async () => {
      const expectedPayments = [
        { id: 1, reference: 'ref_123', status: PaymentStatus.PENDING },
      ];

      (mockPaymentsService.findAll as jest.Mock).mockResolvedValue(expectedPayments);

      const result = await controller.findAll();

      expect(result).toEqual(expectedPayments);
      expect(mockPaymentsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a payment by id', async () => {
      const expectedPayment = {
        id: 1,
        reference: 'ref_123',
        status: PaymentStatus.PENDING,
      };

      (mockPaymentsService.findOne as jest.Mock).mockResolvedValue(expectedPayment);

      const result = await controller.findOne(1);

      expect(result).toEqual(expectedPayment);
      expect(mockPaymentsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('refreshPendingPayments', () => {
    it('should refresh pending payments and return all', async () => {
      const expectedPayments = [
        { id: 1, reference: 'ref_123', status: PaymentStatus.APPROVED },
      ];

      (mockPaymentsService.refreshPendingPayments as jest.Mock).mockResolvedValue(expectedPayments);

      const result = await controller.refreshPendingPayments();

      expect(result).toEqual(expectedPayments);
      expect(mockPaymentsService.refreshPendingPayments).toHaveBeenCalled();
    });
  });

  describe('handleWebhook', () => {
    it('should handle webhook events', async () => {
      const body = {
        signature: 'test_signature',
        events: [
          {
            event: 'transaction.updated',
            data: { transaction: { id: 123, status: 'APPROVED' } },
          },
        ],
      };

      (mockPaymentsService.handleWebhook as jest.Mock).mockResolvedValue(undefined);

      await controller.handleWebhook(body);

      expect(mockPaymentsService.handleWebhook).toHaveBeenCalledWith(
        body.signature,
        body.events,
      );
    });
  });
});
