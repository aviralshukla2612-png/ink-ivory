import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { verifyCsrfOrigin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { logAdminAudit } from "@/lib/security/audit";
import { AddSupportReplySchema } from "@/lib/security/validators";

export async function POST(
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
    const parsed = AddSupportReplySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_FAILED", message: parsed.error.issues[0]?.message } },
        { status: 400 }
      );
    }

    const actor = auth.actor || getAdminActor(request)!;
    const updated = await store.addSupportReply(id, {
      message: parsed.data.message,
      sender: "STAFF",
      senderName: actor.email ? actor.email.split("@")[0] : "Staff Concierge",
    });

    await logAdminAudit({
      actor,
      action: "SUPPORT_REPLY_SENT",
      resourceType: "SUPPORT_TICKET",
      resourceId: updated.id,
      metadata: { ticketNumber: updated.ticketNumber },
      request,
    });

    return NextResponse.json({
      success: true,
      message: "Reply sent to customer.",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "REPLY_FAILED", message: error.message || "Failed to post reply." } },
      { status: 400 }
    );
  }
}
