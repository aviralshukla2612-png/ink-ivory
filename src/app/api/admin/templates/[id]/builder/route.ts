import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { verifyCsrfOrigin } from "@/lib/auth";
import { SaveTemplateBuilderSchema } from "@/lib/security/validators";
import { APPROVED_RENDERER_REGISTRY } from "@/lib/templates/renderer-registry";
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

  const sections = await store.getTemplateSections(template.id);
  const versions = await store.listTemplateVersions(template.id);
  const renderer = template.rendererId ? APPROVED_RENDERER_REGISTRY[template.rendererId] : null;

  return NextResponse.json({
    success: true,
    data: {
      template,
      sections,
      versions,
      renderer,
      currentVersion: versions[0]?.versionNumber || 1,
    },
  });
}

export async function PUT(
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
  const parsed = SaveTemplateBuilderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: parsed.error.issues[0]?.message || "Invalid builder payload",
          details: parsed.error.issues.map((i) => i.message),
        },
      },
      { status: 400 }
    );
  }

  const { sections, defaultFields, designConfig, changeSummary } = parsed.data;

  // 1. Update template properties
  const updates: Record<string, any> = {};
  if (defaultFields) updates.defaultFields = defaultFields;
  if (designConfig) updates.designConfig = designConfig;

  const updatedTemplate = await store.updateTemplate(template.id, updates);

  // 2. Save sections
  let updatedSections = await store.getTemplateSections(template.id);
  if (sections && Array.isArray(sections)) {
    updatedSections = await store.saveTemplateSections(template.id, sections as any);
  }

  // 3. Create version snapshot
  const actor = auth.actor || getAdminActor(request)!;
  const snapshotConfig = {
    title: updatedTemplate.title,
    designConfig: updatedTemplate.designConfig,
    defaultFields: updatedTemplate.defaultFields,
    sections: updatedSections,
  };

  const newVersion = await store.createTemplateVersion({
    templateId: template.id,
    changeSummary: changeSummary || "Builder configuration update",
    createdBy: actor.email || actor.userId,
    snapshotConfig,
  });

  // 4. Audit Log
  await logAdminAudit({
    actor,
    action: "TEMPLATE_BUILDER_UPDATED",
    resourceType: "TEMPLATE",
    resourceId: template.id,
    metadata: {
      versionNumber: newVersion.versionNumber,
      sectionsCount: updatedSections.length,
      changeSummary,
    },
    request,
  });

  return NextResponse.json({
    success: true,
    message: "Builder configuration and sections saved successfully.",
    data: {
      template: updatedTemplate,
      sections: updatedSections,
      version: newVersion,
    },
  });
}
