/**
 * Payment Deduplication & Concurrency Lock Engine
 * Guarantees idempotent webhook processing and prevents race conditions
 * between concurrent client verification and webhook delivery.
 */

// In-memory processed event set (persists during node runtime)
const processedEvents = new Map<string, { timestamp: number; status: string }>();

// In-flight mutex locks per orderId
const inFlightLocks = new Map<string, number>();

const EVENT_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const LOCK_TIMEOUT_MS = 1000 * 30; // 30 seconds

export const PaymentDeduplicationService = {
  /**
   * Checks if a provider event ID was already processed.
   */
  isEventProcessed(eventId: string): boolean {
    if (!eventId) return false;
    const existing = processedEvents.get(eventId);
    if (!existing) return false;

    // Check if expired
    if (Date.now() - existing.timestamp > EVENT_TTL_MS) {
      processedEvents.delete(eventId);
      return false;
    }
    return true;
  },

  /**
   * Records a provider event ID as processed.
   */
  markEventProcessed(eventId: string, status: string = 'SUCCESS'): void {
    if (!eventId) return;
    processedEvents.set(eventId, {
      timestamp: Date.now(),
      status,
    });
  },

  /**
   * Acquires a concurrency lock for an orderId.
   * Returns true if lock acquired, false if another process is currently operating on it.
   */
  acquireOrderLock(orderId: string): boolean {
    if (!orderId) return true;
    const lockTime = inFlightLocks.get(orderId);
    const now = Date.now();

    if (lockTime && now - lockTime < LOCK_TIMEOUT_MS) {
      // Locked by concurrent request
      return false;
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
   * Clears internal state (useful for test resets).
   */
  _resetForTesting(): void {
    processedEvents.clear();
    inFlightLocks.clear();
  },
};
