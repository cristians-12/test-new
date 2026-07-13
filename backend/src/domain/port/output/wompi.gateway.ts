export interface WompiTransactionResponse {
  data?: {
    id: string;
    status: string;
    [key: string]: any;
  };
}

export interface WompiTokenResponse {
  data?: {
    id: string;
    [key: string]: any;
  };
}

export interface WompiMerchantResponse {
  data?: {
    presigned_acceptance?: {
      acceptance_token: string;
    };
    [key: string]: any;
  };
}

export interface IWompiGateway {
  getAcceptanceToken(): Promise<string>;
  tokenizeCard(cardData: {
    card_number: string;
    cvv: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
  }): Promise<string>;
  createTransaction(payload: {
    acceptance_token: string;
    amount_in_cents: number;
    currency: string;
    customer_email: string;
    payment_method: Record<string, any>;
    reference: string;
    signature: string;
  }): Promise<WompiTransactionResponse>;
  getTransaction(transactionId: string): Promise<WompiTransactionResponse | null>;
  generateSignature(reference: string, amountInCents: number, integrityKey: string): Promise<string>;
  validateWebhookSignature(events: any[], receivedSignature: string): Promise<boolean>;
}
