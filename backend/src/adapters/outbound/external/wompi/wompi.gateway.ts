import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IWompiGateway, WompiTransactionResponse } from '../../../../domain/port/output/wompi.gateway';

@Injectable()
export class WompiApiGateway implements IWompiGateway {
  private readonly logger = new Logger(WompiApiGateway.name);
  private readonly apiUrl: string;
  private readonly publicKey: string;
  private readonly privateKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = this.configService.get(
      'WOMPI_API_URL',
      'https://api-sandbox.co.uat.wompi.dev/v1',
    );
    this.publicKey = this.configService.get('WOMPI_PUBLIC_KEY', '');
    this.privateKey = this.configService.get('WOMPI_PRIVATE_KEY', '');
  }

  async getAcceptanceToken(): Promise<string> {
    const response = await fetch(
      `${this.apiUrl}/merchants/${this.publicKey}`,
    );

    if (!response.ok) {
      throw new Error('Error al obtener acceptance token');
    }

    const data = await response.json();
    return data?.data?.presigned_acceptance?.acceptance_token || '';
  }

  async tokenizeCard(cardData: {
    card_number: string;
    cvv: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
  }): Promise<string> {
    const payload = {
      number: cardData.card_number.replace(/\s/g, ''),
      cvc: cardData.cvv,
      exp_month: cardData.exp_month,
      exp_year: cardData.exp_year.slice(-2),
      card_holder: cardData.card_holder,
    };

    const response = await fetch(`${this.apiUrl}/tokens/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.publicKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error tokenizing card: ${JSON.stringify(errorData)}`,
      );
    }

    const data = await response.json();
    return data?.data?.id || '';
  }

  async createTransaction(payload: {
    acceptance_token: string;
    amount_in_cents: number;
    currency: string;
    customer_email: string;
    payment_method: Record<string, any>;
    reference: string;
    signature: string;
  }): Promise<WompiTransactionResponse> {
    const response = await fetch(`${this.apiUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.privateKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error Wompi: ${JSON.stringify(errorData)}`,
      );
    }

    return response.json();
  }

  async getTransaction(transactionId: string): Promise<WompiTransactionResponse | null> {
    try {
      const response = await fetch(
        `${this.apiUrl}/transactions/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${this.privateKey}`,
          },
        },
      );

      if (response.ok) {
        return response.json();
      }
      return null;
    } catch (error) {
      this.logger.warn(`Error fetching transaction ${transactionId}`, error);
      return null;
    }
  }

  async generateSignature(reference: string, amountInCents: number, integrityKey: string): Promise<string> {
    const concatenated = `${reference}${amountInCents}COP${integrityKey}`;

    const encoder = new TextEncoder();
    const data = encoder.encode(concatenated);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async validateWebhookSignature(events: any[], receivedSignature: string): Promise<boolean> {
    if (!receivedSignature) return false;

    const eventsJson = JSON.stringify(events);

    const encoder = new TextEncoder();
    const data = encoder.encode(eventsJson);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const computedSignature = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return computedSignature === receivedSignature;
  }
}
