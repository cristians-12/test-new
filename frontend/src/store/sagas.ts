import { all, fork } from 'redux-saga/effects';
import { watchCart } from './sagas/cart/saga';
import { watchProducts } from './sagas/products/saga';
import { watchCategories } from './sagas/categories/saga';

export default function* rootSaga() {
  yield all([
    fork(watchCart), 
    fork(watchProducts),
    fork(watchCategories),
  ]);
}
