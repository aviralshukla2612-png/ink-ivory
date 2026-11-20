import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { DuplicateTemplateSchema } from "@/lib/security/validators";
import { logAdminAudit } from "@/lib/security/audit";

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

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const parsed = DuplicateTemplateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } },
      { status: 400 }
    );
  }

  try {
    const cloned = await store.duplicateTemplate(id, parsed.data.newTitle, parsed.data.newSlug);

    const actor = auth.actor || getAdminActor(request)!;
    await logAdminAudit({
      actor,
      action: "TEMPLATE_DUPLICATED",
      resourceType: "TEMPLATE",
      resourceId: cloned.id,
      metadata: { sourceTemplateId: id, clonedTitle: cloned.title, clonedSlug: cloned.slug },
      request,
    });

    const priceRec = await store.getTemplatePrice(cloned.id);

    return NextResponse.json(
      {
        success: true,
        data: {
          ...cloned,
          priceINR: priceRec ? Math.round(priceRec.amount / 100) : 299,
          draftsCount: 0,
          publicationsCount: 0,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "DUPLICATION_FAILED", message: err.message || "Failed to duplicate template." } },
      { status: 400 }
    );
  }
}
