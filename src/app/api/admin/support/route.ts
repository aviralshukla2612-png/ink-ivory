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
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;
  const priority = searchParams.get("priority") || undefined;

  const result = await store.listSupportTickets({ page, limit, search, status, priority });

  return NextResponse.json({
    success: true,
    data: result.items,
    meta: {
      page: result.page,
      limit: result.limit,
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
    const parsed = CreateSupportTicketSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_FAILED", message: parsed.error.issues[0]?.message } },
        { status: 400 }
      );
    }

    const ticket = await store.createSupportTicket(parsed.data);
    const actor = auth.actor || getAdminActor(request)!;

    await logAdminAudit({
      actor,
      action: "SUPPORT_TICKET_CREATED",
      resourceType: "SUPPORT_TICKET",
      resourceId: ticket.id,
      metadata: { ticketNumber: ticket.ticketNumber, email: ticket.customerEmail },
      request,
    });

    return NextResponse.json({
      success: true,
      message: `Ticket ${ticket.ticketNumber} created successfully.`,
      data: ticket,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "CREATION_FAILED", message: error.message || "Failed to create support ticket." } },
      { status: 400 }
    );
  }
}
