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

  const coupons = (await store.listCoupons()) || [];

  const activeCount = coupons.filter((c: any) => c.isActive).length;
  const inactiveCount = coupons.filter((c: any) => !c.isActive).length;
  const totalUses = coupons.reduce((sum: number, c: any) => sum + (c.usageCount || 0), 0);

  return NextResponse.json({
    success: true,
    data: coupons,
    stats: {
      totalCoupons: coupons.length,
      activeCoupons: activeCount,
      inactiveCoupons: inactiveCount,
      totalUses: totalUses.toLocaleString('en-IN'),
      totalDiscountGiven: '₹0',
    },
    meta: {
      page: 1,
      limit: 10,
      total: coupons.length,
      totalPages: Math.max(1, Math.ceil(coupons.length / 10)),
    },
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
      action: "COUPON_CREATE",
      resourceType: "COUPON",
      resourceId: coupon.id,
      metadata: { code: coupon.code, discountValue: coupon.discountValue, type: coupon.discountType },
    });

    return NextResponse.json({ success: true, data: coupon });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "CREATE_FAILED", message: err.message || "Failed to create coupon." } },
      { status: 500 }
    );
  }
}
