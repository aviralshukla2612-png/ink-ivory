import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { verifyCsrfOrigin } from "@/lib/auth";
import { ReorderSectionsSchema } from "@/lib/security/validators";
import { logAdminAudit } from "@/lib/security/audit";

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
  const parsed = ReorderSectionsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: parsed.error.issues[0]?.message || "Invalid section order payload",
        },
      },
      { status: 400 }
    );
  }

  const reordered = await store.reorderTemplateSections(template.id, parsed.data.sectionOrders);

  const actor = auth.actor || getAdminActor(request)!;
  await logAdminAudit({
    actor,
    action: "TEMPLATE_SECTIONS_REORDERED",
    resourceType: "TEMPLATE",
    resourceId: template.id,
    metadata: { count: parsed.data.sectionOrders.length },
    request,
  });

  return NextResponse.json({
    success: true,
    message: "Sections reordered successfully.",
    data: reordered,
  });
}
