/**
 * YOU ARE MINE — PAYMENT PROVIDER TYPES & LIFECYCLE CONTRACTS
 * Milestone 7B — Multi-provider payment abstraction
 */

export type PaymentProviderId = 'razorpay' | 'apple_iap' | 'google_play';

export type PaymentLifecycleStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export interface CreateOrderInput {
  draftId: string;
  templateId: string;
  amountPaise: number;
  currency: string;
  receipt: string;
  customerPhone?: string;
  customerName?: string;
  notes?: Record<string, any>;
}

export interface CreatedOrderResult {
  provider: PaymentProviderId;
  providerOrderId: string;
  amount: number; // in paise
  currency: string;
  isLiveOrder: boolean;
  providerData?: Record<string, any>;
}

export interface VerifyPaymentInput {
  orderId: string;
  paymentId: string;
  signature?: string;
  expectedAmountPaise?: number;
  expectedCurrency?: string;
  rawPayload?: any;
}

export interface VerificationResult {
  success: boolean;
  provider: PaymentProviderId;
  providerPaymentId: string;
  providerOrderId: string;
  status: PaymentLifecycleStatus;
  amountPaise: number;
  currency: string;
  signatureValid: boolean;
  error?: string;
}

export interface WebhookEventResult {
  provider: PaymentProviderId;
  eventId: string;
  eventType: string;
  orderId?: string;
  paymentId?: string;
  status: PaymentLifecycleStatus;
  amountPaise?: number;
  currency?: string;
  isHandled: boolean;
  rawEntity?: any;
}

export interface PaymentProvider {
  readonly id: PaymentProviderId;
  readonly name: string;
  readonly isConfigured: boolean;

  createOrder(input: CreateOrderInput): Promise<CreatedOrderResult>;
  verifyPayment(input: VerifyPaymentInput): Promise<VerificationResult>;
  verifyWebhook(rawBody: string, signature: string): Promise<boolean>;
  parseWebhookEvent(rawBody: string, signature: string): Promise<WebhookEventResult>;
}
