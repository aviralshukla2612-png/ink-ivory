import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { verifyCsrfOrigin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { logAdminAudit } from "@/lib/security/audit";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "MEDIA_MANAGE");
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

  const { id } = await params;
  await store.deleteMedia(id);

  const actor = auth.actor || getAdminActor(request)!;
  await logAdminAudit({
    actor,
    action: "MEDIA_DELETED",
    resourceType: "MEDIA",
    resourceId: id,
    request,
  });

  return NextResponse.json({
    success: true,
    message: `Media item ${id} deleted successfully.`,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "MEDIA_MANAGE");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: auth.error } },
      { status: auth.status }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { url, name } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Image URL is required." } },
        { status: 400 }
      );
    }

    // If this media belongs to a template, update template's previewImage
    if (id.startsWith("med_tpl_")) {
      const templateId = id.replace("med_tpl_", "");
      await store.updateTemplate(templateId, { previewImage: url });
    }

    const actor = auth.actor || getAdminActor(request)!;
    await logAdminAudit({
      actor,
      action: "MEDIA_UPDATED",
      resourceType: "MEDIA",
      resourceId: id,
      metadata: { newUrl: url, name },
      request,
    });

    return NextResponse.json({
      success: true,
      data: { id, url, name },
      message: "Media image updated successfully.",
    });
  } catch (err: any) {
    console.error("Error updating media image:", err);
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_FAILED", message: err.message || "Failed to update media image." } },
      { status: 500 }
    );
  }
}
