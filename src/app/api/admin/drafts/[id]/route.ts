import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { verifyCsrfOrigin } from "@/lib/auth";
import { logAdminAudit } from "@/lib/security/audit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "DRAFTS_VIEW");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: auth.error } },
      { status: auth.status }
    );
  }

  const { id } = await params;
  const draft = await store.getDraft(id);

  if (!draft) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: `Draft "${id}" not found.` } },
      { status: 404 }
    );
  }

  const template = await store.getTemplate(draft.templateId);

  return NextResponse.json({
    success: true,
    data: {
      ...draft,
      template,
      previewUrl: `/customize/${draft.templateId}?draftId=${draft.id}`,
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "CUSTOMERS_MANAGE");
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
  const draft = await store.getDraft(id);

  if (!draft) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: `Draft "${id}" not found.` } },
      { status: 404 }
    );
  }

  await store.deleteDraft(id);

  const actor = auth.actor || getAdminActor(request)!;
  await logAdminAudit({
    actor,
    action: "CUSTOMER_DRAFT_DELETED",
    resourceType: "DRAFT",
    resourceId: id,
    metadata: { title: draft.title, templateId: draft.templateId },
    request,
  });

  return NextResponse.json({
    success: true,
    message: `Draft "${id}" deleted successfully.`,
  });
}
