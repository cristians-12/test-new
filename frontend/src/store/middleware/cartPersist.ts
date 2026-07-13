import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Middleware } from '@reduxjs/toolkit';
import { addItem, removeItem, updateQuantity, clearCart } from '../sagas/cart/reducer';
import type { CartItem } from '../sagas/cart/reducer';

const CART_STORAGE_KEY = '@cart/items';

const persistActions = [addItem.type, removeItem.type, updateQuantity.type, clearCart.type];

export const cartPersistMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (persistActions.includes((action as any).type)) {
    const { items } = (store.getState() as any).cart;
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }

  return result;
};

export async function loadCartFromStorage(): Promise<CartItem[]> {
  try {
    const data = await AsyncStorage.getItem(CART_STORAGE_KEY);
    return data ? (JSON.parse(data) as CartItem[]) : [];
  } catch {
    return [];
  }
}
