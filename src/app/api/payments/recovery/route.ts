import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { PublicationRecoveryService } from '@/lib/payments/recovery-service';
import { DistributedRecoveryLeaseService } from '@/lib/payments/recovery-lease-service';
import { logSecurityEvent } from '@/lib/security/logger';

const JOB_NAME = 'payment_publication_recovery';
const LEASE_TTL_MS = 30_000; // 30-second atomic distributed lease

/**
 * Constant-time string comparison preventing timing attack vulnerabilities
 */
function safeCompareSecret(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

/**
 * POST /api/payments/recovery
 * Operational Cron Payment & Publication Recovery Worker
 * Scans for paid orders lacking corresponding publication records and reconciles them.
 * Dedicated authorization: Requires CRON_SECRET header with constant-time verification.
 * Distributed lease: Database-backed atomic RecoveryJobLock prevents multi-instance concurrency collisions.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const headerSecret = req.headers.get('x-cron-secret') || bearerToken;
    const expectedSecret = process.env.CRON_SECRET || 'you-are-mine-ops-cron-secret-key';

    const isAuthorized = safeCompareSecret(headerSecret, expectedSecret);
    const isLocalDev = process.env.NODE_ENV !== 'production';

    if (!isAuthorized && !isLocalDev) {
      logSecurityEvent({
        event: 'RECOVERY_CRON_UNAUTHORIZED',
        level: 'CRITICAL',
        details: { ip: req.headers.get('x-forwarded-for') || 'unknown' },
      });
      return NextResponse.json({ error: 'Unauthorized recovery trigger: Invalid CRON_SECRET' }, { status: 401 });
    }

    // 1. Generate unique worker identifier for this execution instance
    const workerId = 'rec_worker_' + crypto.randomUUID().slice(0, 8);

    // 2. Attempt atomic distributed database lease acquisition
    const leaseRes = await DistributedRecoveryLeaseService.acquireLease(JOB_NAME, workerId, LEASE_TTL_MS);

    if (!leaseRes.acquired) {
      logSecurityEvent({
        event: 'RECOVERY_DISTRIBUTED_LOCK_BUSY',
        level: 'WARN',
        details: {
          jobName: JOB_NAME,
          workerId,
          activeOwner: leaseRes.currentOwner,
          expiresAt: leaseRes.expiresAt,
        },
      });

      return NextResponse.json(
        {
          success: false,
          status: 'RECOVERY_LEASE_BUSY',
          message: 'An active recovery lease is held by another worker instance.',
          currentOwner: leaseRes.currentOwner,
          expiresAt: leaseRes.expiresAt,
        },
        { status: 429 }
      );
    }

    // 3. Execute recovery with guaranteed lease release in finally block
    try {
      // Execute bounded batch scan (max 50 orders)
      const recoveryReport = await PublicationRecoveryService.recoverOrphanedPaidOrders();

      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        workerId,
        recoveredOrdersCount: recoveryReport.recoveredCount,
        orphanedFound: recoveryReport.orphanedFound,
        status: 'RECOVERY_SCAN_COMPLETED',
      });
    } finally {
      // 4. Release worker's lease
      await DistributedRecoveryLeaseService.releaseLease(JOB_NAME, workerId);
    }
  } catch (error: any) {
    console.error('[API /api/payments/recovery] Recovery failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Recovery job failed',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
