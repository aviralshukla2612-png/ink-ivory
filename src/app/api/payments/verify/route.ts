import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getOrCreateGuestToken, verifyOwnership } from "@/lib/auth";
import { getPaymentProvider, PaymentProviderId, PaymentDeduplicationService } from "@/lib/payments/provider-adapter";
import { PublicationActivationService } from "@/lib/payments/publication-service";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { VerifyPaymentSchema } from "@/lib/security/validators";
import { logSecurityEvent } from "@/lib/security/logger";

export async function POST(request: NextRequest) {
  // 1. Rate Limiting Check
  const rl = checkRateLimit(request, "verifyPayment");
  if (!rl.success) return createRateLimitResponse(rl);

  try {
    const { guestToken } = getOrCreateGuestToken(request);
    const body = await request.json();

    const normalizedBody = {
      orderId: body.orderId || body.razorpay_order_id,
      paymentId: body.paymentId || body.razorpay_payment_id || body.razorpayPaymentId,
      signature: body.signature || body.razorpay_signature || body.razorpaySignature,
      draftId: body.draftId,
      requestedSlug: body.requestedSlug,
    };

    // 2. Schema Validation
    const parsed = VerifyPaymentSchema.safeParse(normalizedBody);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid payment payload" },
        { status: 400 }
      );
    }

    const { orderId, paymentId, signature, draftId, requestedSlug } = parsed.data;
    const providerId: PaymentProviderId = (body.provider as PaymentProviderId) || "razorpay";

    // 3. Concurrency Lock: Prevent simultaneous verification & webhook race condition
    return await PaymentDeduplicationService.withOrderLock(orderId, async () => {
      // 4. Fetch Order & Prevent Replay
      const order = await store.getPaymentOrder(orderId);
      if (!order) {
        return NextResponse.json({ success: false, error: "Payment order not found" }, { status: 404 });
      }

      if (order.draftId !== draftId) {
        logSecurityEvent({
          event: "PAYMENT_DRAFT_MISMATCH_ATTEMPT",
          level: "CRITICAL",
          guestToken,
          details: { orderDraftId: order.draftId, suppliedDraftId: draftId },
        });
        return NextResponse.json(
          { success: false, error: "Security violation: Order does not match draft." },
          { status: 403 }
        );
      }

      // 5. Ownership Verification
      const draft = await store.getDraft(draftId);
      if (!draft) {
        return NextResponse.json({ success: false, error: "Draft not found" }, { status: 404 });
      }

      if (!verifyOwnership(draft, guestToken)) {
        logSecurityEvent({
          event: "UNAUTHORIZED_PAYMENT_VERIFICATION_ATTEMPT",
          level: "CRITICAL",
          guestToken,
          details: { draftId: draft.id, orderId },
        });
        return NextResponse.json(
          { success: false, error: "Unauthorized: You do not own this draft." },
          { status: 403 }
        );
      }

      // 6. Cryptographic Provider Verification
      const provider = getPaymentProvider(providerId);
      const verification = await provider.verifyPayment({
        orderId,
        paymentId,
        signature,
        expectedAmountPaise: order.amount,
        expectedCurrency: order.currency,
        rawPayload: body,
      });

      if (!verification.success || !verification.signatureValid) {
        logSecurityEvent({
          event: "PAYMENT_SIGNATURE_VERIFICATION_FAILED",
          level: "CRITICAL",
          guestToken,
          details: { orderId, paymentId, provider: provider.id },
        });
        return NextResponse.json(
          { success: false, error: verification.error || "Invalid payment signature. Verification rejected." },
          { status: 400 }
        );
      }

      // 7. Record Payment as CAPTURED
      await store.recordPayment({
        paymentId,
        orderId,
        amount: order.amount,
        currency: order.currency,
        status: "CAPTURED",
        signature,
      });

      // 8. Shared Publication Activation Service
      const host = request.headers.get("host") || "localhost:3000";
      const protocol = host.includes("localhost") ? "http" : "https";
      const baseUrl = `${protocol}://${host}`;

      const activation = await PublicationActivationService.activate({
        orderId,
        paymentId,
        requestedSlug,
        actor: "CLIENT_VERIFY",
        baseUrl,
      });

      return NextResponse.json({
        success: true,
        message: activation.isIdempotent
          ? "Payment already verified. Returning existing publication."
          : "Payment verified and invitation published!",
        slug: activation.slug,
        invitationUrl: activation.invitationUrl,
        publicationId: activation.publication.id,
        draftId: draft.id,
        isIdempotent: activation.isIdempotent,
      });
    });
  } catch (error: any) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
  }
}
