import { call, put } from 'redux-saga/effects';
import {
  processPayment,
  processPaymentSuccess,
  processPaymentFailure,
  pollPaymentStatus,
  pollPaymentStatusSuccess,
  fetchPaymentHistory,
  fetchPaymentHistorySuccess,
  fetchPaymentHistoryFailure,
} from '../reducer';
import { processPaymentSaga, pollPaymentStatusSaga, fetchPaymentHistorySaga, watchPayment } from '../saga';

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
  product_quantity: [2],
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

describe('pollPaymentStatusSaga', () => {
  it('should call api GET /payments/:id and dispatch pollPaymentStatusSuccess', () => {
    const action = pollPaymentStatus(1);
    const gen = pollPaymentStatusSaga(action);

    const callEffect = gen.next().value;
    expect(callEffect).toEqual(call([apiClient, 'get'], '/payments/1'));

    const putEffect = gen.next({ data: mockPaymentResponse }).value;
    expect(putEffect).toEqual(put(pollPaymentStatusSuccess(mockPaymentResponse)));

    expect(gen.next().done).toBe(true);
  });

  it('should not dispatch failure on error (silent retry)', () => {
    const action = pollPaymentStatus(1);
    const gen = pollPaymentStatusSaga(action);

    gen.next();
    const result = gen.throw(new Error('Network error'));
    expect(result.value).toBeUndefined();
    expect(gen.next().done).toBe(true);
  });
});

describe('fetchPaymentHistorySaga', () => {
  it('should call api POST /payments/refresh and dispatch fetchPaymentHistorySuccess', () => {
    const gen = fetchPaymentHistorySaga();

    const callEffect = gen.next().value;
    expect(callEffect).toEqual(call([apiClient, 'post'], '/payments/refresh'));

    const payments = [mockPaymentResponse];
    const putEffect = gen.next({ data: payments }).value;
    expect(putEffect).toEqual(put(fetchPaymentHistorySuccess(payments)));

    expect(gen.next().done).toBe(true);
  });

  it('should dispatch fetchPaymentHistoryFailure on error', () => {
    const gen = fetchPaymentHistorySaga();

    gen.next();
    const putEffect = gen.throw(new Error('Server error')).value;
    expect(putEffect).toEqual(put(fetchPaymentHistoryFailure('Server error')));
    expect(gen.next().done).toBe(true);
  });

  it('should extract message from error response', () => {
    const gen = fetchPaymentHistorySaga();

    const error = {
      response: {
        data: {
          message: 'Unauthorized',
        },
      },
    };
    gen.next();
    const putEffect = gen.throw(error).value;
    expect(putEffect).toEqual(put(fetchPaymentHistoryFailure('Unauthorized')));
    expect(gen.next().done).toBe(true);
  });

  it('should use default message when error has no message', () => {
    const gen = fetchPaymentHistorySaga();

    gen.next();
    const putEffect = gen.throw({}).value;
    expect(putEffect).toEqual(put(fetchPaymentHistoryFailure('Error al obtener historial')));
    expect(gen.next().done).toBe(true);
  });
});

describe('watchPayment', () => {
  it('should yield takeLatest for processPayment, pollPaymentStatus and fetchPaymentHistory', () => {
    const gen = watchPayment();
    expect(gen.next().value.type).toBe('FORK');
    expect(gen.next().value.type).toBe('FORK');
    expect(gen.next().value.type).toBe('FORK');
    expect(gen.next().done).toBe(true);
  });
});
