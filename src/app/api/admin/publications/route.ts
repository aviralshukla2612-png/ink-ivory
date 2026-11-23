import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission } from "@/lib/security/rbac";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";

export async function GET(request: NextRequest) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "PUBLICATIONS_VIEW");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: auth.error } },
      { status: auth.status }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;

  const result = await store.listAllPublications({ page, limit, search, status });
  const allTemplates = await store.getAllTemplates();
  const templateMap = new Map(allTemplates.map((t) => [t.id, t]));
  const allUsers = await store.getAllUsers();
  const userMap = new Map(allUsers.map((u) => [u.id, u]));

  const items = result.items.map((p) => {
    const tpl = templateMap.get(p.templateId);
    const u = p.userId ? userMap.get(p.userId) : null;
    const phone = u?.phone || '—';
    const occasion = (tpl?.occasion || 'Wedding').toUpperCase();

    return {
      ...p,
      customerPhone: phone,
      thumbnail: tpl?.previewImage || '/images/templates/udaipur-royal-palace-card.jpg',
      occasionBadge: occasion.includes('WEDDING') ? '👑 WEDDING' : '💍 CELEBRATION',
    };
  });

  // Calculate live stats
  const activeCount = result.items.filter((p) => p.status === 'ACTIVE').length;
  const totalViews = result.items.reduce((acc, p) => acc + (p.viewCount || 0), 0);

  return NextResponse.json({
    success: true,
    data: items,
    stats: {
      activeInvitations: activeCount,
      totalPublications: result.total,
      guestViews: totalViews,
      totalVisits: totalViews,
      lastPublished: result.items[0]?.updatedAt ? new Date(result.items[0].updatedAt).toLocaleDateString('en-GB') : '—',
    },
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
}
