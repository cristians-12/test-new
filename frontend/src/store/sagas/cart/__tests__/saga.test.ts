import { call, put } from 'redux-saga/effects';
import { syncCartFailure, syncCartSuccess } from '../reducer';
import type { CartItem } from '../reducer';

jest.mock('../../../../api/api', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

import apiClient from '../../../../api/api';
import { watchCart, syncCartSaga } from '../saga';

const mockCartItems: CartItem[] = [
  { id: '1', name: 'Product 1', price: 10000, quantity: 2, image: 'http://example.com/img.jpg' },
  { id: '2', name: 'Product 2', price: 20000, quantity: 1 },
];

describe('Cart Saga', () => {
  describe('syncCartSaga', () => {
    it('should dispatch syncCartSuccess on success', () => {
      const gen = syncCartSaga();

      const callEffect = gen.next().value;
      expect(callEffect).toEqual(call([apiClient, 'get'], '/cart'));

      const putEffect = gen.next({ data: mockCartItems }).value;
      expect(putEffect).toEqual(put(syncCartSuccess(mockCartItems)));
      expect(gen.next().done).toBe(true);
    });

    it('should dispatch syncCartSuccess with empty array', () => {
      const gen = syncCartSaga();
      gen.next();
      const putEffect = gen.next({ data: [] }).value;
      expect(putEffect).toEqual(put(syncCartSuccess([])));
      expect(gen.next().done).toBe(true);
    });

    it('should dispatch syncCartFailure on error', () => {
      const gen = syncCartSaga();
      gen.next();
      const putEffect = gen.throw(new Error('Network error')).value;
      expect(putEffect).toEqual(put(syncCartFailure('Network error')));
      expect(gen.next().done).toBe(true);
    });

    it('should use default message when error has no message', () => {
      const gen = syncCartSaga();
      gen.next();
      const putEffect = gen.throw({}).value;
      expect(putEffect).toEqual(
        put(syncCartFailure('Error al sincronizar el carrito')),
      );
    });
  });

  describe('watchCart', () => {
    it('should yield takeLatest for syncCartRequest', () => {
      const gen = watchCart();
      const t1 = gen.next().value;
      expect(t1.type).toBe('FORK');
      expect(gen.next().done).toBe(true);
    });
  });
});
