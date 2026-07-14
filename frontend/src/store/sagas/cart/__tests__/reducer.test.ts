import cartReducer, {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  syncCartRequest,
  syncCartSuccess,
  syncCartFailure,
} from '../reducer';
import type { CartItem } from '../reducer';

const mockCartItem: CartItem = {
  id: '1',
  name: 'Test Item',
  price: 10000,
  quantity: 1,
  stock: 5,
  image: 'http://example.com/img.jpg',
};

const mockCartItem2: CartItem = {
  id: '2',
  name: 'Test Item 2',
  price: 20000,
  quantity: 2,
  stock: 3,
};

const initialState = {
  items: [] as CartItem[],
  loading: false,
  error: null as string | null,
};

describe('Cart Reducer', () => {
  it('should return the initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addItem - new item', () => {
    const state = cartReducer(initialState, addItem(mockCartItem));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual({ ...mockCartItem, quantity: 1 });
  });

  it('should handle addItem - existing item increments quantity', () => {
    const stateWithItem = { ...initialState, items: [{ ...mockCartItem, quantity: 1 }] };
    const state = cartReducer(stateWithItem, addItem(mockCartItem));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it('should handle addItem - existing item increments again', () => {
    const stateWithItem = { ...initialState, items: [{ ...mockCartItem, quantity: 3 }] };
    const state = cartReducer(stateWithItem, addItem(mockCartItem));
    expect(state.items[0].quantity).toBe(4);
  });

  it('should handle addItem - multiple different items', () => {
    let state = cartReducer(initialState, addItem(mockCartItem));
    state = cartReducer(state, addItem(mockCartItem2));
    expect(state.items).toHaveLength(2);
    expect(state.items[0].id).toBe('1');
    expect(state.items[1].id).toBe('2');
  });

  it('should handle addItem - without image', () => {
    const itemWithoutImage = { id: '3', name: 'No Image', price: 5000, stock: 10 };
    const state = cartReducer(initialState, addItem(itemWithoutImage));
    expect(state.items[0]).toEqual({ id: '3', name: 'No Image', price: 5000, stock: 10, quantity: 1 });
  });

  it('should not increment quantity beyond stock', () => {
    const stateWithItem = { ...initialState, items: [{ ...mockCartItem, quantity: 5, stock: 5 }] };
    const state = cartReducer(stateWithItem, addItem(mockCartItem));
    expect(state.items[0].quantity).toBe(5);
  });

  it('should add new item even when stock is 1', () => {
    const state = cartReducer(initialState, addItem({ ...mockCartItem, stock: 1 }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(1);
  });

  it('should handle removeItem', () => {
    const stateWithItems = {
      ...initialState,
      items: [mockCartItem, mockCartItem2],
    };
    const state = cartReducer(stateWithItems, removeItem('1'));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(mockCartItem2);
  });

  it('should handle removeItem - item not found', () => {
    const stateWithItems = { ...initialState, items: [mockCartItem] };
    const state = cartReducer(stateWithItems, removeItem('999'));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(mockCartItem);
  });

  it('should handle removeItem - last item', () => {
    const stateWithItems = { ...initialState, items: [mockCartItem] };
    const state = cartReducer(stateWithItems, removeItem('1'));
    expect(state.items).toHaveLength(0);
  });

  it('should handle updateQuantity', () => {
    const stateWithItems = { ...initialState, items: [{ ...mockCartItem, quantity: 1 }] };
    const state = cartReducer(stateWithItems, updateQuantity({ id: '1', quantity: 5 }));
    expect(state.items[0].quantity).toBe(5);
  });

  it('should handle updateQuantity - item not found', () => {
    const stateWithItems = { ...initialState, items: [{ ...mockCartItem, quantity: 1 }] };
    const state = cartReducer(stateWithItems, updateQuantity({ id: '999', quantity: 5 }));
    expect(state.items[0].quantity).toBe(1);
  });

  it('should handle updateQuantity - set to zero', () => {
    const stateWithItems = { ...initialState, items: [{ ...mockCartItem, quantity: 3 }] };
    const state = cartReducer(stateWithItems, updateQuantity({ id: '1', quantity: 0 }));
    expect(state.items[0].quantity).toBe(0);
  });

  it('should cap updateQuantity at stock limit', () => {
    const stateWithItems = { ...initialState, items: [{ ...mockCartItem, quantity: 2, stock: 5 }] };
    const state = cartReducer(stateWithItems, updateQuantity({ id: '1', quantity: 10 }));
    expect(state.items[0].quantity).toBe(5);
  });

  it('should handle clearCart', () => {
    const stateWithItems = {
      ...initialState,
      items: [mockCartItem, mockCartItem2],
    };
    const state = cartReducer(stateWithItems, clearCart());
    expect(state.items).toEqual([]);
  });

  it('should handle clearCart on empty cart', () => {
    const state = cartReducer(initialState, clearCart());
    expect(state.items).toEqual([]);
  });

  it('should handle syncCartRequest', () => {
    const state = cartReducer(initialState, syncCartRequest());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle syncCartRequest - clears existing error', () => {
    const stateWithError = { ...initialState, error: 'Previous error' };
    const state = cartReducer(stateWithError, syncCartRequest());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle syncCartSuccess', () => {
    const syncedItems: CartItem[] = [mockCartItem, mockCartItem2];
    const stateWithLoading = { ...initialState, loading: true };
    const state = cartReducer(stateWithLoading, syncCartSuccess(syncedItems));
    expect(state.items).toEqual(syncedItems);
    expect(state.loading).toBe(false);
  });

  it('should handle syncCartSuccess - empty list', () => {
    const stateWithLoading = { ...initialState, loading: true };
    const state = cartReducer(stateWithLoading, syncCartSuccess([]));
    expect(state.items).toEqual([]);
    expect(state.loading).toBe(false);
  });

  it('should handle syncCartFailure', () => {
    const state = cartReducer(
      { ...initialState, loading: true },
      syncCartFailure('Sync failed'),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Sync failed');
  });
});
