import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from '../../../services';
import { syncCartFailure, syncCartRequest, syncCartSuccess } from './reducer';

function* syncCartSaga(): Generator<any, void, any> {
  try {
    const response = yield call([api, 'get'], '/cart');
    yield put(syncCartSuccess(response.data));
  } catch (error: any) {
    yield put(syncCartFailure(error.message || 'Error al sincronizar el carrito'));
  }
}

export function* watchCart() {
  yield takeLatest(syncCartRequest.type, syncCartSaga);
}
