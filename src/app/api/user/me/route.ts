import { NextRequest, NextResponse } from "next/server";
import { getOrCreateGuestToken, setGuestTokenCookie } from "@/lib/auth";
import { store } from "@/lib/store";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const rl = checkRateLimit(request, "publicApi");
  if (!rl.success) return createRateLimitResponse(rl);

  try {
    const { guestToken } = getOrCreateGuestToken(request);

    // Find customer profile in store directory
    const profile = await store.getCustomerDetails(guestToken);

    const userProfile = {
      id: profile?.id || guestToken,
      name: profile?.name || "Srajan Shukla",
      phone: profile?.phone || "+91 98765 43210",
      email: profile?.email || "customer@youaremine.online",
      avatarUrl: profile?.profileImageUrl || null,
      type: profile?.type || "REGISTERED",
      createdAt: profile?.firstSeenAt || new Date().toISOString(),
    };

    const response = NextResponse.json({
      success: true,
      user: userProfile,
    });

    setGuestTokenCookie(response, guestToken);
    return response;
  } catch (error: any) {
    console.error("GET /api/user/me error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve user profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { guestToken } = getOrCreateGuestToken(request);
    const body = await request.json();

    const updated = await store.updateCustomer(guestToken, {
      phone: body.phone,
      email: body.email,
      platform: "ANDROID APP",
      profileImageUrl: body.avatarUrl || body.profileImageUrl,
    });

    return NextResponse.json({
      success: true,
      user: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
