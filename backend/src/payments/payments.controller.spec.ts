import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentStatus } from './payment.entity';

describe('PaymentsController', () => {
  let controller: PaymentsController;

  const mockPaymentsService = {
    create: jest.fn(),
    findOne: jest.fn(),
    handleWebhook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
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
        product_id: 1,
        customer_email: 'test@example.com',
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
      };

      mockPaymentsService.create.mockResolvedValue(expectedPayment);

      const result = await controller.create(dto);

      expect(result).toEqual(expectedPayment);
      expect(mockPaymentsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findOne', () => {
    it('should return a payment by id', async () => {
      const expectedPayment = {
        id: 1,
        reference: 'ref_123',
        status: PaymentStatus.PENDING,
      };

      mockPaymentsService.findOne.mockResolvedValue(expectedPayment);

      const result = await controller.findOne(1);

      expect(result).toEqual(expectedPayment);
      expect(mockPaymentsService.findOne).toHaveBeenCalledWith(1);
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

      mockPaymentsService.handleWebhook.mockResolvedValue(undefined);

      await controller.handleWebhook(body);

      expect(mockPaymentsService.handleWebhook).toHaveBeenCalledWith(
        body.signature,
        body.events,
      );
    });
  });
});
