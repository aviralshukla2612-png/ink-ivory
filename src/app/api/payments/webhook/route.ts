import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getPaymentProvider, PaymentDeduplicationService } from "@/lib/payments/provider-adapter";
import { PublicationActivationService } from "@/lib/payments/publication-service";
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

    const provider = getPaymentProvider("razorpay");

    // 2. Parse & Cryptographically Validate Event
    let event;
    try {
      event = await provider.parseWebhookEvent(rawBody, signature);
    } catch (sigErr: any) {
      logSecurityEvent({
        event: "WEBHOOK_INVALID_SIGNATURE",
        level: "CRITICAL",
        details: { signatureProvided: "[REDACTED]" },
      });
      return NextResponse.json({ success: false, error: "Invalid webhook signature" }, { status: 400 });
    }

    // 3. Persistent Deduplication Check: Ignore already handled webhook events (survives restarts)
    if (PaymentDeduplicationService.isEventProcessed(event.eventId)) {
      logSecurityEvent({
        event: "WEBHOOK_DUPLICATE_EVENT_DROPPED",
        level: "INFO",
        details: { eventId: event.eventId, eventType: event.eventType },
      });
      return NextResponse.json({ status: "ok", duplicate: true, message: "Duplicate webhook event acknowledged." });
    }

    // 4. Concurrency Guard on Order
    if (event.orderId && event.isHandled) {
      await PaymentDeduplicationService.withOrderLock(event.orderId, async () => {
        const order = await store.getPaymentOrder(event.orderId!);

        if (event.status === "CAPTURED") {
          if (order && order.status !== "PAID") {
            // 4.1 Record Captured Payment
            await store.recordPayment({
              paymentId: event.paymentId || `pay_${Date.now()}`,
              orderId: event.orderId!,
              amount: event.amountPaise || order.amount,
              currency: event.currency || order.currency,
              status: "CAPTURED",
              method: event.rawEntity?.payload?.payment?.entity?.method,
              rawResponse: event.rawEntity,
            });

            // 4.2 Shared Publication Activation Service
            try {
              await PublicationActivationService.activate({
                orderId: event.orderId!,
                paymentId: event.paymentId,
                actor: "WEBHOOK",
              });
            } catch (pubErr: any) {
              console.warn(`[Webhook] Publication activation notice for order ${event.orderId}:`, pubErr.message);
              // Safe recovery worker will pick this up automatically
            }
          }
        } else if (event.status === "FAILED") {
          if (order && order.status !== "PAID") {
            await store.recordPayment({
              paymentId: event.paymentId || `pay_fail_${Date.now()}`,
              orderId: event.orderId!,
              amount: event.amountPaise || order.amount,
              currency: event.currency || order.currency,
              status: "FAILED",
              rawResponse: event.rawEntity,
            });
          }
        }
      });
    }

    // 5. Mark Event ID As Processed (Persisted in store)
    await PaymentDeduplicationService.markEventProcessed(event);

    // 6. Security Audit Log
    await store.logAudit({
      action: `WEBHOOK_${event.eventType.toUpperCase()}`,
      entityType: "WebhookEvent",
      entityId: event.eventId,
      metadata: { eventType: event.eventType, orderId: event.orderId, status: event.status },
    });

    return NextResponse.json({ status: "ok", eventId: event.eventId });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
