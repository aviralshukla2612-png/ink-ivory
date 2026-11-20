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

  try {
    const restored = await store.restorePublication(id);

    const actor = auth.actor || getAdminActor(request)!;
    await logAdminAudit({
      actor,
      action: "PUBLICATION_RESTORED",
      resourceType: "PUBLICATION",
      resourceId: id,
      request,
    });

    return NextResponse.json({
      success: true,
      message: `Publication "${id}" restored successfully.`,
      data: restored,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "RESTORE_FAILED", message: err.message || "Failed to restore publication." } },
      { status: 400 }
    );
  }
}
