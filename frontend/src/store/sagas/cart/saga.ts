import { call, put, takeLatest } from 'redux-saga/effects';
import { syncCartFailure, syncCartRequest, syncCartSuccess } from './reducer';
import apiClient from '../../../api/api';

function* syncCartSaga(): Generator<any, void, any> {
  try {
    const response: any = yield call([apiClient, 'get'], '/cart');
    yield put(syncCartSuccess(response.data));
  } catch (error: any) {
    yield put(syncCartFailure(error.message || 'Error al sincronizar el carrito'));
  }
}

export function* watchCart() {
  yield takeLatest(syncCartRequest.type, syncCartSaga);
}
