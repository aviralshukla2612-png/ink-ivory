import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { verifyCsrfOrigin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { logAdminAudit } from "@/lib/security/audit";
import { UpdateCouponSchema } from "@/lib/security/validators";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "COUPONS_MANAGE");
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
    const parsed = UpdateCouponSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_FAILED", message: parsed.error.issues[0]?.message } },
        { status: 400 }
      );
    }

    const updated = await store.updateCoupon(id, parsed.data);
    const actor = auth.actor || getAdminActor(request)!;

    await logAdminAudit({
      actor,
      action: "COUPON_UPDATED",
      resourceType: "COUPON",
      resourceId: updated.id,
      metadata: { code: updated.code, updates: parsed.data },
      request,
    });

    return NextResponse.json({
      success: true,
      message: `Coupon ${updated.code} updated successfully.`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_FAILED", message: error.message || "Failed to update coupon." } },
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

  const auth = requirePermission(request, "COUPONS_MANAGE");
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
    const deleted = await store.deleteCoupon(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: `Coupon "${id}" not found.` } },
        { status: 404 }
      );
    }

    const actor = auth.actor || getAdminActor(request)!;
    await logAdminAudit({
      actor,
      action: "COUPON_DELETED",
      resourceType: "COUPON",
      resourceId: id,
      request,
    });

    return NextResponse.json({
      success: true,
      message: `Coupon ${id} deleted successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "DELETE_FAILED", message: error.message || "Failed to delete coupon." } },
      { status: 400 }
    );
  }
}
