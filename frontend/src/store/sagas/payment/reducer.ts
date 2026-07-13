import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PaymentRequest {
  product_id: number;
  customer_email: string;
  card_number: string;
  cvv: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
}

export interface PaymentResponse {
  id: number;
  reference: string;
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  status: string;
  product_id: number | null;
  product_name: string | null;
  created_at: string;
}

interface PaymentState {
  currentPayment: PaymentResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  currentPayment: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    processPayment(state, _action: PayloadAction<PaymentRequest>) {
      state.loading = true;
      state.error = null;
      state.currentPayment = null;
    },
    processPaymentSuccess(state, action: PayloadAction<PaymentResponse>) {
      state.currentPayment = action.payload;
      state.loading = false;
    },
    processPaymentFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearPayment(state) {
      state.currentPayment = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  processPayment,
  processPaymentSuccess,
  processPaymentFailure,
  clearPayment,
} = paymentSlice.actions;

export default paymentSlice.reducer;
