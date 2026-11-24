/**
 * Payment Deduplication & Concurrency Lock Engine
 * Guarantees persistent webhook deduplication surviving server restarts
 * and mutex locks to prevent race conditions.
 */
import { store } from '../store';

// In-memory processed event set for sub-millisecond memory checks
const memoryEvents = new Map<string, { timestamp: number; status: string }>();

// In-flight mutex locks per orderId
const inFlightLocks = new Map<string, number>();

const EVENT_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const LOCK_TIMEOUT_MS = 1000 * 30; // 30 seconds

export const PaymentDeduplicationService = {
  /**
   * Checks if a provider event ID was already processed (checking both memory and persistent store).
   */
  isEventProcessed(eventId: string): boolean {
    if (!eventId) return false;

    // 1. Fast in-memory check
    const existing = memoryEvents.get(eventId);
    if (existing && Date.now() - existing.timestamp < EVENT_TTL_MS) {
      return true;
    }

    // 2. Persistent store check (survives process crashes/restarts)
    return store.hasWebhookEvent(eventId);
  },

  /**
   * Records a provider event ID as processed in both memory and persistent storage.
   */
  async markEventProcessed(
    event: {
      eventId: string;
      provider?: string;
      eventType?: string;
      orderId?: string;
      paymentId?: string;
      status?: string;
    } | string,
    fallbackStatus: string = 'SUCCESS'
  ): Promise<boolean> {
    const eventId = typeof event === 'string' ? event : event.eventId;
    const status = typeof event === 'string' ? fallbackStatus : event.status || fallbackStatus;
    const provider = typeof event === 'string' ? 'razorpay' : event.provider || 'razorpay';
    const eventType = typeof event === 'string' ? 'generic' : event.eventType || 'generic';

    if (!eventId) return false;

    // Record in memory
    memoryEvents.set(eventId, {
      timestamp: Date.now(),
      status,
    });

    // Record in persistent store
    return await store.recordWebhookEvent({
      eventId,
      provider,
      eventType,
      orderId: typeof event === 'string' ? undefined : event.orderId,
      paymentId: typeof event === 'string' ? undefined : event.paymentId,
      status,
    });
  },

  /**
   * Acquires a concurrency lock for an orderId.
   */
  acquireOrderLock(orderId: string): boolean {
    if (!orderId) return true;
    const lockTime = inFlightLocks.get(orderId);
    const now = Date.now();

    if (lockTime && now - lockTime < LOCK_TIMEOUT_MS) {
      return false; // Locked by another concurrent request
    }

    inFlightLocks.set(orderId, now);
    return true;
  },

  /**
   * Releases an order lock.
   */
  releaseOrderLock(orderId: string): void {
    if (!orderId) return;
    inFlightLocks.delete(orderId);
  },

  /**
   * Executes an async operation with an automatic order lock.
   */
  async withOrderLock<T>(orderId: string, operation: () => Promise<T>): Promise<T> {
    const acquired = this.acquireOrderLock(orderId);
    if (!acquired) {
      throw new Error(`Concurrent transaction processing in progress for order ${orderId}. Please retry.`);
    }

    try {
      return await operation();
    } finally {
      this.releaseOrderLock(orderId);
    }
  },

  /**
   * Clears in-memory test state.
   */
  _resetForTesting(): void {
    memoryEvents.clear();
    inFlightLocks.clear();
  },
};
