import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { verifyCsrfOrigin } from "@/lib/auth";
import { RestoreVersionSchema } from "@/lib/security/validators";
import { logAdminAudit } from "@/lib/security/audit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "TEMPLATES_VIEW");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: auth.error } },
      { status: auth.status }
    );
  }

  const { id } = await params;
  const template = await store.getTemplate(id);

  if (!template) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: `Template "${id}" not found.` } },
      { status: 404 }
    );
  }

  const versions = await store.listTemplateVersions(template.id);

  return NextResponse.json({
    success: true,
    data: versions,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "TEMPLATES_MANAGE");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: auth.error } },
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
  const template = await store.getTemplate(id);

  if (!template) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: `Template "${id}" not found.` } },
      { status: 404 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = RestoreVersionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: parsed.error.issues[0]?.message || "Invalid version restoration payload",
        },
      },
      { status: 400 }
    );
  }

  try {
    const { template: restoredTemplate, restoredVersion } = await store.restoreTemplateVersion(
      template.id,
      parsed.data.versionNumber
    );

    const actor = auth.actor || getAdminActor(request)!;
    await logAdminAudit({
      actor,
      action: "TEMPLATE_VERSION_RESTORED",
      resourceType: "TEMPLATE",
      resourceId: template.id,
      metadata: {
        restoredVersion: parsed.data.versionNumber,
        summary: restoredVersion.changeSummary,
      },
      request,
    });

    const sections = await store.getTemplateSections(template.id);

    return NextResponse.json({
      success: true,
      message: `Successfully rolled back to version ${parsed.data.versionNumber}.`,
      data: {
        template: restoredTemplate,
        restoredVersion,
        sections,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "RESTORE_FAILED", message: err.message || "Failed to restore version." } },
      { status: 400 }
    );
  }
}
