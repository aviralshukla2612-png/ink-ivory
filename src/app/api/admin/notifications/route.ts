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

  const campaigns = await androidStore.listCampaigns();

  return NextResponse.json({
    success: true,
    data: campaigns,
  });
}

export async function POST(request: NextRequest) {
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
    const campaign = await androidStore.createCampaign({
      title: body.title,
      body: body.body,
      platform: body.platform || 'ALL',
      targetAudience: body.targetAudience || 'ALL_CUSTOMERS',
      deepLink: body.deepLink || undefined,
      status: body.status || 'SENT',
      scheduledAt: body.scheduledAt || undefined,
      sentAt: body.status === 'SENT' ? new Date().toISOString() : undefined,
    });

    logAdminAudit({
      actor: auth.actor!,
      action: 'ADMIN_NOTIFICATION_CAMPAIGN_CREATED',
      entityType: 'NOTIFICATION_CAMPAIGN',
      entityId: campaign.id,
      metadata: { title: campaign.title, platform: campaign.platform, audience: campaign.targetAudience },
    });

    return NextResponse.json({
      success: true,
      data: campaign,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: err.message || 'Invalid campaign payload' } },
      { status: 400 }
    );
  }
}
