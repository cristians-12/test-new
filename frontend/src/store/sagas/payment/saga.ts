import { call, put, takeLatest } from 'redux-saga/effects';
import type { AxiosResponse } from 'axios';
import {
  processPayment,
  processPaymentSuccess,
  processPaymentFailure,
  PaymentResponse,
} from './reducer';
import apiClient from '../../../api/api';

export function* processPaymentSaga(
  action: ReturnType<typeof processPayment>,
): Generator<any, void, any> {
  try {
    const response: AxiosResponse<PaymentResponse> = yield call(
      [apiClient, 'post'],
      '/payments',
      action.payload,
    );
    yield put(processPaymentSuccess(response.data));
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Error al procesar el pago';
    yield put(processPaymentFailure(message));
  }
}

export function* watchPayment() {
  yield takeLatest(processPayment.type, processPaymentSaga);
}
