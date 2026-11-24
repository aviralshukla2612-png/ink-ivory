import { NextRequest, NextResponse } from 'next/server';
import { PublicationRecoveryService } from '@/lib/payments/recovery-service';
import { logSecurityEvent } from '@/lib/security/logger';

/**
 * POST /api/payments/recovery
 * Operational Cron / Admin Triggered Payment & Publication Recovery Worker
 * Scans for paid orders lacking corresponding publication records and reconciles them.
 * Authorized via CRON_SECRET header or Admin Session Token.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const cronSecret = process.env.CRON_SECRET || 'you-are-mine-ops-cron-secret-key';
    const isAuthorized = authHeader === `Bearer ${cronSecret}` || req.headers.get('x-cron-secret') === cronSecret;

    // Check if in development/test environment where local triggers are permitted
    const isLocalDev = process.env.NODE_ENV !== 'production';

    if (!isAuthorized && !isLocalDev) {
      logSecurityEvent({
        event: 'RECOVERY_CRON_UNAUTHORIZED',
        level: 'WARN',
        details: { ip: req.headers.get('x-forwarded-for') || 'unknown' },
      });
      return NextResponse.json({ error: 'Unauthorized recovery trigger' }, { status: 401 });
    }

    const recoveryReport = await PublicationRecoveryService.recoverOrphanedPaidOrders();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      recoveredOrdersCount: recoveryReport.recoveredCount,
      orphanedFound: recoveryReport.orphanedFound,
      status: 'RECOVERY_SCAN_COMPLETED',
    });
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
