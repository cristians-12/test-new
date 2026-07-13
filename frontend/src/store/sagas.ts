import { all, fork } from 'redux-saga/effects';
import { watchProducts } from './sagas/products/saga';
import { watchCategories } from './sagas/categories/saga';
import { watchPayment } from './sagas/payment/saga';

export default function* rootSaga() {
  yield all([
    fork(watchProducts),
    fork(watchCategories),
    fork(watchPayment),
  ]);
}
