import { call, put } from 'redux-saga/effects';
import { processPayment, processPaymentSuccess, processPaymentFailure } from '../reducer';
import { processPaymentSaga, watchPayment } from '../saga';

jest.mock('../../../../api/api', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

import apiClient from '../../../../api/api';

const mockPaymentPayload = {
  items: [{ product_id: 1, quantity: 2 }],
  customer_email: 'demo@example.com',
  card_number: '4111111111111111',
  cvv: '123',
  exp_month: '12',
  exp_year: '2027',
  card_holder: 'Test User',
};

const mockPaymentResponse = {
  id: 1,
  reference: 'ref_1715000000000',
  amount_in_cents: 150000,
  currency: 'COP',
  customer_email: 'demo@example.com',
  status: 'APPROVED',
  product_id: 1,
  product_name: 'Test Product',
  created_at: '2025-01-01T00:00:00.000Z',
};

describe('processPaymentSaga', () => {
  it('should call api POST /payments and dispatch processPaymentSuccess', () => {
    const action = processPayment(mockPaymentPayload);
    const gen = processPaymentSaga(action);

    const callEffect = gen.next().value;
    expect(callEffect).toEqual(call([apiClient, 'post'], '/payments', mockPaymentPayload));

    const putEffect = gen.next({ data: mockPaymentResponse }).value;
    expect(putEffect).toEqual(put(processPaymentSuccess(mockPaymentResponse)));

    expect(gen.next().done).toBe(true);
  });

  it('should dispatch processPaymentFailure on network error', () => {
    const action = processPayment(mockPaymentPayload);
    const gen = processPaymentSaga(action);

    gen.next();
    const putEffect = gen.throw(new Error('Network timeout')).value;
    expect(putEffect).toEqual(put(processPaymentFailure('Network timeout')));
    expect(gen.next().done).toBe(true);
  });

  it('should extract message from error response', () => {
    const action = processPayment(mockPaymentPayload);
    const gen = processPaymentSaga(action);

    const error = {
      response: {
        data: {
          message: 'Tarjeta invalida',
        },
      },
    };
    gen.next();
    const putEffect = gen.throw(error).value;
    expect(putEffect).toEqual(put(processPaymentFailure('Tarjeta invalida')));
    expect(gen.next().done).toBe(true);
  });

  it('should use default message when error has no message', () => {
    const action = processPayment(mockPaymentPayload);
    const gen = processPaymentSaga(action);

    gen.next();
    const putEffect = gen.throw({}).value;
    expect(putEffect).toEqual(put(processPaymentFailure('Error al procesar el pago')));
    expect(gen.next().done).toBe(true);
  });
});

describe('watchPayment', () => {
  it('should yield takeLatest for processPayment and pollPaymentStatus', () => {
    const gen = watchPayment();
    expect(gen.next().value.type).toBe('FORK');
    expect(gen.next().value.type).toBe('FORK');
    expect(gen.next().done).toBe(true);
  });
});
