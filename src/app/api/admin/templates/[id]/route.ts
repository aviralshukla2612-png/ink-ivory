import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { UpdateTemplateSchema } from "@/lib/security/validators";
import { isApprovedRenderer } from "@/lib/templates/renderer-registry";
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

  const priceRec = await store.getTemplatePrice(template.id);
  const priceINR = priceRec ? Math.round(priceRec.amount / 100) : 299;

  return NextResponse.json({
    success: true,
    data: {
      ...template,
      priceINR,
      status: template.status || (template.isActive ? "ACTIVE" : "DRAFT"),
    },
  });
}

export async function PATCH(
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

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const parsed = UpdateTemplateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: parsed.error.issues[0]?.message || "Invalid payload",
          details: parsed.error.issues.map((i) => i.message),
        },
      },
      { status: 400 }
    );
  }

  if (parsed.data.rendererId && !isApprovedRenderer(parsed.data.rendererId)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAPPROVED_RENDERER",
          message: `Renderer "${parsed.data.rendererId}" is not approved in registry.`,
        },
      },
      { status: 400 }
    );
  }

  try {
    const updated = await store.updateTemplate(id, parsed.data);
    const priceRec = await store.getTemplatePrice(updated.id);

    const actor = auth.actor || getAdminActor(request)!;
    await logAdminAudit({
      actor,
      action: "TEMPLATE_UPDATED",
      resourceType: "TEMPLATE",
      resourceId: updated.id,
      metadata: { updates: parsed.data },
      request,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        priceINR: priceRec ? Math.round(priceRec.amount / 100) : 299,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_FAILED", message: err.message || "Failed to update template." } },
      { status: 400 }
    );
  }
}

export async function DELETE(
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

  const { id } = await params;

  try {
    const archived = await store.archiveTemplate(id);

    const actor = auth.actor || getAdminActor(request)!;
    await logAdminAudit({
      actor,
      action: "TEMPLATE_ARCHIVED",
      resourceType: "TEMPLATE",
      resourceId: archived.id,
      metadata: { title: archived.title },
      request,
    });

    return NextResponse.json({
      success: true,
      message: `Template "${archived.title}" successfully archived. Existing customer drafts preserved.`,
      data: archived,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "ARCHIVE_FAILED", message: err.message || "Failed to archive template." } },
      { status: 400 }
    );
  }
}
