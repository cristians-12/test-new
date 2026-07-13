import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import cartReducer from './sagas/cart/reducer';
import productsReducer from './sagas/products/reducer';
import categoriesReducer from './sagas/categories/reducer';
import { cartPersistMiddleware } from './middleware/cartPersist';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    categories: categoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false })
      .prepend(sagaMiddleware)
      .prepend(cartPersistMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
