import productsReducer, {
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
} from '../reducer';
import type { Product, ProductMeta } from '../../../../types';

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

const mockProduct2: Product = {
  ...mockProduct,
  id: 2,
  name: 'Test Product 2',
};

const mockMeta: ProductMeta = {
  total: 2,
  page: 1,
  limit: 10,
  totalPages: 1,
};

const initialState = {
  items: [],
  selected: null,
  meta: null,
  filters: {},
  loading: false,
  error: null,
};

describe('Products Reducer', () => {
  it('should return the initial state', () => {
    expect(productsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchProducts without payload', () => {
    const state = productsReducer(initialState, fetchProducts());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.filters).toEqual({});
  });

  it('should handle fetchProducts with filters', () => {
    const filters = { category_id: 1, search: 'test' };
    const state = productsReducer(initialState, fetchProducts(filters));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.filters).toEqual(filters);
  });

  it('should handle fetchProductsSuccess', () => {
    const state = productsReducer(
      { ...initialState, loading: true },
      fetchProductsSuccess({ data: [mockProduct], meta: mockMeta }),
    );
    expect(state.items).toEqual([mockProduct]);
    expect(state.meta).toEqual(mockMeta);
    expect(state.loading).toBe(false);
  });

  it('should handle fetchProductsFailure', () => {
    const state = productsReducer(
      { ...initialState, loading: true },
      fetchProductsFailure('Error loading products'),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error loading products');
  });

  it('should handle fetchProductById', () => {
    const state = productsReducer(initialState, fetchProductById(1));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.selected).toBeNull();
  });

  it('should handle fetchProductByIdSuccess', () => {
    const state = productsReducer(
      { ...initialState, loading: true },
      fetchProductByIdSuccess(mockProduct),
    );
    expect(state.selected).toEqual(mockProduct);
    expect(state.loading).toBe(false);
  });

  it('should handle fetchProductByIdFailure', () => {
    const state = productsReducer(
      { ...initialState, loading: true },
      fetchProductByIdFailure('Not found'),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Not found');
  });

  it('should handle createProduct', () => {
    const { id, created_at, updated_at, ...rest } = mockProduct;
    const state = productsReducer(initialState, createProduct(rest as any));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle createProductSuccess (unshift to front)', () => {
    const stateWithItems = { ...initialState, items: [mockProduct2] };
    const state = productsReducer(stateWithItems, createProductSuccess(mockProduct));
    expect(state.items).toHaveLength(2);
    expect(state.items[0]).toEqual(mockProduct);
    expect(state.items[1]).toEqual(mockProduct2);
    expect(state.loading).toBe(false);
  });

  it('should handle createProductFailure', () => {
    const state = productsReducer(
      { ...initialState, loading: true },
      createProductFailure('Create failed'),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Create failed');
  });

  it('should handle updateProduct', () => {
    const state = productsReducer(initialState, updateProduct({ id: 1, data: { name: 'Updated' } }));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle updateProductSuccess - updates item in list', () => {
    const updatedProduct = { ...mockProduct, name: 'Updated Product' };
    const stateWithItems = { ...initialState, items: [mockProduct, mockProduct2] };
    const state = productsReducer(stateWithItems, updateProductSuccess(updatedProduct));
    expect(state.items[0].name).toBe('Updated Product');
    expect(state.items[1]).toEqual(mockProduct2);
    expect(state.loading).toBe(false);
  });

  it('should handle updateProductSuccess - updates selected if matching id', () => {
    const updatedProduct = { ...mockProduct, name: 'Updated Product' };
    const stateWithSelected = {
      ...initialState,
      items: [mockProduct],
      selected: mockProduct,
    };
    const state = productsReducer(stateWithSelected, updateProductSuccess(updatedProduct));
    expect(state.selected?.name).toBe('Updated Product');
  });

  it('should handle updateProductSuccess - item not found in list', () => {
    const unknownProduct: Product = { ...mockProduct, id: 999, name: 'Unknown' };
    const stateWithItems = { ...initialState, items: [mockProduct] };
    const state = productsReducer(stateWithItems, updateProductSuccess(unknownProduct));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(mockProduct);
    expect(state.loading).toBe(false);
  });

  it('should handle updateProductSuccess - selected does not change if id differs', () => {
    const updatedProduct = { ...mockProduct2, name: 'Updated 2' };
    const stateWithSelected = {
      ...initialState,
      items: [mockProduct, mockProduct2],
      selected: mockProduct,
    };
    const state = productsReducer(stateWithSelected, updateProductSuccess(updatedProduct));
    expect(state.selected?.id).toBe(mockProduct.id);
  });

  it('should handle updateProductFailure', () => {
    const state = productsReducer(
      { ...initialState, loading: true },
      updateProductFailure('Update failed'),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Update failed');
  });

  it('should handle deleteProduct', () => {
    const state = productsReducer(initialState, deleteProduct(1));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle deleteProductSuccess - removes from list', () => {
    const stateWithItems = { ...initialState, items: [mockProduct, mockProduct2] };
    const state = productsReducer(stateWithItems, deleteProductSuccess(1));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(mockProduct2);
    expect(state.loading).toBe(false);
  });

  it('should handle deleteProductFailure', () => {
    const state = productsReducer(
      { ...initialState, loading: true },
      deleteProductFailure('Delete failed'),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Delete failed');
  });

  it('should handle clearSelected', () => {
    const stateWithSelected = { ...initialState, selected: mockProduct };
    const state = productsReducer(stateWithSelected, clearSelected());
    expect(state.selected).toBeNull();
  });

  it('should handle clearFilters', () => {
    const stateWithFilters = { ...initialState, filters: { category_id: 1, search: 'test' } };
    const state = productsReducer(stateWithFilters, clearFilters());
    expect(state.filters).toEqual({});
  });
});
