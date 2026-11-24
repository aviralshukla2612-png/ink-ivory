// YOU ARE MINE — Apple StoreKit / In-App Purchase Provider
// Implements Apple Guideline 3.1.1 compliant digital publication purchase flow.

import { Platform } from 'react-native';

export class AppleIapPaymentProvider {
  static providerId = 'apple_iap';
  static displayName = 'Apple In-App Purchase (StoreKit)';

  /**
   * Check if running on iOS with StoreKit support
   */
  static isAvailable() {
    if (Platform.OS !== 'ios') return false;
    try {
      const reactNativeIap = require('react-native-iap');
      return !!reactNativeIap;
    } catch {
      return false;
    }
  }

  /**
   * Launch StoreKit In-App Purchase flow
   */
  static async launchPayment(orderDetails) {
    if (!this.isAvailable()) {
      throw new Error(
        'Apple In-App Purchase StoreKit module is not linked in this runtime. iOS device or sandbox build required.'
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
        provider: 'apple_iap',
        orderId: orderId,
        transactionId: purchase.transactionId,
        transactionReceipt: purchase.transactionReceipt,
        productId: purchase.productId,
        rawResponse: purchase,
      };
    } catch (err) {
      if (err.code === 'E_USER_CANCELLED') {
        throw new Error('PAYMENT_CANCELLED_BY_USER');
      }
      throw new Error(err.message || 'StoreKit purchase failed');
    }
  }
}

export default AppleIapPaymentProvider;
