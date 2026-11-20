import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { verifyCsrfOrigin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { logAdminAudit } from "@/lib/security/audit";
import { UpdateStaffSchema } from "@/lib/security/validators";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "STAFF_MANAGE");
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
    const parsed = UpdateStaffSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_FAILED", message: parsed.error.issues[0]?.message } },
        { status: 400 }
      );
    }

    const updated = await store.updateStaff(id, parsed.data);
    const actor = auth.actor || getAdminActor(request)!;

    await logAdminAudit({
      actor,
      action: "STAFF_UPDATED",
      resourceType: "STAFF",
      resourceId: updated.id,
      metadata: { updates: parsed.data },
      request,
    });

    return NextResponse.json({
      success: true,
      message: `Staff member ${updated.name} updated.`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_FAILED", message: error.message || "Failed to update staff member." } },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "STAFF_MANAGE");
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
    const deleted = await store.deleteStaff(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: `Staff member "${id}" not found.` } },
        { status: 404 }
      );
    }

    const actor = auth.actor || getAdminActor(request)!;
    await logAdminAudit({
      actor,
      action: "STAFF_DELETED",
      resourceType: "STAFF",
      resourceId: id,
      request,
    });

    return NextResponse.json({
      success: true,
      message: `Staff member ${id} removed.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "DELETE_FAILED", message: error.message || "Failed to delete staff member." } },
      { status: 400 }
    );
  }
}
