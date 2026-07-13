import { call, put } from 'redux-saga/effects';
import type { Category } from '../../../../types';
import {
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  fetchCategoryByIdSuccess,
  fetchCategoryByIdFailure,
  createCategorySuccess,
  createCategoryFailure,
  updateCategorySuccess,
  updateCategoryFailure,
  deleteCategorySuccess,
  deleteCategoryFailure,
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
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
  watchCategories,
  fetchCategoriesSaga,
  fetchCategoryByIdSaga,
  createCategorySaga,
  updateCategorySaga,
  deleteCategorySaga,
} from '../saga';

const mockCategory: Category = {
  id: 1,
  name: 'Electronics',
  slug: 'electronics',
  description: 'Electronic devices',
  created_at: '2025-01-01T00:00:00.000Z',
};

const mockCategory2: Category = {
  id: 2,
  name: 'Clothing',
  slug: 'clothing',
  description: null,
  created_at: '2025-01-02T00:00:00.000Z',
};

describe('Categories Saga', () => {
  describe('fetchCategoriesSaga', () => {
    it('should dispatch fetchCategoriesSuccess on success', () => {
      const gen = fetchCategoriesSaga();

      const callEffect = gen.next().value;
      expect(callEffect).toEqual(call([apiClient, 'get'], '/categories'));

      const putEffect = gen.next({ data: [mockCategory, mockCategory2] }).value;
      expect(putEffect).toEqual(put(fetchCategoriesSuccess([mockCategory, mockCategory2])));
      expect(gen.next().done).toBe(true);
    });

    it('should dispatch fetchCategoriesFailure on error', () => {
      const gen = fetchCategoriesSaga();
      gen.next();
      const putEffect = gen.throw(new Error('Network error')).value;
      expect(putEffect).toEqual(put(fetchCategoriesFailure('Network error')));
      expect(gen.next().done).toBe(true);
    });

    it('should use default message when error has no message', () => {
      const gen = fetchCategoriesSaga();
      gen.next();
      const putEffect = gen.throw({}).value;
      expect(putEffect).toEqual(put(fetchCategoriesFailure('Error al obtener categorías')));
    });
  });

  describe('fetchCategoryByIdSaga', () => {
    it('should dispatch fetchCategoryByIdSuccess on success', () => {
      const action = fetchCategoryById(1);
      const gen = fetchCategoryByIdSaga(action);

      const callEffect = gen.next().value;
      expect(callEffect).toEqual(call([apiClient, 'get'], '/categories/1'));

      const putEffect = gen.next({ data: mockCategory }).value;
      expect(putEffect).toEqual(put(fetchCategoryByIdSuccess(mockCategory)));
      expect(gen.next().done).toBe(true);
    });

    it('should dispatch fetchCategoryByIdFailure on error', () => {
      const action = fetchCategoryById(1);
      const gen = fetchCategoryByIdSaga(action);
      gen.next();
      const putEffect = gen.throw(new Error('Not found')).value;
      expect(putEffect).toEqual(put(fetchCategoryByIdFailure('Not found')));
      expect(gen.next().done).toBe(true);
    });

    it('should use default message when error has no message', () => {
      const action = fetchCategoryById(1);
      const gen = fetchCategoryByIdSaga(action);
      gen.next();
      const putEffect = gen.throw({}).value;
      expect(putEffect).toEqual(
        put(fetchCategoryByIdFailure('Error al obtener la categoría')),
      );
    });
  });

  describe('createCategorySaga', () => {
    it('should dispatch createCategorySuccess on success', () => {
      const action = createCategory({ name: 'New', slug: 'new', description: 'Desc' });
      const gen = createCategorySaga(action);

      const callEffect = gen.next().value;
      expect(callEffect).toEqual(
        call([apiClient, 'post'], '/categories', { name: 'New', slug: 'new', description: 'Desc' }),
      );

      const putEffect = gen.next({ data: mockCategory }).value;
      expect(putEffect).toEqual(put(createCategorySuccess(mockCategory)));
      expect(gen.next().done).toBe(true);
    });

    it('should dispatch createCategoryFailure on error', () => {
      const action = createCategory({ name: 'New', slug: 'new' });
      const gen = createCategorySaga(action);
      gen.next();
      const putEffect = gen.throw(new Error('Create failed')).value;
      expect(putEffect).toEqual(put(createCategoryFailure('Create failed')));
      expect(gen.next().done).toBe(true);
    });

    it('should use default message when error has no message', () => {
      const action = createCategory({ name: 'New', slug: 'new' });
      const gen = createCategorySaga(action);
      gen.next();
      const putEffect = gen.throw({}).value;
      expect(putEffect).toEqual(
        put(createCategoryFailure('Error al crear la categoría')),
      );
    });
  });

  describe('updateCategorySaga', () => {
    it('should dispatch updateCategorySuccess on success', () => {
      const action = updateCategory({ id: 1, data: { name: 'Updated' } });
      const gen = updateCategorySaga(action);

      const callEffect = gen.next().value;
      expect(callEffect).toEqual(call([apiClient, 'put'], '/categories/1', { name: 'Updated' }));

      const updatedCategory = { ...mockCategory, name: 'Updated' };
      const putEffect = gen.next({ data: updatedCategory }).value;
      expect(putEffect).toEqual(put(updateCategorySuccess(updatedCategory)));
      expect(gen.next().done).toBe(true);
    });

    it('should dispatch updateCategoryFailure on error', () => {
      const action = updateCategory({ id: 1, data: { name: 'Updated' } });
      const gen = updateCategorySaga(action);
      gen.next();
      const putEffect = gen.throw(new Error('Update failed')).value;
      expect(putEffect).toEqual(put(updateCategoryFailure('Update failed')));
      expect(gen.next().done).toBe(true);
    });

    it('should use default message when error has no message', () => {
      const action = updateCategory({ id: 1, data: { name: 'Updated' } });
      const gen = updateCategorySaga(action);
      gen.next();
      const putEffect = gen.throw({}).value;
      expect(putEffect).toEqual(
        put(updateCategoryFailure('Error al actualizar la categoría')),
      );
    });
  });

  describe('deleteCategorySaga', () => {
    it('should dispatch deleteCategorySuccess on success', () => {
      const action = deleteCategory(1);
      const gen = deleteCategorySaga(action);

      const callEffect = gen.next().value;
      expect(callEffect).toEqual(call([apiClient, 'delete'], '/categories/1'));

      const putEffect = gen.next().value;
      expect(putEffect).toEqual(put(deleteCategorySuccess(1)));
      expect(gen.next().done).toBe(true);
    });

    it('should dispatch deleteCategoryFailure on error', () => {
      const action = deleteCategory(1);
      const gen = deleteCategorySaga(action);
      gen.next();
      const putEffect = gen.throw(new Error('Delete failed')).value;
      expect(putEffect).toEqual(put(deleteCategoryFailure('Delete failed')));
      expect(gen.next().done).toBe(true);
    });

    it('should use default message when error has no message', () => {
      const action = deleteCategory(1);
      const gen = deleteCategorySaga(action);
      gen.next();
      const putEffect = gen.throw({}).value;
      expect(putEffect).toEqual(
        put(deleteCategoryFailure('Error al eliminar la categoría')),
      );
    });
  });

  describe('watchCategories', () => {
    it('should yield takeLatest for all 5 action types', () => {
      const gen = watchCategories();

      expect(gen.next().value.type).toBe('FORK');
      expect(gen.next().value.type).toBe('FORK');
      expect(gen.next().value.type).toBe('FORK');
      expect(gen.next().value.type).toBe('FORK');
      expect(gen.next().value.type).toBe('FORK');
      expect(gen.next().done).toBe(true);
    });
  });
});
