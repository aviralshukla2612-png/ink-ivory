import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { verifyAdminAccess, verifyCsrfOrigin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { logAdminAudit } from "@/lib/security/audit";
import { getAdminActor } from "@/lib/security/rbac";

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  if (!verifyAdminAccess(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Valid administrative session required." },
      { status: 401 }
    );
  }

  if (!verifyCsrfOrigin(request)) {
    return NextResponse.json(
      { success: false, error: "Cross-site request blocked (CSRF protection)." },
      { status: 403 }
    );
  }

  try {
    const actor = getAdminActor(request);
    const result = await store.clearAllDummyData();

    if (actor) {
      await logAdminAudit({
        actor,
        action: "PURGE_DUMMY_DATA",
        resourceType: "STORE",
        resourceId: "all_dummy_data",
        metadata: { clearedCounts: result.clearedCounts },
        request,
      });
    }

    return NextResponse.json({
      success: true,
      message: "All dummy data successfully cleared.",
      cleared: result.clearedCounts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to purge dummy data." },
      { status: 500 }
    );
  }
}
