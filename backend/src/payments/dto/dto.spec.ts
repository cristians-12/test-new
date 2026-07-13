import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreatePaymentDto } from './create-payment.dto';
import { WebhookDto } from './webhook.dto';

describe('CreatePaymentDto', () => {
  it('should validate a valid create payment dto', async () => {
    const dto = plainToInstance(CreatePaymentDto, {
      items: [{ product_id: 1, quantity: 2 }],
      customer_email: 'test@example.com',
      card_number: '4242424242424242',
      cvv: '123',
      exp_month: '12',
      exp_year: '2025',
      card_holder: 'Test User',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with invalid email', async () => {
    const dto = plainToInstance(CreatePaymentDto, {
      items: [{ product_id: 1, quantity: 1 }],
      customer_email: 'invalid-email',
      card_number: '4242424242424242',
      cvv: '123',
      exp_month: '12',
      exp_year: '2025',
      card_holder: 'Test User',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail without items', async () => {
    const dto = plainToInstance(CreatePaymentDto, {
      customer_email: 'test@example.com',
      card_number: '4242424242424242',
      cvv: '123',
      exp_month: '12',
      exp_year: '2025',
      card_holder: 'Test User',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail with empty items array', async () => {
    const dto = plainToInstance(CreatePaymentDto, {
      items: [],
      customer_email: 'test@example.com',
      card_number: '4242424242424242',
      cvv: '123',
      exp_month: '12',
      exp_year: '2025',
      card_holder: 'Test User',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail with invalid product_id in items', async () => {
    const dto = plainToInstance(CreatePaymentDto, {
      items: [{ product_id: -1, quantity: 1 }],
      customer_email: 'test@example.com',
      card_number: '4242424242424242',
      cvv: '123',
      exp_month: '12',
      exp_year: '2025',
      card_holder: 'Test User',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail with invalid quantity in items', async () => {
    const dto = plainToInstance(CreatePaymentDto, {
      items: [{ product_id: 1, quantity: 0 }],
      customer_email: 'test@example.com',
      card_number: '4242424242424242',
      cvv: '123',
      exp_month: '12',
      exp_year: '2025',
      card_holder: 'Test User',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail with invalid card_number', async () => {
    const dto = plainToInstance(CreatePaymentDto, {
      items: [{ product_id: 1, quantity: 1 }],
      customer_email: 'test@example.com',
      card_number: '123',
      cvv: '123',
      exp_month: '12',
      exp_year: '2025',
      card_holder: 'Test User',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail with invalid exp_month', async () => {
    const dto = plainToInstance(CreatePaymentDto, {
      items: [{ product_id: 1, quantity: 1 }],
      customer_email: 'test@example.com',
      card_number: '4242424242424242',
      cvv: '123',
      exp_month: '13',
      exp_year: '2025',
      card_holder: 'Test User',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('WebhookDto', () => {
  it('should validate a valid webhook dto', async () => {
    const dto = plainToInstance(WebhookDto, {
      signature: 'test_signature',
      events: [
        {
          timestamp: '2024-01-01T00:00:00Z',
          event: 'transaction.updated',
          data: {
            transaction: {
              id: 123,
              reference: 'ref_123',
              status: 'APPROVED',
            },
          },
        },
      ],
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail without signature', async () => {
    const dto = plainToInstance(WebhookDto, {
      events: [],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
