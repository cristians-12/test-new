import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { pollPaymentStatus, clearPayment } from '../store/sagas/payment/reducer';
import { clearCart } from '../store/sagas/cart/reducer';

interface UsePaymentOptions {
  pollInterval?: number;
  onApproved?: () => void;
  onDeclined?: () => void;
}

export function usePayment(options: UsePaymentOptions = {}) {
  const { pollInterval = 5000, onApproved, onDeclined } = options;
  const dispatch = useAppDispatch();
  const { currentPayment, loading, error } = useAppSelector(
    (state) => state.payment,
  );

  const pollRef = useRef<ReturnType<typeof setInterval>>();
  const prevStatusRef = useRef<string | undefined>();
  const paymentIdRef = useRef<number | undefined>();

  useEffect(() => {
    paymentIdRef.current = currentPayment?.id;
  }, [currentPayment?.id]);

  useEffect(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = undefined;
    }

    if (currentPayment?.status === 'PENDING' && currentPayment.id) {
      pollRef.current = setInterval(() => {
        if (paymentIdRef.current) {
          dispatch(pollPaymentStatus(paymentIdRef.current));
        }
      }, pollInterval);
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = undefined;
      }
    };
  }, [currentPayment?.id, currentPayment?.status, pollInterval, dispatch]);

  useEffect(() => {
    if (!currentPayment?.status || currentPayment.status === prevStatusRef.current) return;

    prevStatusRef.current = currentPayment.status;

    if (currentPayment.status === 'APPROVED') {
      if (pollRef.current) clearInterval(pollRef.current);
      globalThis.toastRef?.show('Pago confirmado', { type: 'success' });
      dispatch(clearPayment());
      dispatch(clearCart());
      onApproved?.();
    } else if (
      currentPayment.status === 'DECLINED' ||
      currentPayment.status === 'ERROR'
    ) {
      if (pollRef.current) clearInterval(pollRef.current);
      globalThis.toastRef?.show('Pago rechazado', { type: 'danger' });
      onDeclined?.();
    }
  }, [currentPayment?.status, onApproved, onDeclined, dispatch]);

  useEffect(() => {
    if (!currentPayment) {
      prevStatusRef.current = undefined;
      paymentIdRef.current = undefined;
    }
  }, [currentPayment]);

  const resetPayment = useCallback(() => {
    dispatch(clearPayment());
    dispatch(clearCart());
  }, [dispatch]);

  return {
    currentPayment,
    loading,
    error,
    resetPayment,
  };
}
