import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { verifyWebhookSignature, RAZORPAY_KEY_SECRET } from "@/lib/razorpay";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { logSecurityEvent } from "@/lib/security/logger";

export async function POST(request: NextRequest) {
  // 1. Rate Limiting Check
  const rl = checkRateLimit(request, "paymentWebhook");
  if (!rl.success) return createRateLimitResponse(rl);

  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      logSecurityEvent({
        event: "WEBHOOK_MISSING_SIGNATURE",
        level: "WARN",
      });
      return NextResponse.json({ success: false, error: "Missing webhook signature" }, { status: 400 });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || RAZORPAY_KEY_SECRET;
    const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);

    if (!isValid) {
      logSecurityEvent({
        event: "WEBHOOK_INVALID_SIGNATURE",
        level: "CRITICAL",
        details: { signatureProvided: "[REDACTED]" },
      });
      return NextResponse.json({ success: false, error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventId = event.event_id || `evt_${Date.now()}`;
    const eventType = event.event;

    // Idempotent webhook processing
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      if (orderId && paymentId) {
        const order = await store.getPaymentOrder(orderId);
        if (order && order.status !== "PAID") {
          await store.recordPayment({
            paymentId,
            orderId,
            amount: paymentEntity.amount,
            currency: paymentEntity.currency,
            status: "CAPTURED",
            method: paymentEntity.method,
            rawResponse: event,
          });

          // Check if draft needs publishing
          const draft = await store.getDraft(order.draftId);
          if (draft && draft.status !== "PUBLISHED") {
            await store.publishDraft({
              draftId: draft.id,
              paymentId,
            });
          }
        }
      }
    }

    await store.logAudit({
      action: `WEBHOOK_${eventType.toUpperCase()}`,
      entityType: "WebhookEvent",
      entityId: eventId,
      metadata: { eventType },
    });

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
