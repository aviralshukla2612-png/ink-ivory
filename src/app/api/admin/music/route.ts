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

  const auth = requirePermission(request, 'MEDIA_MANAGE');
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: auth.error } },
      { status: auth.status }
    );
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;

  const tracks = await androidStore.listMusicTracks({ category, search });

  return NextResponse.json({
    success: true,
    data: tracks,
    total: tracks.length,
  });
}

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request, 'adminApi');
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, 'MEDIA_MANAGE');
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
    const track = await androidStore.saveMusicTrack(body);

    logAdminAudit({
      actor: auth.actor!,
      action: 'ADMIN_MUSIC_TRACK_SAVED',
      entityType: 'MUSIC_TRACK',
      entityId: track.id,
      metadata: { title: track.title, category: track.category, source: track.source },
    });

    return NextResponse.json({
      success: true,
      data: track,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: err.message || 'Invalid track payload' } },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const rl = checkRateLimit(request, 'adminApi');
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, 'MEDIA_MANAGE');
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

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing track id' }, { status: 400 });
  }

  const deleted = await androidStore.deleteMusicTrack(id);

  if (!deleted) {
    return NextResponse.json({ success: false, error: 'Track not found or cannot delete built-in track' }, { status: 404 });
  }

  logAdminAudit({
    actor: auth.actor!,
    action: 'ADMIN_MUSIC_TRACK_DELETED',
    entityType: 'MUSIC_TRACK',
    entityId: id,
  });

  return NextResponse.json({ success: true, message: 'Track deleted' });
}
