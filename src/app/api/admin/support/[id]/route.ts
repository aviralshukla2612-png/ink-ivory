import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { verifyCsrfOrigin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { logAdminAudit } from "@/lib/security/audit";
import { UpdateSupportTicketSchema } from "@/lib/security/validators";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "SUPPORT_MANAGE");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: auth.error } },
      { status: auth.status }
    );
  }

  const { id } = await params;
  const ticket = await store.getSupportTicket(id);
  if (!ticket) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: `Ticket "${id}" not found.` } },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: ticket,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = UpdateSupportTicketSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_FAILED", message: parsed.error.issues[0]?.message } },
        { status: 400 }
      );
    }

    const updated = await store.updateSupportTicket(id, parsed.data);
    const actor = auth.actor || getAdminActor(request)!;

    await logAdminAudit({
      actor,
      action: "SUPPORT_TICKET_UPDATED",
      resourceType: "SUPPORT_TICKET",
      resourceId: updated.id,
      metadata: { updates: parsed.data },
      request,
    });

    return NextResponse.json({
      success: true,
      message: `Ticket ${updated.ticketNumber} updated.`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_FAILED", message: error.message || "Failed to update ticket." } },
      { status: 400 }
    );
  }
}
