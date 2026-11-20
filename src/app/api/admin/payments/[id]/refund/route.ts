import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { verifyCsrfOrigin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { logAdminAudit } from "@/lib/security/audit";
import { RefundPaymentSchema } from "@/lib/security/validators";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "REFUNDS_MANAGE");
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
    const parsed = RefundPaymentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_FAILED", message: parsed.error.issues[0]?.message } },
        { status: 400 }
      );
    }

    const actor = auth.actor || getAdminActor(request)!;
    const { payment, order } = await store.refundPayment(id, parsed.data.reason, actor.userId);

    await logAdminAudit({
      actor,
      action: "PAYMENT_REFUNDED",
      resourceType: "PAYMENT",
      resourceId: payment.paymentId,
      metadata: {
        orderId: order.orderId,
        amount: payment.amount,
        reason: parsed.data.reason,
      },
      request,
    });

    return NextResponse.json({
      success: true,
      message: `Payment ${payment.paymentId} has been successfully refunded.`,
      data: { payment, order },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "REFUND_FAILED", message: error.message || "Failed to process refund." } },
      { status: 400 }
    );
  }
}
