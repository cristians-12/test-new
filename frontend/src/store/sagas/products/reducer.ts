import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product, ProductFilters, ProductMeta } from '../../../types';

interface ProductsState {
  items: Product[];
  selected: Product | null;
  meta: ProductMeta | null;
  filters: ProductFilters;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  selected: null,
  meta: null,
  filters: {},
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProducts(state, action: PayloadAction<ProductFilters | undefined>) {
      state.loading = true;
      state.error = null;
      if (action.payload) {
        state.filters = action.payload;
      }
    },
    fetchProductsSuccess(
      state,
      action: PayloadAction<{ data: Product[]; meta: ProductMeta }>,
    ) {
      state.items = action.payload.data;
      state.meta = action.payload.meta;
      state.loading = false;
    },
    fetchProductsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchProductById(state, _action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
      state.selected = null;
    },
    fetchProductByIdSuccess(state, action: PayloadAction<Product>) {
      state.selected = action.payload;
      state.loading = false;
    },
    fetchProductByIdFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createProduct(
      state,
      _action: PayloadAction<Omit<Product, 'id' | 'created_at' | 'updated_at'>>,
    ) {
      state.loading = true;
      state.error = null;
    },
    createProductSuccess(state, action: PayloadAction<Product>) {
      state.items.unshift(action.payload);
      state.loading = false;
    },
    createProductFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateProduct(
      state,
      _action: PayloadAction<{ id: number; data: Partial<Product> }>,
    ) {
      state.loading = true;
      state.error = null;
    },
    updateProductSuccess(state, action: PayloadAction<Product>) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.selected?.id === action.payload.id) {
        state.selected = action.payload;
      }
      state.loading = false;
    },
    updateProductFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteProduct(state, _action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
    },
    deleteProductSuccess(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.loading = false;
    },
    deleteProductFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearSelected(state) {
      state.selected = null;
    },
    clearFilters(state) {
      state.filters = {};
    },
  },
});

export const {
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
  clearSelected,
  clearFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
