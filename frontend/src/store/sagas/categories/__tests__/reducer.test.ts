import categoriesReducer, {
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
  clearSelected,
} from '../reducer';
import type { Category } from '../../../../types';

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

const initialState = {
  items: [] as Category[],
  selected: null as Category | null,
  loading: false,
  error: null as string | null,
};

describe('Categories Reducer', () => {
  it('should return the initial state', () => {
    expect(categoriesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchCategories', () => {
    const state = categoriesReducer(initialState, fetchCategories());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchCategoriesSuccess', () => {
    const state = categoriesReducer(
      { ...initialState, loading: true },
      fetchCategoriesSuccess([mockCategory, mockCategory2]),
    );
    expect(state.items).toEqual([mockCategory, mockCategory2]);
    expect(state.loading).toBe(false);
  });

  it('should handle fetchCategoriesFailure', () => {
    const state = categoriesReducer(
      { ...initialState, loading: true },
      fetchCategoriesFailure('Error loading categories'),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error loading categories');
  });

  it('should handle fetchCategoryById', () => {
    const state = categoriesReducer(initialState, fetchCategoryById(1));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.selected).toBeNull();
  });

  it('should handle fetchCategoryByIdSuccess', () => {
    const state = categoriesReducer(
      { ...initialState, loading: true },
      fetchCategoryByIdSuccess(mockCategory),
    );
    expect(state.selected).toEqual(mockCategory);
    expect(state.loading).toBe(false);
  });

  it('should handle fetchCategoryByIdFailure', () => {
    const state = categoriesReducer(
      { ...initialState, loading: true },
      fetchCategoryByIdFailure('Not found'),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Not found');
  });

  it('should handle createCategory', () => {
    const state = categoriesReducer(
      initialState,
      createCategory({ name: 'New', slug: 'new', description: 'Desc' }),
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle createCategorySuccess (push to end)', () => {
    const stateWithItems = { ...initialState, items: [mockCategory] };
    const state = categoriesReducer(stateWithItems, createCategorySuccess(mockCategory2));
    expect(state.items).toHaveLength(2);
    expect(state.items[0]).toEqual(mockCategory);
    expect(state.items[1]).toEqual(mockCategory2);
    expect(state.loading).toBe(false);
  });

  it('should handle createCategorySuccess on empty list', () => {
    const state = categoriesReducer(initialState, createCategorySuccess(mockCategory));
    expect(state.items).toEqual([mockCategory]);
    expect(state.loading).toBe(false);
  });

  it('should handle createCategoryFailure', () => {
    const state = categoriesReducer(
      { ...initialState, loading: true },
      createCategoryFailure('Create failed'),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Create failed');
  });

  it('should handle updateCategory', () => {
    const state = categoriesReducer(
      initialState,
      updateCategory({ id: 1, data: { name: 'Updated' } }),
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle updateCategorySuccess - updates item in list', () => {
    const updatedCategory = { ...mockCategory, name: 'Updated Electronics' };
    const stateWithItems = { ...initialState, items: [mockCategory, mockCategory2] };
    const state = categoriesReducer(stateWithItems, updateCategorySuccess(updatedCategory));
    expect(state.items[0].name).toBe('Updated Electronics');
    expect(state.items[1]).toEqual(mockCategory2);
    expect(state.loading).toBe(false);
  });

  it('should handle updateCategorySuccess - updates selected if matching id', () => {
    const updatedCategory = { ...mockCategory, name: 'Updated Electronics' };
    const stateWithSelected = {
      ...initialState,
      items: [mockCategory],
      selected: mockCategory,
    };
    const state = categoriesReducer(stateWithSelected, updateCategorySuccess(updatedCategory));
    expect(state.selected?.name).toBe('Updated Electronics');
  });

  it('should handle updateCategorySuccess - item not found in list', () => {
    const unknownCategory: Category = { ...mockCategory, id: 999, name: 'Unknown' };
    const stateWithItems = { ...initialState, items: [mockCategory] };
    const state = categoriesReducer(stateWithItems, updateCategorySuccess(unknownCategory));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(mockCategory);
    expect(state.loading).toBe(false);
  });

  it('should handle updateCategorySuccess - selected does not change if id differs', () => {
    const updatedCategory = { ...mockCategory2, name: 'Updated 2' };
    const stateWithSelected = {
      ...initialState,
      items: [mockCategory, mockCategory2],
      selected: mockCategory,
    };
    const state = categoriesReducer(stateWithSelected, updateCategorySuccess(updatedCategory));
    expect(state.selected?.id).toBe(mockCategory.id);
  });

  it('should handle updateCategoryFailure', () => {
    const state = categoriesReducer(
      { ...initialState, loading: true },
      updateCategoryFailure('Update failed'),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Update failed');
  });

  it('should handle deleteCategory', () => {
    const state = categoriesReducer(initialState, deleteCategory(1));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle deleteCategorySuccess - removes from list', () => {
    const stateWithItems = { ...initialState, items: [mockCategory, mockCategory2] };
    const state = categoriesReducer(stateWithItems, deleteCategorySuccess(1));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(mockCategory2);
    expect(state.loading).toBe(false);
  });

  it('should handle deleteCategoryFailure', () => {
    const state = categoriesReducer(
      { ...initialState, loading: true },
      deleteCategoryFailure('Delete failed'),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Delete failed');
  });

  it('should handle clearSelected', () => {
    const stateWithSelected = { ...initialState, selected: mockCategory };
    const state = categoriesReducer(stateWithSelected, clearSelected());
    expect(state.selected).toBeNull();
  });
});
