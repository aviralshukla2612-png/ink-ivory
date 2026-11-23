import { NextRequest, NextResponse } from "next/server";
import { getAdminActor, ROLE_PERMISSIONS } from "@/lib/security/rbac";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";

export async function GET(request: NextRequest) {
  const rl = checkRateLimit(request, "adminMe");
  if (!rl.success) return createRateLimitResponse(rl);

  const actor = getAdminActor(request);

  if (!actor) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: No active administrative session." },
      { status: 401 }
    );
  }

  const permissions = ROLE_PERMISSIONS[actor.role] || [];

  return NextResponse.json({
    success: true,
    actor,
    permissions,
  });
}
