import { call, put } from 'redux-saga/effects';
import type { Product, PaginatedProductsResponse, ProductMeta } from '../../../../types';
import {
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductByIdSuccess,
  fetchProductByIdFailure,
  createProductSuccess,
  createProductFailure,
  updateProductSuccess,
  updateProductFailure,
  deleteProductSuccess,
  deleteProductFailure,
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../reducer';

jest.mock('../../../../api/api', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

import apiClient from '../../../../api/api';
import {
  watchProducts,
  fetchProductsSaga,
  fetchProductByIdSaga,
  createProductSaga,
  updateProductSaga,
  deleteProductSaga,
} from '../saga';

const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  image_url: 'http://example.com/img.jpg',
  description: 'A test product',
  price: 10000,
  category_id: 1,
  category: { id: 1, name: 'Electronics', slug: 'electronics' },
  stock: 50,
  is_active: true,
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-01T00:00:00.000Z',
};

const mockMeta: ProductMeta = {
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
};

describe('Products Saga', () => {
  describe('fetchProductsSaga', () => {
    it('should dispatch fetchProductsSuccess on success', () => {
      const action = fetchProducts({ category_id: 1 });
      const gen = fetchProductsSaga(action);

      const callEffect = gen.next().value;
      expect(callEffect).toEqual(
        call([apiClient, 'get'], '/products', { params: { category_id: 1 } }),
      );

      const paginatedResponse: PaginatedProductsResponse = {
        data: [mockProduct],
        meta: mockMeta,
      };
      const putEffect = gen.next({ data: paginatedResponse }).value;
      expect(putEffect).toEqual(put(fetchProductsSuccess(paginatedResponse)));
      expect(gen.next().done).toBe(true);
    });

    it('should dispatch fetchProductsFailure on error', () => {
      const action = fetchProducts();
      const gen = fetchProductsSaga(action);
      gen.next();
      const putEffect = gen.throw(new Error('Network error')).value;
      expect(putEffect).toEqual(put(fetchProductsFailure('Network error')));
      expect(gen.next().done).toBe(true);
    });

    it('should use default message on error without message', () => {
      const action = fetchProducts();
      const gen = fetchProductsSaga(action);
      gen.next();
      const putEffect = gen.throw({}).value;
      expect(putEffect).toEqual(put(fetchProductsFailure('Error al obtener productos')));
    });
  });

  describe('fetchProductByIdSaga', () => {
    it('should dispatch fetchProductByIdSuccess on success', () => {
      const action = fetchProductById(1);
      const gen = fetchProductByIdSaga(action);

      const callEffect = gen.next().value;
      expect(callEffect).toEqual(call([apiClient, 'get'], '/products/1'));

      const putEffect = gen.next({ data: mockProduct }).value;
      expect(putEffect).toEqual(put(fetchProductByIdSuccess(mockProduct)));
      expect(gen.next().done).toBe(true);
    });

    it('should dispatch fetchProductByIdFailure on error', () => {
      const action = fetchProductById(1);
      const gen = fetchProductByIdSaga(action);
      gen.next();
      const putEffect = gen.throw(new Error('Not found')).value;
      expect(putEffect).toEqual(put(fetchProductByIdFailure('Not found')));
      expect(gen.next().done).toBe(true);
    });

    it('should use default message when error has no message', () => {
      const action = fetchProductById(1);
      const gen = fetchProductByIdSaga(action);
      gen.next();
      const putEffect = gen.throw({}).value;
      expect(putEffect).toEqual(put(fetchProductByIdFailure('Error al obtener el producto')));
    });
  });

  describe('createProductSaga', () => {
    it('should dispatch createProductSuccess on success', () => {
      const { id, created_at, updated_at, ...rest } = mockProduct;
      const action = createProduct(rest as any);
      const gen = createProductSaga(action);

      const callEffect = gen.next().value;
      expect(callEffect).toEqual(call([apiClient, 'post'], '/products', rest));

      const putEffect = gen.next({ data: mockProduct }).value;
      expect(putEffect).toEqual(put(createProductSuccess(mockProduct)));
      expect(gen.next().done).toBe(true);
    });

    it('should dispatch createProductFailure on error', () => {
      const { id, created_at, updated_at, ...rest } = mockProduct;
      const action = createProduct(rest as any);
      const gen = createProductSaga(action);
      gen.next();
      const putEffect = gen.throw(new Error('Create failed')).value;
      expect(putEffect).toEqual(put(createProductFailure('Create failed')));
      expect(gen.next().done).toBe(true);
    });

    it('should use default message when error has no message', () => {
      const { id, created_at, updated_at, ...rest } = mockProduct;
      const action = createProduct(rest as any);
      const gen = createProductSaga(action);
      gen.next();
      const putEffect = gen.throw({}).value;
      expect(putEffect).toEqual(put(createProductFailure('Error al crear el producto')));
    });
  });

  describe('updateProductSaga', () => {
    it('should dispatch updateProductSuccess on success', () => {
      const action = updateProduct({ id: 1, data: { name: 'Updated' } });
      const gen = updateProductSaga(action);

      const callEffect = gen.next().value;
      expect(callEffect).toEqual(call([apiClient, 'put'], '/products/1', { name: 'Updated' }));

      const updatedProduct = { ...mockProduct, name: 'Updated' };
      const putEffect = gen.next({ data: updatedProduct }).value;
      expect(putEffect).toEqual(put(updateProductSuccess(updatedProduct)));
      expect(gen.next().done).toBe(true);
    });

    it('should dispatch updateProductFailure on error', () => {
      const action = updateProduct({ id: 1, data: { name: 'Updated' } });
      const gen = updateProductSaga(action);
      gen.next();
      const putEffect = gen.throw(new Error('Update failed')).value;
      expect(putEffect).toEqual(put(updateProductFailure('Update failed')));
      expect(gen.next().done).toBe(true);
    });

    it('should use default message when error has no message', () => {
      const action = updateProduct({ id: 1, data: { name: 'Updated' } });
      const gen = updateProductSaga(action);
      gen.next();
      const putEffect = gen.throw({}).value;
      expect(putEffect).toEqual(put(updateProductFailure('Error al actualizar el producto')));
    });
  });

  describe('deleteProductSaga', () => {
    it('should dispatch deleteProductSuccess on success', () => {
      const action = deleteProduct(1);
      const gen = deleteProductSaga(action);

      const callEffect = gen.next().value;
      expect(callEffect).toEqual(call([apiClient, 'delete'], '/products/1'));

      const putEffect = gen.next().value;
      expect(putEffect).toEqual(put(deleteProductSuccess(1)));
      expect(gen.next().done).toBe(true);
    });

    it('should dispatch deleteProductFailure on error', () => {
      const action = deleteProduct(1);
      const gen = deleteProductSaga(action);
      gen.next();
      const putEffect = gen.throw(new Error('Delete failed')).value;
      expect(putEffect).toEqual(put(deleteProductFailure('Delete failed')));
      expect(gen.next().done).toBe(true);
    });

    it('should use default message when error has no message', () => {
      const action = deleteProduct(1);
      const gen = deleteProductSaga(action);
      gen.next();
      const putEffect = gen.throw({}).value;
      expect(putEffect).toEqual(put(deleteProductFailure('Error al eliminar el producto')));
    });
  });

  describe('watchProducts', () => {
    it('should yield takeLatest for all 5 action types', () => {
      const gen = watchProducts();

      expect(gen.next().value.type).toBe('FORK');
      expect(gen.next().value.type).toBe('FORK');
      expect(gen.next().value.type).toBe('FORK');
      expect(gen.next().value.type).toBe('FORK');
      expect(gen.next().value.type).toBe('FORK');
      expect(gen.next().done).toBe(true);
    });
  });
});
