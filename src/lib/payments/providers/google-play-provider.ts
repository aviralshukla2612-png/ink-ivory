import {
  PaymentProvider,
  PaymentProviderId,
  CreateOrderInput,
  CreatedOrderResult,
  VerifyPaymentInput,
  VerificationResult,
  WebhookEventResult,
} from '../types';
import { PaymentProviderConfigurationError } from './apple-iap-provider';

/**
 * GooglePlayBillingProvider (Google Play & India User Choice Billing Boundary)
 * Preserves the Google Play Billing contract.
 * Explicitly rejects unconfigured calls and never returns mock success.
 */
export class GooglePlayBillingProvider implements PaymentProvider {
  readonly id: PaymentProviderId = 'google_play';
  readonly name = 'Google Play Billing (India UCB)';

  get isConfigured(): boolean {
    return Boolean(
      process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_KEY &&
      process.env.GOOGLE_PLAY_PACKAGE_NAME
    );
  }

  async createOrder(input: CreateOrderInput): Promise<CreatedOrderResult> {
    if (!this.isConfigured) {
      throw new PaymentProviderConfigurationError(
        this.name,
        'Google Play Developer Service Account credentials and India Alternative Billing enrollment must be configured.'
      );
    }

    return {
      provider: this.id,
      providerOrderId: `gplay_${input.draftId}_${Date.now()}`,
      amount: input.amountPaise,
      currency: input.currency || 'INR',
      isLiveOrder: true,
      providerData: {
        sku: `invitation_publish_${input.templateId.replace(/[^a-z0-9_]/g, '_')}`,
      },
    };
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerificationResult> {
    if (!this.isConfigured) {
      throw new PaymentProviderConfigurationError(
        this.name,
        'Cannot verify Google Play purchase without Google Play Developer API service account credentials.'
      );
    }

    throw new Error('Google Play Developer API purchase verification is not enabled in this environment.');
  }

  async verifyWebhook(rawBody: string, signature: string): Promise<boolean> {
    if (!this.isConfigured) return false;
    return false;
  }

  async parseWebhookEvent(rawBody: string, signature: string): Promise<WebhookEventResult> {
    throw new PaymentProviderConfigurationError(
      this.name,
      'Google Play Real-Time Developer Notifications (RTDN via Cloud Pub/Sub) requires active service account.'
    );
  }
}
