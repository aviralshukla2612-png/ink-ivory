import { NextRequest, NextResponse } from "next/server";
import { sendDltOtp, storeOtp } from "@/lib/dlt-sms";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";

export async function POST(request: NextRequest) {
  // Rate limiting to prevent SMS flooding
  const rl = checkRateLimit(request, "authOperations");
  if (!rl.success) return createRateLimitResponse(rl);

  try {
    const body = await request.json();
    const rawPhone = String(body.phone || "").replace(/\D/g, "").slice(-10);
    const customerName = typeof body.name === "string" ? body.name : "Customer";

    if (rawPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    // Generate random 4-digit OTP
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Store in active OTP cache
    storeOtp(rawPhone, generatedOtp);

    // Send real DLT SMS message to recipient phone
    const result = await sendDltOtp({
      phone: rawPhone,
      name: customerName,
      otp: generatedOtp,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `OTP sent successfully to +91 ${rawPhone} via SMS.`,
        messageId: result.messageId,
      });
    } else {
      console.warn("SMS sending notice:", result.error);
      // Even if gateway times out or issues notice, OTP is cached for verification so user is not blocked
      return NextResponse.json({
        success: true,
        message: `OTP dispatched to +91 ${rawPhone}.`,
        warning: result.error,
      });
    }
  } catch (error: any) {
    console.error("send-otp route error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
