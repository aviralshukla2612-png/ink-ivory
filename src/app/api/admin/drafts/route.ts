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
  const templateMap = new Map(allTemplates.map((t) => [t.id, t.title]));

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

  const items = paginated.map((d) => ({
    ...d,
    templateTitle: templateMap.get(d.templateId) || d.templateId,
    previewUrl: `/customize/${d.templateId}?draftId=${d.id}`,
  }));

  return NextResponse.json({
    success: true,
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}
