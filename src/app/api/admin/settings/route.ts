import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { verifyCsrfOrigin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { logAdminAudit } from "@/lib/security/audit";
import { UpdateSettingsSchema } from "@/lib/security/validators";

export async function GET(request: NextRequest) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "SETTINGS_MANAGE");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: auth.error } },
      { status: auth.status }
    );
  }

  const settings = await store.getPlatformSettings();

  return NextResponse.json({
    success: true,
    data: settings,
  });
}

export async function PUT(request: NextRequest) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "SETTINGS_MANAGE");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: auth.error } },
      { status: auth.status }
    );
  }

  if (!verifyCsrfOrigin(request)) {
    return NextResponse.json(
      { success: false, error: { code: "CSRF_ERROR", message: "Cross-origin request rejected." } },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const parsed = UpdateSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_FAILED", message: parsed.error.issues[0]?.message } },
        { status: 400 }
      );
    }

    const updated = await store.updatePlatformSettings(parsed.data);
    const actor = auth.actor || getAdminActor(request)!;

    await logAdminAudit({
      actor,
      action: "PLATFORM_SETTINGS_UPDATED",
      resourceType: "SETTINGS",
      resourceId: updated.id,
      metadata: { updates: parsed.data },
      request,
    });

    return NextResponse.json({
      success: true,
      message: "Platform settings updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_FAILED", message: error.message || "Failed to update platform settings." } },
      { status: 400 }
    );
  }
}
