// YOU ARE MINE — Payment Provider Factory
// Selects and configures the appropriate payment provider according to platform distribution channel.

import { Platform } from 'react-native';
import RazorpayPaymentProvider from './razorpay-payment.provider';
import GooglePlayPaymentProvider from './google-play-payment.provider';
import AppleIapPaymentProvider from './apple-iap-payment.provider';

export class PaymentProviderFactory {
  /**
   * Determine primary payment provider for current platform
   */
  static getPrimaryProvider() {
    if (Platform.OS === 'web') {
      return RazorpayPaymentProvider;
    }
    if (Platform.OS === 'ios') {
      return AppleIapPaymentProvider;
    }
    if (Platform.OS === 'android') {
      // If running with Google Play Billing native binary linked
      if (GooglePlayPaymentProvider.isAvailable()) {
        return GooglePlayPaymentProvider;
      }
      // Direct APK / developer sandbox fallback
      return RazorpayPaymentProvider;
    }
    return RazorpayPaymentProvider;
  }

  /**
   * Return all selectable providers with capability status
   */
  static getAvailableProviders() {
    const primary = this.getPrimaryProvider();

    return [
      {
        id: 'razorpay',
        name: 'Razorpay Gateway',
        subtitle: 'UPI, Credit/Debit Cards, Net Banking',
        badge: 'Recommended for India',
        icon: 'credit-card',
        isAvailable: RazorpayPaymentProvider.isAvailable() || Platform.OS === 'web',
        isPrimary: primary.providerId === 'razorpay',
        policyNote: 'Approved for Web & Direct Android APK distribution',
      },
      {
        id: 'google_play',
        name: 'Google Play Billing',
        subtitle: 'Play Store In-App Billing & User Choice',
        badge: 'Google Play',
        icon: 'smartphone',
        isAvailable: GooglePlayPaymentProvider.isAvailable(),
        isPrimary: primary.providerId === 'google_play',
        policyNote: 'Mandatory for Google Play Store India distribution',
      },
      {
        id: 'apple_iap',
        name: 'Apple In-App Purchase',
        subtitle: 'StoreKit Digital Publication Purchase',
        badge: 'Apple StoreKit',
        icon: 'shield-check',
        isAvailable: AppleIapPaymentProvider.isAvailable(),
        isPrimary: primary.providerId === 'apple_iap',
        policyNote: 'Mandatory for iOS App Store distribution (Guideline 3.1.1)',
      },
    ];
  }

  /**
   * Get provider instance by ID
   */
  static getProviderById(providerId) {
    switch (providerId) {
      case 'google_play':
        return GooglePlayPaymentProvider;
      case 'apple_iap':
        return AppleIapPaymentProvider;
      case 'razorpay':
      default:
        return RazorpayPaymentProvider;
    }
  }
}

export default PaymentProviderFactory;
