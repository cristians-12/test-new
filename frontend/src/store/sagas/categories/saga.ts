import { call, put, takeLatest } from 'redux-saga/effects';
import type { AxiosResponse } from 'axios';
import type { Category, CreateCategory, UpdateCategory } from '../../../types';
import {
  fetchCategories,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  fetchCategoryById,
  fetchCategoryByIdSuccess,
  fetchCategoryByIdFailure,
  createCategory,
  createCategorySuccess,
  createCategoryFailure,
  updateCategory,
  updateCategorySuccess,
  updateCategoryFailure,
  deleteCategory,
  deleteCategorySuccess,
  deleteCategoryFailure,
} from './reducer';
import apiClient from '../../../api/api';

function* fetchCategoriesSaga(): Generator<any, void, any> {
  try {
    const response: AxiosResponse<Category[]> = yield call(
      [apiClient, 'get'],
      '/categories',
    );
    yield put(fetchCategoriesSuccess(response.data));
  } catch (error: any) {
    yield put(
      fetchCategoriesFailure(error.message || 'Error al obtener categorías'),
    );
  }
}

function* fetchCategoryByIdSaga(
  action: ReturnType<typeof fetchCategoryById>,
): Generator<any, void, any> {
  try {
    const response: AxiosResponse<Category> = yield call(
      [apiClient, 'get'],
      `/categories/${action.payload}`,
    );
    yield put(fetchCategoryByIdSuccess(response.data));
  } catch (error: any) {
    yield put(
      fetchCategoryByIdFailure(
        error.message || 'Error al obtener la categoría',
      ),
    );
  }
}

function* createCategorySaga(
  action: ReturnType<typeof createCategory>,
): Generator<any, void, any> {
  try {
    const response: AxiosResponse<Category> = yield call(
      [apiClient, 'post'],
      '/categories',
      action.payload,
    );
    yield put(createCategorySuccess(response.data));
  } catch (error: any) {
    yield put(
      createCategoryFailure(error.message || 'Error al crear la categoría'),
    );
  }
}

function* updateCategorySaga(
  action: ReturnType<typeof updateCategory>,
): Generator<any, void, any> {
  try {
    const { id, data } = action.payload;
    const response: AxiosResponse<Category> = yield call(
      [apiClient, 'put'],
      `/categories/${id}`,
      data,
    );
    yield put(updateCategorySuccess(response.data));
  } catch (error: any) {
    yield put(
      updateCategoryFailure(error.message || 'Error al actualizar la categoría'),
    );
  }
}

function* deleteCategorySaga(
  action: ReturnType<typeof deleteCategory>,
): Generator<any, void, any> {
  try {
    yield call([apiClient, 'delete'], `/categories/${action.payload}`);
    yield put(deleteCategorySuccess(action.payload));
  } catch (error: any) {
    yield put(
      deleteCategoryFailure(error.message || 'Error al eliminar la categoría'),
    );
  }
}

export function* watchCategories() {
  yield takeLatest(fetchCategories.type, fetchCategoriesSaga);
  yield takeLatest(fetchCategoryById.type, fetchCategoryByIdSaga);
  yield takeLatest(createCategory.type, createCategorySaga);
  yield takeLatest(updateCategory.type, updateCategorySaga);
  yield takeLatest(deleteCategory.type, deleteCategorySaga);
}
