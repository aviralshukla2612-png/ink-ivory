// YOU ARE MINE — Razorpay Native / Web Payment Provider
// Supports standard Razorpay modal checkout on web and native SDK on Android direct builds.

import { Platform } from 'react-native';

export class RazorpayPaymentProvider {
  static providerId = 'razorpay';
  static displayName = 'Razorpay (UPI, Cards, NetBanking)';

  /**
   * Check if Razorpay is configured and ready in current runtime
   */
  static isAvailable() {
    // On web, window.Razorpay script may be loaded; on native, react-native-razorpay native module
    if (Platform.OS === 'web') {
      return typeof window !== 'undefined';
    }
    // On Android direct APK builds, native module can be checked
    try {
      const nativeRazorpay = require('react-native-razorpay');
      return !!nativeRazorpay && !!nativeRazorpay.default;
    } catch {
      // In pure Expo Go or development environment without custom native binaries
      return false;
    }
  }

  /**
   * Execute payment flow using backend order details
   * @param {Object} orderDetails - Returned from POST /api/payments/create-order
   * @param {Object} customer - Customer metadata
   */
  static async launchPayment(orderDetails, customer = {}) {
    const { orderId, amount, key, currency = 'INR', draftTitle = 'Bespoke Invitation' } = orderDetails;

    if (!orderId || !key) {
      throw new Error('Invalid order reference: Missing Razorpay order ID or publishable key.');
    }

    // 1. Web Environment: Load or invoke standard Razorpay checkout
    if (Platform.OS === 'web') {
      return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
          return reject(new Error('Window context not available for Web checkout'));
        }

        const options = {
          key: key,
          amount: amount,
          currency: currency,
          name: 'YOU ARE MINE',
          description: `Publication of ${draftTitle}`,
          order_id: orderId,
          prefill: {
            name: customer.name || 'Valued Customer',
            email: customer.email || 'customer@youaremine.online',
            contact: customer.phone || '+919876543210',
          },
          theme: {
            color: '#741E32', // Brand Burgundy
          },
          handler: (response) => {
            resolve({
              provider: 'razorpay',
              orderId: response.razorpay_order_id || orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: () => {
              reject(new Error('PAYMENT_CANCELLED_BY_USER'));
            },
          },
        };

        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // Dynamic script injection fallback for web
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          script.onload = () => {
            const rzp = new window.Razorpay(options);
            rzp.open();
          };
          script.onerror = () => reject(new Error('Failed to load Razorpay payment gateway script'));
          document.body.appendChild(script);
        }
      });
    }

    // 2. Native Android / iOS with Native SDK compiled
    try {
      const nativeRazorpay = require('react-native-razorpay').default;
      const options = {
        description: `Publication: ${draftTitle}`,
        image: 'https://youaremine.online/icon-gold.png',
        currency: currency,
        key: key,
        amount: amount,
        name: 'YOU ARE MINE',
        order_id: orderId,
        prefill: {
          email: customer.email || 'customer@youaremine.online',
          contact: customer.phone || '+919876543210',
          name: customer.name || 'Valued Customer',
        },
        theme: { color: '#741E32' },
      };

      const data = await nativeRazorpay.open(options);
      return {
        provider: 'razorpay',
        orderId: data.razorpay_order_id || orderId,
        paymentId: data.razorpay_payment_id,
        signature: data.razorpay_signature,
      };
    } catch (err) {
      if (err.code === 0 || err.message?.includes('cancelled') || err.description?.includes('cancelled')) {
        throw new Error('PAYMENT_CANCELLED_BY_USER');
      }
      throw new Error(err.description || err.message || 'Razorpay payment flow failed');
    }
  }
}

export default RazorpayPaymentProvider;
