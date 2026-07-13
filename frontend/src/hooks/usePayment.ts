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

  const { pollInterval = 10000, onApproved, onDeclined } = options;

  const dispatch = useAppDispatch();

  const { currentPayment, loading, error } = useAppSelector(
    (state) => state.payment,
  );

  const pollRef = useRef<ReturnType<typeof setInterval>>();
  const prevStatusRef = useRef(currentPayment?.status);

  useEffect(() => {
    if (currentPayment?.status === 'PENDING' && currentPayment.id) {
      pollRef.current = setInterval(() => {
        dispatch(pollPaymentStatus(currentPayment.id));
      }, pollInterval);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [currentPayment?.status, currentPayment?.id, pollInterval, dispatch]);

  useEffect(() => {
    if (currentPayment?.status && currentPayment.status !== prevStatusRef.current) {
      prevStatusRef.current = currentPayment.status;
      if (pollRef.current) clearInterval(pollRef.current);

      if (currentPayment.status === 'APPROVED') {
        globalThis.toastRef?.show('Pago confirmado', { type: 'success' });
        onApproved?.();
      } else if (
        currentPayment.status === 'DECLINED' ||
        currentPayment.status === 'ERROR'
      ) {
        globalThis.toastRef?.show('Pago rechazado', { type: 'danger' });
        onDeclined?.();
      }
    }
  }, [currentPayment?.status, onApproved, onDeclined]);

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
