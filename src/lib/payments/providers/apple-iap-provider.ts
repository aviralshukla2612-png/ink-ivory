import {
  PaymentProvider,
  PaymentProviderId,
  CreateOrderInput,
  CreatedOrderResult,
  VerifyPaymentInput,
  VerificationResult,
  WebhookEventResult,
} from '../types';

export class PaymentProviderConfigurationError extends Error {
  constructor(providerName: string, reason: string) {
    super(`[${providerName}] Configuration Required: ${reason}`);
    this.name = 'PaymentProviderConfigurationError';
  }
}

/**
 * AppleIAPProvider (StoreKit 2 Boundary)
 * Preserves the StoreKit 2 integration contract.
 * Explicitly rejects unconfigured calls and never returns mock success.
 */
export class AppleIAPProvider implements PaymentProvider {
  readonly id: PaymentProviderId = 'apple_iap';
  readonly name = 'Apple In-App Purchase (StoreKit 2)';

  get isConfigured(): boolean {
    return Boolean(
      process.env.APPLE_IAP_ISSUER_ID &&
      process.env.APPLE_IAP_KEY_ID &&
      process.env.APPLE_IAP_PRIVATE_KEY &&
      process.env.APPLE_IAP_BUNDLE_ID
    );
  }

  async createOrder(input: CreateOrderInput): Promise<CreatedOrderResult> {
    if (!this.isConfigured) {
      throw new PaymentProviderConfigurationError(
        this.name,
        'Apple App Store Connect credentials (APPLE_IAP_ISSUER_ID, APPLE_IAP_KEY_ID, APPLE_IAP_BUNDLE_ID) must be configured in environment variables.'
      );
    }

    // In StoreKit 2, orders map to a product tier definition snapshot
    return {
      provider: this.id,
      providerOrderId: `appl_${input.draftId}_${Date.now()}`,
      amount: input.amountPaise,
      currency: input.currency || 'INR',
      isLiveOrder: true,
      providerData: {
        productId: `com.youaremine.invitation.publish.${input.templateId}`,
      },
    };
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerificationResult> {
    if (!this.isConfigured) {
      throw new PaymentProviderConfigurationError(
        this.name,
        'Cannot verify Apple In-App Purchase without App Store Server API credentials.'
      );
    }

    // Strict validation against Apple App Store Server API (JWS verification)
    throw new Error('Apple IAP Server-to-Server verification is not enabled in this environment.');
  }

  async verifyWebhook(rawBody: string, signature: string): Promise<boolean> {
    if (!this.isConfigured) return false;
    return false;
  }

  async parseWebhookEvent(rawBody: string, signature: string): Promise<WebhookEventResult> {
    throw new PaymentProviderConfigurationError(
      this.name,
      'Apple App Store Server Notifications V2 webhook handler requires active certificate chain validation.'
    );
  }
}
