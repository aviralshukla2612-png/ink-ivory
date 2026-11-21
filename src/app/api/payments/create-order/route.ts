import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getOrCreateGuestToken, verifyOwnership } from "@/lib/auth";
import { calculateQuote } from "@/lib/pricing";
import { createRazorpayOrder, RAZORPAY_KEY_ID } from "@/lib/razorpay";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { CreatePaymentOrderSchema } from "@/lib/security/validators";
import { logSecurityEvent } from "@/lib/security/logger";

export async function POST(request: NextRequest) {
  // 1. Rate Limiting Check
  const rl = checkRateLimit(request, "createOrder");
  if (!rl.success) return createRateLimitResponse(rl);

  try {
    const { guestToken } = getOrCreateGuestToken(request);
    const body = await request.json();

    // 2. Input Validation
    const parsed = CreatePaymentOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid order payload" },
        { status: 400 }
      );
    }

    const { draftId, couponCode } = parsed.data;

    // 3. Draft Retrieval & Ownership Check (IDOR Prevention)
    const draft = await store.getDraft(draftId);
    if (!draft) {
      return NextResponse.json({ success: false, error: "Draft not found" }, { status: 404 });
    }

    if (!verifyOwnership(draft, guestToken)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: You do not own this draft" },
        { status: 403 }
      );
    }

    if (draft.status === "PUBLISHED") {
      return NextResponse.json(
        { success: false, error: "This draft has already been published." },
        { status: 400 }
      );
    }

    // 4. Server-Side Price Calculation (Tamper-Proof)
    const quote = await calculateQuote(draft.templateId, couponCode);

    // 5. Create Order with Gateway
    const razorpayOrder = await createRazorpayOrder({
      amount: quote.finalAmountPaise,
      currency: quote.currency,
      receipt: `rcpt_${draft.id}_${Date.now()}`,
      notes: {
        draftId: draft.id,
        templateId: draft.templateId,
        couponCode: quote.couponCode || "NONE",
      },
    });

    // 6. Record Order in Store
    await store.createPaymentOrder({
      orderId: razorpayOrder.id,
      draftId: draft.id,
      guestToken,
      amount: quote.finalAmountPaise,
      currency: quote.currency,
      notes: {
        couponCode: quote.couponCode,
        discountPaise: quote.discountPaise,
      },
    });

    // 7. Update Draft Status
    await store.saveDraft({
      id: draft.id,
      guestToken: draft.guestToken,
      templateId: draft.templateId,
      fields: draft.fields,
      design: draft.design,
      status: "PAYMENT_PENDING",
    });

    logSecurityEvent({
      event: "PAYMENT_ORDER_CREATED",
      level: "INFO",
      guestToken,
      details: { orderId: razorpayOrder.id, amountPaise: quote.finalAmountPaise, draftId: draft.id },
    });

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: RAZORPAY_KEY_ID,
      draftId: draft.id,
      isLiveRazorpayOrder: razorpayOrder.isLiveRazorpayOrder,
      quote,
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
