import { PaymentRequest, PaymentResponse, processPayment, processPaymentSuccess, processPaymentFailure, clearPayment, default as paymentReducer } from '../reducer';

const mockPaymentRequest: PaymentRequest = {
  product_id: 1,
  customer_email: 'demo@example.com',
  card_number: '4111111111111111',
  cvv: '123',
  exp_month: '12',
  exp_year: '2027',
  card_holder: 'Test User',
};

const mockPaymentResponse: PaymentResponse = {
  id: 1,
  reference: 'ref_1715000000000',
  amount_in_cents: 1500000,
  currency: 'COP',
  customer_email: 'demo@example.com',
  status: 'PENDING',
  product_id: 1,
  product_name: 'Test Product',
  created_at: '2025-01-01T00:00:00.000Z',
};

describe('paymentReducer', () => {
  const initial = paymentReducer(undefined, { type: '@@init' });

  it('should return proper initial state', () => {
    expect(initial).toEqual({
      currentPayment: null,
      loading: false,
      error: null,
    });
  });

  it('should set loading true on processPayment', () => {
    const state = paymentReducer(initial, processPayment(mockPaymentRequest));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.currentPayment).toBeNull();
  });

  it('should set currentPayment and stop loading on processPaymentSuccess', () => {
    const afterRequest = paymentReducer(initial, processPayment(mockPaymentRequest));
    const state = paymentReducer(afterRequest, processPaymentSuccess(mockPaymentResponse));
    expect(state.loading).toBe(false);
    expect(state.currentPayment).toEqual(mockPaymentResponse);
    expect(state.error).toBeNull();
  });

  it('should set error and stop loading on processPaymentFailure', () => {
    const afterRequest = paymentReducer(initial, processPayment(mockPaymentRequest));
    const state = paymentReducer(afterRequest, processPaymentFailure('Connection error'));
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Connection error');
    expect(state.currentPayment).toBeNull();
  });

  it('should clear all payment state on clearPayment', () => {
    const afterSuccess = paymentReducer(initial, processPaymentSuccess(mockPaymentResponse));
    const state = paymentReducer(afterSuccess, clearPayment());
    expect(state).toEqual({
      currentPayment: null,
      loading: false,
      error: null,
    });
  });
});
