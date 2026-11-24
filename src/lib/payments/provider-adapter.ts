import { PaymentProvider, PaymentProviderId } from './types';
import { RazorpayProvider } from './providers/razorpay-provider';
import { AppleIAPProvider } from './providers/apple-iap-provider';
import { GooglePlayBillingProvider } from './providers/google-play-provider';

class PaymentProviderRegistry {
  private providers: Map<PaymentProviderId, PaymentProvider> = new Map();

  constructor() {
    this.register(new RazorpayProvider());
    this.register(new AppleIAPProvider());
    this.register(new GooglePlayBillingProvider());
  }

  register(provider: PaymentProvider): void {
    this.providers.set(provider.id, provider);
  }

  get(providerId: PaymentProviderId = 'razorpay'): PaymentProvider {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Unsupported payment provider: ${providerId}`);
    }
    return provider;
  }

  getAll(): PaymentProvider[] {
    return Array.from(this.providers.values());
  }
}

export const providerRegistry = new PaymentProviderRegistry();

export function getPaymentProvider(providerId: PaymentProviderId = 'razorpay'): PaymentProvider {
  return providerRegistry.get(providerId);
}

export * from './types';
export * from './deduplication';
