import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { verifyCsrfOrigin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { logAdminAudit } from "@/lib/security/audit";
import { CreateCouponSchema } from "@/lib/security/validators";

export async function GET(request: NextRequest) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "COUPONS_MANAGE");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: auth.error } },
      { status: auth.status }
    );
  }

  const coupons = await store.listCoupons();

  return NextResponse.json({
    success: true,
    data: coupons,
  });
}

export async function POST(request: NextRequest) {
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

  try {
    const body = await request.json();
    const parsed = CreateCouponSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_FAILED", message: parsed.error.issues[0]?.message } },
        { status: 400 }
      );
    }

    const coupon = await store.createCoupon(parsed.data);
    const actor = auth.actor || getAdminActor(request)!;

    await logAdminAudit({
      actor,
      action: "COUPON_CREATED",
      resourceType: "COUPON",
      resourceId: coupon.id,
      metadata: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue },
      request,
    });

    return NextResponse.json({
      success: true,
      message: `Coupon ${coupon.code} created successfully.`,
      data: coupon,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "CREATION_FAILED", message: error.message || "Failed to create coupon." } },
      { status: 400 }
    );
  }
}
