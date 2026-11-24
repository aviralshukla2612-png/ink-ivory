import { store, PaymentOrderRecord } from '../store';
import { PublicationActivationService } from './publication-service';
import { logSecurityEvent } from '../security/logger';

export interface RecoveryReport {
  scannedOrders: number;
  orphanedFound: number;
  recoveredCount: number;
  failedCount: number;
  recoveredOrders: string[];
  errors: Array<{ orderId: string; error: string }>;
}

export class PublicationRecoveryService {
  /**
   * Scans for paid orders that lack an active publication record and recovers them.
   * Guarantees that paid customers are never left without a live publication even after process restarts or server crashes.
   */
  static async recoverOrphanedPaidOrders(): Promise<RecoveryReport> {
    (store as any).init?.();
    const allOrders = (store as any).data?.orders || [];
    const allPublications = (store as any).data?.publications || [];

    const paidOrders: PaymentOrderRecord[] = allOrders.filter(
      (o: PaymentOrderRecord) => o.status === 'PAID'
    );

    const report: RecoveryReport = {
      scannedOrders: paidOrders.length,
      orphanedFound: 0,
      recoveredCount: 0,
      failedCount: 0,
      recoveredOrders: [],
      errors: [],
    };

    for (const order of paidOrders) {
      // Check if a publication exists for this draft or order
      const hasPublication = allPublications.some(
        (p: any) => p.draftId === order.draftId || (order.notes?.publicationId && p.id === order.notes.publicationId)
      );

      if (!hasPublication) {
        report.orphanedFound++;

        logSecurityEvent({
          event: 'ORPHANED_PAID_ORDER_DETECTED',
          level: 'WARN',
          details: { orderId: order.orderId, draftId: order.draftId },
        });

        try {
          const result = await PublicationActivationService.activate({
            orderId: order.orderId,
            requestedSlug: order.notes?.slug,
            actor: 'RECOVERY_WORKER',
          });

          if (result.success) {
            report.recoveredCount++;
            report.recoveredOrders.push(order.orderId);

            logSecurityEvent({
              event: 'ORPHANED_ORDER_RECOVERED_SUCCESSFULLY',
              level: 'INFO',
              details: { orderId: order.orderId, slug: result.slug },
            });
          }
        } catch (recoveryErr: any) {
          report.failedCount++;
          report.errors.push({
            orderId: order.orderId,
            error: recoveryErr.message || 'Unknown recovery error',
          });

          console.warn(`[PublicationRecoveryService] Failed to recover order ${order.orderId}:`, recoveryErr.message);
        }
      }
    }

    return report;
  }
}

export default PublicationRecoveryService;
