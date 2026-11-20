import { NextRequest, NextResponse } from "next/server";
import { calculateQuote } from "@/lib/pricing";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { PriceQuoteSchema } from "@/lib/security/validators";

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request, "generalApi");
  if (!rl.success) return createRateLimitResponse(rl);

  try {
    const body = await request.json();
    const parsed = PriceQuoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid quote request" },
        { status: 400 }
      );
    }

    const { templateId, couponCode } = parsed.data;
    const quote = await calculateQuote(templateId, couponCode);
    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
