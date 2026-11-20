import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { logAdminAudit } from "@/lib/security/audit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "TEMPLATES_PUBLISH");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: auth.error } },
      { status: auth.status }
    );
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const isActive = typeof body.isActive === "boolean" ? body.isActive : true;

  try {
    const updated = await store.setTemplateActiveStatus(id, isActive);

    const actor = auth.actor || getAdminActor(request)!;
    await logAdminAudit({
      actor,
      action: isActive ? "TEMPLATE_ACTIVATED" : "TEMPLATE_DEACTIVATED",
      resourceType: "TEMPLATE",
      resourceId: updated.id,
      metadata: { isActive, status: updated.status },
      request,
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "STATUS_TOGGLE_FAILED", message: err.message || "Failed to update status." } },
      { status: 400 }
    );
  }
}
