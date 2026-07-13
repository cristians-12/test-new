import AsyncStorage from '@react-native-async-storage/async-storage';
import { addItem, removeItem, updateQuantity, clearCart } from '../../sagas/cart/reducer';
import { cartPersistMiddleware, loadCartFromStorage } from '../cartPersist';

const CART_STORAGE_KEY = '@cart/items';

const mockCartItem = {
  id: '1',
  name: 'Test Product',
  price: 50000,
  quantity: 1,
  image: 'http://example.com/img.jpg',
};

const createMockStore = (cartItems: any[] = []) => ({
  getState: jest.fn(() => ({ cart: { items: cartItems } })),
  dispatch: jest.fn(),
});

const createFakeAction = (type: string) => ({ type });

beforeEach(() => {
  jest.clearAllMocks();
});

describe('cartPersistMiddleware', () => {
  it('should call next(action) and return its result', () => {
    const store = createMockStore();
    const next = jest.fn(() => 'result');
    const action = createFakeAction('some/otherAction');

    const result = cartPersistMiddleware(store as any)(next as any)(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(result).toBe('result');
  });

  it('should NOT persist when action is not a cart action', () => {
    const store = createMockStore([mockCartItem]);
    const next = jest.fn();
    const action = createFakeAction('some/otherAction');

    cartPersistMiddleware(store as any)(next as any)(action);

    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('should persist when addItem is dispatched', () => {
    const store = createMockStore([mockCartItem]);
    const next = jest.fn();
    const action = { type: addItem.type, payload: mockCartItem };

    cartPersistMiddleware(store as any)(next as any)(action);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      CART_STORAGE_KEY,
      JSON.stringify([mockCartItem]),
    );
  });

  it('should persist when removeItem is dispatched', () => {
    const store = createMockStore([]);
    const next = jest.fn();
    const action = { type: removeItem.type, payload: '1' };

    cartPersistMiddleware(store as any)(next as any)(action);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      CART_STORAGE_KEY,
      JSON.stringify([]),
    );
  });

  it('should persist when updateQuantity is dispatched', () => {
    const updatedItem = { ...mockCartItem, quantity: 3 };
    const store = createMockStore([updatedItem]);
    const next = jest.fn();
    const action = { type: updateQuantity.type, payload: { id: '1', quantity: 3 } };

    cartPersistMiddleware(store as any)(next as any)(action);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      CART_STORAGE_KEY,
      JSON.stringify([updatedItem]),
    );
  });

  it('should persist when clearCart is dispatched', () => {
    const store = createMockStore([]);
    const next = jest.fn();
    const action = { type: clearCart.type };

    cartPersistMiddleware(store as any)(next as any)(action);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      CART_STORAGE_KEY,
      JSON.stringify([]),
    );
  });

  it('should handle AsyncStorage.setItem error gracefully', () => {
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Storage full'));
    const store = createMockStore([mockCartItem]);
    const next = jest.fn();
    const action = { type: addItem.type, payload: mockCartItem };

    expect(() => {
      cartPersistMiddleware(store as any)(next as any)(action);
    }).not.toThrow();
  });
});

describe('loadCartFromStorage', () => {
  it('should return parsed items from storage', async () => {
    const items = [mockCartItem];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(items));

    const result = await loadCartFromStorage();

    expect(AsyncStorage.getItem).toHaveBeenCalledWith(CART_STORAGE_KEY);
    expect(result).toEqual(items);
  });

  it('should return empty array when storage is empty', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const result = await loadCartFromStorage();

    expect(result).toEqual([]);
  });

  it('should return empty array on parse error', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('invalid json');

    const result = await loadCartFromStorage();

    expect(result).toEqual([]);
  });

  it('should return empty array when getItem throws', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

    const result = await loadCartFromStorage();

    expect(result).toEqual([]);
  });

  it('should return empty array when storage returns empty string', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('');

    const result = await loadCartFromStorage();

    expect(result).toEqual([]);
  });
});
