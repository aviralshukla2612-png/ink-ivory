import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { PublicationRecoveryService } from '@/lib/payments/recovery-service';
import { logSecurityEvent } from '@/lib/security/logger';

// Concurrency mutex lock to prevent overlapping recovery worker runs across intervals
let isRecoveryRunning = false;
let lastRecoveryRunTime = 0;
const MIN_RECOVERY_INTERVAL_MS = 10_000; // Minimum 10 seconds between invocations

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

    // Overlapping execution guard
    const now = Date.now();
    if (isRecoveryRunning) {
      logSecurityEvent({
        event: 'RECOVERY_CRON_OVERLAP_BLOCKED',
        level: 'WARN',
        details: { message: 'Previous recovery job is still executing' },
      });
      return NextResponse.json(
        {
          success: false,
          status: 'RECOVERY_ALREADY_IN_PROGRESS',
          message: 'Previous recovery execution has not yet completed.',
        },
        { status: 429 }
      );
    }

    // Rate limiting between runs
    if (now - lastRecoveryRunTime < MIN_RECOVERY_INTERVAL_MS && !isLocalDev) {
      return NextResponse.json(
        {
          success: false,
          status: 'RECOVERY_RATE_LIMITED',
          message: 'Minimum interval between recovery runs is 10 seconds.',
        },
        { status: 429 }
      );
    }

    isRecoveryRunning = true;
    lastRecoveryRunTime = now;

    try {
      // Execute bounded batch scan (max 50 orders)
      const recoveryReport = await PublicationRecoveryService.recoverOrphanedPaidOrders();

      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        recoveredOrdersCount: recoveryReport.recoveredCount,
        orphanedFound: recoveryReport.orphanedFound,
        status: 'RECOVERY_SCAN_COMPLETED',
      });
    } finally {
      isRecoveryRunning = false;
    }
  } catch (error: any) {
    isRecoveryRunning = false;
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
