import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { verifyCsrfOrigin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { logAdminAudit } from "@/lib/security/audit";
import { CreateSupportTicketSchema } from "@/lib/security/validators";

export async function GET(request: NextRequest) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "SUPPORT_MANAGE");
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
  const priority = searchParams.get("priority") || undefined;

  const result = await store.listSupportTickets({ page, limit, search, status, priority });
  const items = result.items || [];

  const resolvedCount = items.filter((t: any) => t.status === 'RESOLVED').length;
  const inProgressCount = items.filter((t: any) => t.status === 'IN_PROGRESS').length;
  const pendingCount = items.filter((t: any) => t.status === 'OPEN').length;
  const escalatedCount = items.filter((t: any) => t.status === 'ESCALATED').length;

  return NextResponse.json({
    success: true,
    data: items,
    stats: {
      totalInquiries: result.total,
      resolved: resolvedCount,
      inProgress: inProgressCount,
      pending: pendingCount,
      escalated: escalatedCount,
    },
    meta: {
      page,
      limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
}

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "SUPPORT_MANAGE");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: auth.error } },
      { status: auth.status }
    );
  }

  if (!verifyCsrfOrigin(request)) {
    return NextResponse.json(
      { success: false, error: { code: "CSRF_ERROR", message: "Cross-origin request rejected." } },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const ticket = await store.createSupportTicket(body);
    return NextResponse.json({ success: true, data: ticket });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "CREATE_FAILED", message: err.message || "Failed to create ticket." } },
      { status: 500 }
    );
  }
}
