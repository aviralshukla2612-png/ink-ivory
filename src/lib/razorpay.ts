import crypto from "crypto";
import { logSecurityEvent } from "./security/logger";

export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_live_U2OCXy6deORpA9";
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "d4wlTGIxFTK9ji36kPUhmD7";

/**
 * Creates a Razorpay order via official REST API, or mock test order if in local development.
 */
export async function createRazorpayOrder(params: {
  amount: number; // in paise
  currency: string;
  receipt: string;
  notes?: Record<string, any>;
}): Promise<{ id: string; amount: number; currency: string }> {
  const isPlaceholderKey =
    !process.env.RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY_ID.includes("test_inkivory") ||
    process.env.RAZORPAY_KEY_ID.includes("PLEASE_PASTE") ||
    process.env.RAZORPAY_KEY_ID.includes("placeholder");

  // If real live keys are provided and not default mock/placeholder
  if (
    process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_SECRET &&
    !isPlaceholderKey
  ) {
    const authHeader = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency || "INR",
        receipt: params.receipt,
        notes: params.notes,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Razorpay Order Creation Failed: ${err}`);
    }

    const data = await res.json();
    return { id: data.id, amount: data.amount, currency: data.currency };
  }

  // Safe developer sandbox order generator
  const mockOrderId = "order_" + crypto.randomBytes(8).toString("hex");
  return {
    id: mockOrderId,
    amount: params.amount,
    currency: params.currency || "INR",
  };
}

/**
 * Verifies Razorpay checkout signature using constant-time HMAC SHA256 comparison.
 */
export function verifyRazorpaySignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const isProduction = process.env.NODE_ENV === "production";
  const allowDevMock = process.env.ALLOW_DEV_PAYMENT_MOCK === "true";

  // STRICT RULE: Mock signatures are NEVER accepted in production
  if (params.signature.startsWith("dev_mock_signature_")) {
    if (isProduction || !allowDevMock) {
      logSecurityEvent({
        event: "DEV_SIGNATURE_BYPASS_ATTEMPT_REJECTED",
        level: "CRITICAL",
        details: { orderId: params.orderId, paymentId: params.paymentId },
      });
      return false;
    }
    // Only accepted in local dev with explicit mock flag
    return true;
  }

  const secret = process.env.RAZORPAY_KEY_SECRET || RAZORPAY_KEY_SECRET;
  const payload = `${params.orderId}|${params.paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  try {
    const a = Buffer.from(expectedSignature, "utf8");
    const b = Buffer.from(params.signature, "utf8");
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
      return true;
    }
  } catch (e) {
    return false;
  }

  return false;
}

/**
 * Verifies Razorpay webhook signature using constant-time HMAC SHA256 comparison.
 */
export function verifyWebhookSignature(body: string, signature: string, webhookSecret: string): boolean {
  if (!signature || !body) return false;

  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(signature, "utf8");
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
      return true;
    }
  } catch (e) {
    return false;
  }

  return false;
}
