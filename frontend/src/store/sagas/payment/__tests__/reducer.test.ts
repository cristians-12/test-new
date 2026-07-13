import { PaymentRequest, PaymentResponse, processPayment, processPaymentSuccess, processPaymentFailure, clearPayment, pollPaymentStatusSuccess, fetchPaymentHistory, fetchPaymentHistorySuccess, fetchPaymentHistoryFailure, default as paymentReducer } from '../reducer';

const mockPaymentRequest: PaymentRequest = {
  items: [{ product_id: 1, quantity: 2 }],
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
  product_quantity: [2],
  created_at: '2025-01-01T00:00:00.000Z',
};

const mockPaymentResponse2: PaymentResponse = {
  id: 2,
  reference: 'ref_1715000000001',
  amount_in_cents: 200000,
  currency: 'COP',
  customer_email: 'demo@example.com',
  status: 'APPROVED',
  product_id: 2,
  product_name: 'Other Product',
  product_quantity: [1],
  created_at: '2025-01-02T00:00:00.000Z',
};

describe('paymentReducer', () => {
  const initial = paymentReducer(undefined, { type: '@@init' });

  it('should return proper initial state', () => {
    expect(initial).toEqual({
      currentPayment: null,
      payments: [],
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

  it('should set currentPayment, add to payments and stop loading on processPaymentSuccess', () => {
    const afterRequest = paymentReducer(initial, processPayment(mockPaymentRequest));
    const state = paymentReducer(afterRequest, processPaymentSuccess(mockPaymentResponse));
    expect(state.loading).toBe(false);
    expect(state.currentPayment).toEqual(mockPaymentResponse);
    expect(state.payments).toHaveLength(1);
    expect(state.payments[0]).toEqual(mockPaymentResponse);
    expect(state.error).toBeNull();
  });

  it('should prepend new payment to existing payments on processPaymentSuccess', () => {
    const withFirst = paymentReducer(initial, processPaymentSuccess(mockPaymentResponse));
    const state = paymentReducer(withFirst, processPaymentSuccess(mockPaymentResponse2));
    expect(state.payments).toHaveLength(2);
    expect(state.payments[0]).toEqual(mockPaymentResponse2);
    expect(state.payments[1]).toEqual(mockPaymentResponse);
  });

  it('should set error and stop loading on processPaymentFailure', () => {
    const afterRequest = paymentReducer(initial, processPayment(mockPaymentRequest));
    const state = paymentReducer(afterRequest, processPaymentFailure('Connection error'));
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Connection error');
    expect(state.currentPayment).toBeNull();
  });

  it('should update currentPayment and matching payment in payments on pollPaymentStatusSuccess', () => {
    const withPayment = paymentReducer(initial, processPaymentSuccess(mockPaymentResponse));
    const updatedPayment = { ...mockPaymentResponse, status: 'APPROVED' };
    const state = paymentReducer(withPayment, pollPaymentStatusSuccess(updatedPayment));
    expect(state.currentPayment).toEqual(updatedPayment);
    expect(state.payments[0]).toEqual(updatedPayment);
  });

  it('should not modify payments if polled payment id not found', () => {
    const withPayment = paymentReducer(initial, processPaymentSuccess(mockPaymentResponse));
    const otherPayment = { ...mockPaymentResponse2, id: 999 };
    const state = paymentReducer(withPayment, pollPaymentStatusSuccess(otherPayment));
    expect(state.payments).toHaveLength(1);
    expect(state.payments[0]).toEqual(mockPaymentResponse);
  });

  it('should clear currentPayment on clearPayment', () => {
    const afterSuccess = paymentReducer(initial, processPaymentSuccess(mockPaymentResponse));
    const state = paymentReducer(afterSuccess, clearPayment());
    expect(state.currentPayment).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should clear currentPayment but keep payments on clearPayment', () => {
    const withPayment = paymentReducer(initial, processPaymentSuccess(mockPaymentResponse));
    const state = paymentReducer(withPayment, clearPayment());
    expect(state.currentPayment).toBeNull();
    expect(state.payments).toHaveLength(1);
  });

  describe('fetchPaymentHistory', () => {
    it('should set loading true', () => {
      const state = paymentReducer(initial, fetchPaymentHistory());
      expect(state.loading).toBe(true);
    });

    it('should replace payments and stop loading on fetchPaymentHistorySuccess', () => {
      const withOldPayment = paymentReducer(initial, processPaymentSuccess(mockPaymentResponse));
      const state = paymentReducer(withOldPayment, fetchPaymentHistorySuccess([mockPaymentResponse2]));
      expect(state.loading).toBe(false);
      expect(state.payments).toHaveLength(1);
      expect(state.payments[0]).toEqual(mockPaymentResponse2);
    });

    it('should set error and stop loading on fetchPaymentHistoryFailure', () => {
      const state = paymentReducer(initial, fetchPaymentHistoryFailure('Network error'));
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
    });
  });
});
