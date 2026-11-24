// YOU ARE MINE — Google Play Billing Provider
// Implements compliant Google Play Billing and India User Choice Billing architecture.

import { Platform } from 'react-native';

export class GooglePlayPaymentProvider {
  static providerId = 'google_play';
  static displayName = 'Google Play Billing';

  /**
   * Check if running on Android with Google Play Services
   */
  static isAvailable() {
    if (Platform.OS !== 'android') return false;
    try {
      const reactNativeIap = require('react-native-iap');
      return !!reactNativeIap;
    } catch {
      return false;
    }
  }

  /**
   * Launch official Play Store purchase flow
   */
  static async launchPayment(orderDetails) {
    if (!this.isAvailable()) {
      throw new Error(
        'Google Play Billing native module is not linked in this runtime. Direct APK or sandbox testing environment required.'
      );
    }

    const { sku = 'in.youaremine.invitation.signature', orderId } = orderDetails;

    try {
      const RNIap = require('react-native-iap');
      await RNIap.initConnection();

      const purchase = await RNIap.requestPurchase({
        sku,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });

      return {
        provider: 'google_play',
        orderId: orderId,
        purchaseToken: purchase.purchaseToken,
        productId: purchase.productId,
        packageName: purchase.packageNameAndroid,
        rawResponse: purchase,
      };
    } catch (err) {
      if (err.code === 'E_USER_CANCELLED') {
        throw new Error('PAYMENT_CANCELLED_BY_USER');
      }
      throw new Error(err.message || 'Google Play purchase failed');
    }
  }
}

export default GooglePlayPaymentProvider;
