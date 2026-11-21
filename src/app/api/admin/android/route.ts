import { NextRequest, NextResponse } from 'next/server';
import { androidStore } from '@/lib/android-store';
import { requirePermission } from '@/lib/security/rbac';
import { verifyCsrfOrigin } from '@/lib/auth';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { createRateLimitResponse } from '@/lib/security/rate-limit-response';
import { logAdminAudit } from '@/lib/security/audit';

export async function GET(request: NextRequest) {
  const rl = checkRateLimit(request, 'adminApi');
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, 'SETTINGS_MANAGE');
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: auth.error } },
      { status: auth.status }
    );
  }

  const [config, analytics] = await Promise.all([
    androidStore.getConfig(),
    androidStore.getAnalytics(),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      config,
      analytics,
    },
  });
}

export async function PUT(request: NextRequest) {
  const rl = checkRateLimit(request, 'adminApi');
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, 'SETTINGS_MANAGE');
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: auth.error } },
      { status: auth.status }
    );
  }

  if (!verifyCsrfOrigin(request)) {
    return NextResponse.json(
      { success: false, error: { code: 'CSRF_ERROR', message: 'Cross-origin request rejected.' } },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const updated = await androidStore.updateConfig(body);

    logAdminAudit({
      actor: auth.actor!,
      action: 'ADMIN_ANDROID_CONFIG_UPDATED',
      entityType: 'ANDROID_CONFIG',
      entityId: updated.id,
      metadata: { minVersion: updated.minSupportedVersion, latestVersion: updated.latestVersion, forceUpdate: updated.forceUpdateRequired },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: err.message || 'Invalid config payload' } },
      { status: 400 }
    );
  }
}
