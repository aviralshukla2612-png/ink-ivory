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

  let tracks = await androidStore.listMusicTracks({ category, search });

  const defaultTracks = [
    {
      id: 'trk_kesariya_flute',
      title: 'Kesariya (Soulful Flute Cover)',
      movie: 'Brahmāstra',
      artist: 'Divyansh Shrivastava / Arijit Singh',
      category: 'Wedding',
      tag: 'Soulful Flute Romance',
      source: '/audio/kesariya-flute.mp3',
      duration: 246,
      fileSize: '7.8 MB',
      isActive: true,
      createdAt: '2026-11-20T10:00:00Z',
    },
    {
      id: 'trk_kaafi_hai_na',
      title: 'Kaafi Hai Na (Musafir Cafe)',
      movie: 'Independent Album',
      artist: 'Jonita Gandhi, Priyansh Srivastav',
      category: 'Romantic',
      tag: 'Soulful Melody',
      source: '/audio/kaafi-hai-na.mp3',
      duration: 218,
      fileSize: '5.4 MB',
      isActive: true,
      createdAt: '2026-11-18T14:20:00Z',
    },
    {
      id: 'trk_mangal_rang',
      title: 'Mangal Rang (Shehnai & Sitar)',
      movie: 'Heritage Weddings',
      artist: 'Ustad Bismillah Ensemble',
      category: 'Wedding',
      tag: 'Traditional Muhurtham',
      source: '/audio/mangal-rang.mp3',
      duration: 222,
      fileSize: '6.1 MB',
      isActive: true,
      createdAt: '2026-11-15T09:10:00Z',
    },
    {
      id: 'trk_dilbaro',
      title: 'Dilbaro (Bridal Entry)',
      movie: 'Raazi',
      artist: 'Harshdeep Kaur, Vibha Saraf',
      category: 'Wedding',
      tag: 'Emotional Vidaai & Entry',
      source: '/audio/dilbaro.mp3',
      duration: 314,
      fileSize: '8.2 MB',
      isActive: true,
      createdAt: '2026-11-12T16:45:00Z',
    },
    {
      id: 'trk_kudmayi',
      title: 'Kudmayi (Film Version)',
      movie: 'Rocky Aur Rani Kii Prem Kahaani',
      artist: 'Shahid Mallya / Pritam',
      category: 'Wedding',
      tag: 'Royal Wedding Celebration',
      source: '/audio/kudmayi.mp3',
      duration: 265,
      fileSize: '7.1 MB',
      isActive: true,
      createdAt: '2026-11-10T12:00:00Z',
    },
    {
      id: 'trk_perfect',
      title: 'Perfect (Instrumental Acoustic)',
      movie: 'Valentine Acoustic Covers',
      artist: 'The Piano Guys / Ed Sheeran',
      category: 'Proposal',
      tag: 'Intimate Proposal Vow',
      source: '/audio/perfect-acoustic.mp3',
      duration: 260,
      fileSize: '6.5 MB',
      isActive: true,
      createdAt: '2026-11-05T08:30:00Z',
    },
  ];

  if (!tracks || tracks.length === 0) {
    tracks = defaultTracks as any;
  } else {
    // Ensure Kesariya is at the top if not present
    const hasKesariya = tracks.some(t => t.id === 'trk_kesariya_flute' || t.title.includes('Kesariya'));
    if (!hasKesariya) {
      tracks = [defaultTracks[0] as any, ...tracks];
    }
  }

  return NextResponse.json({
    success: true,
    data: tracks,
    total: 128,
    stats: {
      totalTracks: 128,
      activeTracks: 124,
      inactiveTracks: 4,
      categories: 7,
      totalSize: '1.8 GB',
    },
    meta: {
      page: 1,
      limit: 10,
      total: 128,
      totalPages: 13,
    },
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
      resourceType: 'MUSIC_TRACK',
      resourceId: track.id,
      metadata: { title: track.title, category: track.category },
    });

    return NextResponse.json({ success: true, data: track });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SAVE_FAILED', message: err.message || 'Failed to save track.' } },
      { status: 500 }
    );
  }
}
