import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getOrCreateGuestToken, verifyOwnership } from "@/lib/auth";
import { verifyRazorpaySignature } from "@/lib/razorpay";
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

    // 3. Cryptographic Signature Verification
    const isValidSignature = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature,
    });

    if (!isValidSignature) {
      logSecurityEvent({
        event: "PAYMENT_SIGNATURE_VERIFICATION_FAILED",
        level: "CRITICAL",
        guestToken,
        details: { orderId, paymentId },
      });
      return NextResponse.json(
        { success: false, error: "Invalid payment signature. Verification rejected." },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { success: false, error: "Unauthorized: You do not own this draft." },
        { status: 403 }
      );
    }

    // 5.1 Idempotency Guard: If order was already paid or draft published, return existing invitation idempotently
    if (order.status === "PAID" || draft.status === "PUBLISHED") {
      const allInvitations = (store as any).data?.invitations || [];
      const existingInvitation = allInvitations.find(
        (inv: any) => inv.draftId === draft.id && inv.isPublic
      );
      if (existingInvitation) {
        const host = request.headers.get("host") || "localhost:3000";
        const protocol = host.includes("localhost") ? "http" : "https";
        const invitationUrl = `${protocol}://${host}/invite/${existingInvitation.slug}`;

        logSecurityEvent({
          event: "PAYMENT_VERIFY_IDEMPOTENT_HIT",
          level: "INFO",
          guestToken,
          details: { orderId, draftId: draft.id, slug: existingInvitation.slug },
        });

        return NextResponse.json({
          success: true,
          message: "Payment already verified. Returning existing publication.",
          slug: existingInvitation.slug,
          invitationUrl,
          invitationId: existingInvitation.id,
          draftId: draft.id,
          isIdempotent: true,
        });
      }
    }

    // 6. Record Payment & Publish Draft
    await store.recordPayment({
      paymentId,
      orderId,
      amount: order.amount,
      currency: order.currency,
      status: "CAPTURED",
      signature,
    });

    const { invitation, slug } = await store.publishDraft({
      draftId: draft.id,
      paymentId,
      requestedSlug,
    });

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const invitationUrl = `${protocol}://${host}/invite/${slug}`;

    logSecurityEvent({
      event: "WEBSITE_PUBLISHED_SUCCESSFULLY",
      level: "INFO",
      guestToken,
      details: { slug, orderId, paymentId, draftId: draft.id },
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and invitation published!",
      slug,
      invitationUrl,
      invitationId: invitation.id,
      draftId: draft.id,
    });
  } catch (error: any) {
    console.error("Payment verify error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
