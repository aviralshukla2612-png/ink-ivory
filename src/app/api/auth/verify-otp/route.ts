import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/dlt-sms";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawPhone = String(body.phone || "").replace(/\D/g, "").slice(-10);
    const inputOtp = String(body.otp || "").trim();

    if (!rawPhone || rawPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    if (!inputOtp || inputOtp.length < 4) {
      return NextResponse.json(
        { success: false, error: "Please enter the complete OTP code." },
        { status: 400 }
      );
    }

    const verification = verifyOtp(rawPhone, inputOtp);
    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: verification.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mobile number verified successfully.",
    });
  } catch (error: any) {
    console.error("verify-otp route error:", error);
    return NextResponse.json(
      { success: false, error: "OTP verification failed. Please try again." },
      { status: 500 }
    );
  }
}
