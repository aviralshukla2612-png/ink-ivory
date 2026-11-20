import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { verifyCsrfOrigin } from "@/lib/auth";
import { logAdminAudit } from "@/lib/security/audit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "PUBLICATIONS_MANAGE");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: auth.error } },
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
  const body = await request.json().catch(() => ({}));
  const reason = body.reason?.trim() || "Suspended by administrative policy review";

  try {
    const suspended = await store.suspendPublication(id, reason);

    const actor = auth.actor || getAdminActor(request)!;
    await logAdminAudit({
      actor,
      action: "PUBLICATION_SUSPENDED",
      resourceType: "PUBLICATION",
      resourceId: id,
      metadata: { reason },
      request,
    });

    return NextResponse.json({
      success: true,
      message: `Publication "${id}" suspended successfully.`,
      data: suspended,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "SUSPEND_FAILED", message: err.message || "Failed to suspend publication." } },
      { status: 400 }
    );
  }
}
