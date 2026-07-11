import { call, put, takeLatest } from 'redux-saga/effects';
import type { ProductFilters } from '../../../types';
import {
  fetchProducts,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductById,
  fetchProductByIdSuccess,
  fetchProductByIdFailure,
  createProduct,
  createProductSuccess,
  createProductFailure,
  updateProduct,
  updateProductSuccess,
  updateProductFailure,
  deleteProduct,
  deleteProductSuccess,
  deleteProductFailure,
} from './reducer';
import apiClient from '../../../api/api';

function* fetchProductsSaga(
  action: ReturnType<typeof fetchProducts>,
): Generator<any, void, any> {
  try {
    const params: ProductFilters = action.payload || {};
    const response: any = yield call(
      [apiClient, 'get'],
      '/products',
      { params },
    );
    yield put(fetchProductsSuccess(response.data));
  } catch (error: any) {
    yield put(
      fetchProductsFailure(error.message || 'Error al obtener productos'),
    );
  }
}

function* fetchProductByIdSaga(
  action: ReturnType<typeof fetchProductById>,
): Generator<any, void, any> {
  try {
    const response: any = yield call(
      [apiClient, 'get'],
      `/products/${action.payload}`,
    );
    yield put(fetchProductByIdSuccess(response.data));
  } catch (error: any) {
    yield put(
      fetchProductByIdFailure(
        error.message || 'Error al obtener el producto',
      ),
    );
  }
}

function* createProductSaga(
  action: ReturnType<typeof createProduct>,
): Generator<any, void, any> {
  try {
    const response: any = yield call(
      [apiClient, 'post'],
      '/products',
      action.payload,
    );
    yield put(createProductSuccess(response.data));
  } catch (error: any) {
    yield put(
      createProductFailure(error.message || 'Error al crear el producto'),
    );
  }
}

function* updateProductSaga(
  action: ReturnType<typeof updateProduct>,
): Generator<any, void, any> {
  try {
    const { id, data } = action.payload;
    const response: any = yield call(
      [apiClient, 'put'],
      `/products/${id}`,
      data,
    );
    yield put(updateProductSuccess(response.data));
  } catch (error: any) {
    yield put(
      updateProductFailure(error.message || 'Error al actualizar el producto'),
    );
  }
}

function* deleteProductSaga(
  action: ReturnType<typeof deleteProduct>,
): Generator<any, void, any> {
  try {
    yield call([apiClient, 'delete'], `/products/${action.payload}`);
    yield put(deleteProductSuccess(action.payload));
  } catch (error: any) {
    yield put(
      deleteProductFailure(error.message || 'Error al eliminar el producto'),
    );
  }
}

export function* watchProducts() {
  yield takeLatest(fetchProducts.type, fetchProductsSaga);
  yield takeLatest(fetchProductById.type, fetchProductByIdSaga);
  yield takeLatest(createProduct.type, createProductSaga);
  yield takeLatest(updateProduct.type, updateProductSaga);
  yield takeLatest(deleteProduct.type, deleteProductSaga);
}
