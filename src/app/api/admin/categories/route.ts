import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { CreateCategorySchema } from "@/lib/security/validators";
import { logAdminAudit } from "@/lib/security/audit";

export async function GET(request: NextRequest) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "CATEGORIES_MANAGE");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: auth.error } },
      { status: auth.status }
    );
  }

  try {
    const categories = await store.listCategories();
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to load categories." } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "CATEGORIES_MANAGE");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: auth.error } },
      { status: auth.status }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const parsed = CreateCategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } },
        { status: 400 }
      );
    }

    const category = await store.createCategory(parsed.data);

    const actor = auth.actor || getAdminActor(request)!;
    await logAdminAudit({
      actor,
      action: "CATEGORY_CREATED",
      resourceType: "CATEGORY",
      resourceId: category.id,
      metadata: { name: category.name, slug: category.slug },
      request,
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "CREATION_FAILED", message: err.message || "Failed to create category." } },
      { status: 400 }
    );
  }
}
