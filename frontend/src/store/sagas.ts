import { all, fork } from 'redux-saga/effects';
import { watchCart } from './sagas/cart/saga';

export default function* rootSaga() {
  yield all([fork(watchCart)]);
}
