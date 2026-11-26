// YOU ARE MINE — Mobile Payment & Publication Orchestration Service
// Coordinates server quotes, coupon application, order creation, native checkout, and verification.

import { Storage } from '../storage.service';
import apiClient from '../api';
import PaymentProviderFactory from './payment-provider.factory';

const PENDING_ORDER_KEY = 'yam_active_checkout_pending';

export class PaymentService {
  /**
   * Fetch authoritative server-side price quote with optional coupon
   * Reuses POST /api/pricing/quote
   */
  static async getQuote(draftId, couponCode = null) {
    try {
      const payload = { draftId };
      if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
        payload.couponCode = couponCode.trim().toUpperCase();
      }

      const response = await apiClient.post('/api/pricing/quote', payload);
      return response;
    } catch (err) {
      throw new Error(err.message || 'Failed to calculate invitation quote from server.');
    }
  }

  /**
   * Create or reuse an authoritative payment order
   * Reuses POST /api/payments/create-order
   */
  static async createOrder(draftId, couponCode = null, provider = 'razorpay') {
    try {
      const payload = {
        draftId,
        provider,
      };
      if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
        payload.couponCode = couponCode.trim().toUpperCase();
      }

      const response = await apiClient.post('/api/payments/create-order', payload);

      // Cache pending order reference locally for recovery across restarts
      if (response?.orderId) {
        await this.savePendingCheckout({
          orderId: response.orderId,
          draftId: draftId,
          amount: response.amount,
          currency: response.currency || 'INR',
          provider: provider,
          createdAt: new Date().toISOString(),
        });
      }

      return response;
    } catch (err) {
      throw new Error(err.message || 'Failed to create payment order on server.');
    }
  }

  /**
   * Verify completed payment with backend and trigger publication activation
   * Reuses POST /api/payments/verify
   */
  static async verifyPayment(verificationPayload) {
    try {
      const response = await apiClient.post('/api/payments/verify', verificationPayload);
      
      // On confirmed publication, clear local pending order reference
      if (response?.success && response?.publication) {
        await this.clearPendingCheckout();
      }

      return response;
    } catch (err) {
      throw new Error(err.message || 'Server verification failed. Please contact support.');
    }
  }

  /**
   * Recover an active pending order status from backend
   * Reuses GET /api/orders
   */
  static async recoverPendingOrder(orderId) {
    try {
      const response = await apiClient.get('/api/orders');
      const orders = response?.orders || [];
      const matchingOrder = orders.find((o) => o.orderId === orderId || o.id === orderId);

      if (!matchingOrder) return null;

      // If order is PAID, check if publication is already active
      if (matchingOrder.status === 'PAID') {
        const pubResponse = await apiClient.get('/api/publications');
        const publications = pubResponse?.publications || [];
        const matchingPub = publications.find(
          (p) => p.orderId === orderId || p.draftId === matchingOrder.draftId
        );

        return {
          order: matchingOrder,
          publication: matchingPub || null,
          isPaid: true,
          isPublished: !!matchingPub,
          slug: matchingPub?.snapshotData?.templateSlug || matchingPub?.slug,
        };
      }

      return {
        order: matchingOrder,
        publication: null,
        isPaid: false,
        isPublished: false,
      };
    } catch (err) {
      console.warn('[PaymentService] Failed to check pending order status:', err);
      return null;
    }
  }

  /**
   * Persist pending checkout reference
   */
  static async savePendingCheckout(data) {
    try {
      await Storage.setItemAsync(PENDING_ORDER_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('[PaymentService] Failed to cache pending checkout:', e);
    }
  }

  /**
   * Retrieve cached pending checkout reference
   */
  static async getPendingCheckout() {
    try {
      const raw = await Storage.getItemAsync(PENDING_ORDER_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /**
   * Clear cached pending checkout reference
   */
  static async clearPendingCheckout() {
    try {
      await Storage.deleteItemAsync(PENDING_ORDER_KEY);
    } catch (e) {
      console.warn('[PaymentService] Failed to clear pending checkout:', e);
    }
  }
}

export default PaymentService;
