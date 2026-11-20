import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { UpdateCategorySchema } from "@/lib/security/validators";
import { logAdminAudit } from "@/lib/security/audit";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "CATEGORIES_MANAGE");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: auth.error } },
      { status: auth.status }
    );
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const parsed = UpdateCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } },
      { status: 400 }
    );
  }

  try {
    const updated = await store.updateCategory(id, parsed.data);

    const actor = auth.actor || getAdminActor(request)!;
    await logAdminAudit({
      actor,
      action: "CATEGORY_UPDATED",
      resourceType: "CATEGORY",
      resourceId: updated.id,
      metadata: { updates: parsed.data },
      request,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_FAILED", message: err.message || "Failed to update category." } },
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

  const auth = requirePermission(request, "CATEGORIES_MANAGE");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: auth.error } },
      { status: auth.status }
    );
  }

  const { id } = await params;

  try {
    const deleted = await store.deleteCategory(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: `Category "${id}" not found.` } },
        { status: 404 }
      );
    }

    const actor = auth.actor || getAdminActor(request)!;
    await logAdminAudit({
      actor,
      action: "CATEGORY_DELETED",
      resourceType: "CATEGORY",
      resourceId: id,
      metadata: { categoryId: id },
      request,
    });

    return NextResponse.json({ success: true, message: "Category deleted." });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "DELETE_FAILED", message: err.message || "Failed to delete category." } },
      { status: 400 }
    );
  }
}
