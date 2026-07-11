import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Category, CreateCategory, UpdateCategory } from '../../../types';

interface CategoriesState {
  items: Category[];
  selected: Category | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    fetchCategories(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess(state, action: PayloadAction<Category[]>) {
      state.items = action.payload;
      state.loading = false;
    },
    fetchCategoriesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchCategoryById(state, _action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
      state.selected = null;
    },
    fetchCategoryByIdSuccess(state, action: PayloadAction<Category>) {
      state.selected = action.payload;
      state.loading = false;
    },
    fetchCategoryByIdFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createCategory(state, _action: PayloadAction<CreateCategory>) {
      state.loading = true;
      state.error = null;
    },
    createCategorySuccess(state, action: PayloadAction<Category>) {
      state.items.push(action.payload);
      state.loading = false;
    },
    createCategoryFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateCategory(state, _action: PayloadAction<{ id: number; data: UpdateCategory }>) {
      state.loading = true;
      state.error = null;
    },
    updateCategorySuccess(state, action: PayloadAction<Category>) {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.selected?.id === action.payload.id) {
        state.selected = action.payload;
      }
      state.loading = false;
    },
    updateCategoryFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteCategory(state, _action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
    },
    deleteCategorySuccess(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.loading = false;
    },
    deleteCategoryFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearSelected(state) {
      state.selected = null;
    },
  },
});

export const {
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
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
