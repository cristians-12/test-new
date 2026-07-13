import { call, put, takeLatest, delay } from 'redux-saga/effects';
import type { AxiosResponse } from 'axios';
import {
  processPayment,
  processPaymentSuccess,
  processPaymentFailure,
  pollPaymentStatus,
  pollPaymentStatusSuccess,
  PaymentResponse,
} from './reducer';
import apiClient from '../../../api/api';

export function* processPaymentSaga(
  action: ReturnType<typeof processPayment>,
): Generator<any, void, any> {
  try {
    console.log('[PaymentSaga] Sending POST /payments with payload:', JSON.stringify(action.payload, null, 2));
    const response: AxiosResponse<PaymentResponse> = yield call(
      [apiClient, 'post'],
      '/payments',
      action.payload,
    );
    console.log('[PaymentSaga] Response:', response.status, JSON.stringify(response.data, null, 2));
    yield put(processPaymentSuccess(response.data));
  } catch (error: any) {
    console.error('[PaymentSaga] Error details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      responseData: error.response?.data,
      requestUrl: error.config?.url,
      requestMethod: error.config?.method,
      requestData: error.config?.data,
    });
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Error al procesar el pago';
    yield put(processPaymentFailure(message));
  }
}

export function* pollPaymentStatusSaga(
  action: ReturnType<typeof pollPaymentStatus>,
): Generator<any, void, any> {
  try {
    const response: AxiosResponse<PaymentResponse> = yield call(
      [apiClient, 'get'],
      `/payments/${action.payload}`,
    );
    console.log('[PaymentSaga] Response:', response.status, JSON.stringify(response.data, null, 2));
    yield put(pollPaymentStatusSuccess(response.data));
  } catch (_error: any) {
    console.warn('[PaymentSaga] Poll failed, will retry:', _error?.message);
  }
}

export function* watchPayment() {
  yield takeLatest(processPayment.type, processPaymentSaga);
  yield takeLatest(pollPaymentStatus.type, pollPaymentStatusSaga);
}
