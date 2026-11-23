import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission } from "@/lib/security/rbac";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";

export async function GET(request: NextRequest) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "DRAFTS_VIEW");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: auth.error } },
      { status: auth.status }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const search = searchParams.get("search") || "";
  const templateId = searchParams.get("templateId") || "";
  const status = searchParams.get("status") || "";

  const allDrafts = await store.listAllDrafts();
  const allTemplates = await store.getAllTemplates();
  const templateMap = new Map(allTemplates.map((t) => [t.id, t]));
  const allUsers = await store.getAllUsers();
  const userMap = new Map(allUsers.map((u) => [u.id, u]));

  let filtered = allDrafts;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.title?.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.guestToken?.toLowerCase().includes(q) ||
        d.userId?.toLowerCase().includes(q) ||
        (d.fields?.names && String(d.fields.names).toLowerCase().includes(q))
    );
  }

  if (templateId && templateId !== "All") {
    filtered = filtered.filter((d) => d.templateId === templateId);
  }

  if (status && status !== "All") {
    filtered = filtered.filter((d) => d.status === status);
  }

  // Sort by updatedAt desc
  filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  // Compute overall stats
  const totalDrafts = allDrafts.length;
  const inProgress = allDrafts.filter(d => d.status !== 'PUBLISHED' && d.status !== 'ARCHIVED').length;
  const published = allDrafts.filter(d => d.status === 'PUBLISHED').length;
  const inactive = allDrafts.filter(d => d.status === 'ARCHIVED').length;

  const items = paginated.map((d) => {
    const tpl = templateMap.get(d.templateId);
    const u = d.userId ? userMap.get(d.userId) : null;
    const phone = u?.phone || (d.fields?.phone ? String(d.fields.phone) : '—');
    const platform = u?.platform || 'Website';
    const occasion = (tpl?.occasion || (d.fields?.category ? String(d.fields.category).toUpperCase() : 'WEDDING')).toUpperCase();

    return {
      ...d,
      templateTitle: tpl?.title || d.templateId,
      templateCategory: occasion,
      thumbnail: tpl?.previewImage || '/images/templates/udaipur-royal-palace-card.jpg',
      customerPhone: phone,
      customerPlatform: platform,
      previewUrl: `/customize/${d.templateId}?draftId=${d.id}`,
    };
  });

  return NextResponse.json({
    success: true,
    data: items,
    stats: {
      totalDrafts,
      inProgress,
      published,
      inactive,
    },
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}
