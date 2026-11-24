import {
  PaymentProvider,
  PaymentProviderId,
  CreateOrderInput,
  CreatedOrderResult,
  VerifyPaymentInput,
  VerificationResult,
  WebhookEventResult,
} from '../types';
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
  verifyWebhookSignature,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
} from '../../razorpay';
import { logSecurityEvent } from '../../security/logger';

export class RazorpayProvider implements PaymentProvider {
  readonly id: PaymentProviderId = 'razorpay';
  readonly name = 'Razorpay Gateway';

  get isConfigured(): boolean {
    const keyId = process.env.RAZORPAY_KEY_ID || RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || RAZORPAY_KEY_SECRET;
    return Boolean(
      keyId &&
      keySecret &&
      !keyId.includes('test_inkivory') &&
      !keyId.includes('PLEASE_PASTE') &&
      !keyId.includes('placeholder')
    );
  }

  async createOrder(input: CreateOrderInput): Promise<CreatedOrderResult> {
    const result = await createRazorpayOrder({
      amount: input.amountPaise,
      currency: input.currency || 'INR',
      receipt: input.receipt,
      notes: {
        draftId: input.draftId,
        templateId: input.templateId,
        customerPhone: input.customerPhone,
        customerName: input.customerName,
        ...(input.notes || {}),
      },
    });

    return {
      provider: this.id,
      providerOrderId: result.id,
      amount: result.amount,
      currency: result.currency,
      isLiveOrder: result.isLiveRazorpayOrder,
      providerData: {
        keyId: process.env.RAZORPAY_KEY_ID || RAZORPAY_KEY_ID,
      },
    };
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerificationResult> {
    if (!input.signature) {
      logSecurityEvent({
        event: 'PAYMENT_VERIFICATION_MISSING_SIGNATURE',
        level: 'CRITICAL',
        details: { orderId: input.orderId, paymentId: input.paymentId },
      });
      return {
        success: false,
        provider: this.id,
        providerPaymentId: input.paymentId,
        providerOrderId: input.orderId,
        status: 'FAILED',
        amountPaise: input.expectedAmountPaise || 0,
        currency: input.expectedCurrency || 'INR',
        signatureValid: false,
        error: 'Missing payment signature.',
      };
    }

    const isValid = verifyRazorpaySignature({
      orderId: input.orderId,
      paymentId: input.paymentId,
      signature: input.signature,
    });

    if (!isValid) {
      logSecurityEvent({
        event: 'PAYMENT_SIGNATURE_VERIFICATION_FAILED',
        level: 'CRITICAL',
        details: { orderId: input.orderId, paymentId: input.paymentId },
      });
      return {
        success: false,
        provider: this.id,
        providerPaymentId: input.paymentId,
        providerOrderId: input.orderId,
        status: 'FAILED',
        amountPaise: input.expectedAmountPaise || 0,
        currency: input.expectedCurrency || 'INR',
        signatureValid: false,
        error: 'Invalid payment signature. Verification rejected.',
      };
    }

    return {
      success: true,
      provider: this.id,
      providerPaymentId: input.paymentId,
      providerOrderId: input.orderId,
      status: 'CAPTURED',
      amountPaise: input.expectedAmountPaise || 0,
      currency: input.expectedCurrency || 'INR',
      signatureValid: true,
    };
  }

  async verifyWebhook(rawBody: string, signature: string): Promise<boolean> {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || RAZORPAY_KEY_SECRET;
    return verifyWebhookSignature(rawBody, signature, webhookSecret);
  }

  async parseWebhookEvent(rawBody: string, signature: string): Promise<WebhookEventResult> {
    const isAuthentic = await this.verifyWebhook(rawBody, signature);
    if (!isAuthentic) {
      throw new Error('Invalid webhook signature');
    }

    const event = JSON.parse(rawBody);
    const eventId = event.event_id || event.id || `evt_rzp_${Date.now()}`;
    const eventType = event.event || '';

    const paymentEntity = event.payload?.payment?.entity;
    const orderEntity = event.payload?.order?.entity;

    const orderId = paymentEntity?.order_id || orderEntity?.id;
    const paymentId = paymentEntity?.id;
    const amountPaise = paymentEntity?.amount || orderEntity?.amount;
    const currency = paymentEntity?.currency || orderEntity?.currency || 'INR';

    let status: WebhookEventResult['status'] = 'PROCESSING';
    let isHandled = false;

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      status = 'CAPTURED';
      isHandled = true;
    } else if (eventType === 'payment.authorized') {
      status = 'AUTHORIZED';
      isHandled = true;
    } else if (eventType === 'payment.failed') {
      status = 'FAILED';
      isHandled = true;
    } else if (eventType === 'refund.processed' || eventType === 'refund.created') {
      status = 'REFUNDED';
      isHandled = true;
    }

    return {
      provider: this.id,
      eventId,
      eventType,
      orderId,
      paymentId,
      status,
      amountPaise,
      currency,
      isHandled,
      rawEntity: event,
    };
  }
}
