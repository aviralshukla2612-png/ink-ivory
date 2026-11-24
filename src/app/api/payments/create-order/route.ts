import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getOrCreateGuestToken, verifyOwnership } from "@/lib/auth";
import { calculateQuote } from "@/lib/pricing";
import { getPaymentProvider, PaymentProviderId } from "@/lib/payments/provider-adapter";
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
    const providerId: PaymentProviderId = (body.provider as PaymentProviderId) || "razorpay";

    // 3. Draft Retrieval & Ownership Check (IDOR Prevention)
    const draft = await store.getDraft(draftId);
    if (!draft) {
      return NextResponse.json({ success: false, error: "Draft not found" }, { status: 404 });
    }

    if (!verifyOwnership(draft, guestToken)) {
      logSecurityEvent({
        event: "UNAUTHORIZED_DRAFT_ORDER_CREATION_ATTEMPT",
        level: "CRITICAL",
        guestToken,
        details: { draftId, draftOwnerToken: draft.guestToken },
      });
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
    // NEVER trust a client-supplied amount. Authoritative amount is calculated here.
    const quote = await calculateQuote(draft.templateId, couponCode);
    const authoritativePaise = quote.finalAmountPaise;

    // Detect and log if client attempted price tampering
    if (parsed.data.amount !== undefined) {
      const clientSentPaise = Math.round(parsed.data.amount * 100);
      if (clientSentPaise !== authoritativePaise && parsed.data.amount !== authoritativePaise) {
        logSecurityEvent({
          event: "PAYMENT_PRICE_MANIPULATION_ATTEMPT_OVERRIDDEN",
          level: "WARN",
          guestToken,
          details: {
            draftId: draft.id,
            clientSentAmount: parsed.data.amount,
            authoritativePaise,
          },
        });
      }
    }

    // 5. Create Order via Payment Provider Abstraction
    const provider = getPaymentProvider(providerId);
    const createdOrder = await provider.createOrder({
      draftId: draft.id,
      templateId: draft.templateId,
      amountPaise: authoritativePaise,
      currency: quote.currency,
      receipt: `rcpt_${draft.id}_${Date.now()}`,
      customerPhone: parsed.data.customerPhone,
      customerName: parsed.data.customerName || draft.fields?.names,
      notes: {
        draftId: draft.id,
        templateId: draft.templateId,
        couponCode: quote.couponCode || "NONE",
        discountPaise: quote.discountPaise,
        baseAmountPaise: quote.baseAmountPaise,
        finalAmountPaise: authoritativePaise,
        provider: provider.id,
      },
    });

    // 6. Record Order in Store with complete price & template snapshot
    await store.createPaymentOrder({
      orderId: createdOrder.providerOrderId,
      draftId: draft.id,
      guestToken,
      amount: authoritativePaise,
      currency: quote.currency,
      customerPhone: parsed.data.customerPhone,
      customerName: parsed.data.customerName || draft.fields?.names,
      notes: {
        customerPhone: parsed.data.customerPhone,
        customerName: parsed.data.customerName || draft.fields?.names,
        couponCode: quote.couponCode,
        discountPaise: quote.discountPaise,
        baseAmountPaise: quote.baseAmountPaise,
        finalAmountPaise: authoritativePaise,
        provider: provider.id,
        templateTitle: quote.templateTitle,
        createdAt: new Date().toISOString(),
      },
    });

    // 7. Update Draft Status to PAYMENT_PENDING
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
      details: {
        orderId: createdOrder.providerOrderId,
        amountPaise: authoritativePaise,
        draftId: draft.id,
        provider: provider.id,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: createdOrder.providerOrderId,
      amount: createdOrder.amount,
      currency: createdOrder.currency,
      keyId: createdOrder.providerData?.keyId || process.env.RAZORPAY_KEY_ID || "rzp_live_U2OCXy6deORpA9",
      draftId: draft.id,
      isLiveRazorpayOrder: createdOrder.isLiveOrder,
      provider: provider.id,
      quote,
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
  }
}
