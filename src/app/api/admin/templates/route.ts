import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission, getAdminActor } from "@/lib/security/rbac";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { CreateTemplateSchema } from "@/lib/security/validators";
import { isApprovedRenderer } from "@/lib/templates/renderer-registry";
import { logAdminAudit } from "@/lib/security/audit";

export async function GET(request: NextRequest) {
  // 1. Rate limiting
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  // 2. RBAC check (TEMPLATES_VIEW)
  const auth = requirePermission(request, "TEMPLATES_VIEW");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: auth.error } },
      { status: auth.status }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const tier = searchParams.get("tier") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    const result = await store.listTemplates({
      page,
      limit,
      search,
      category,
      status,
      tier,
      sortBy,
      sortOrder,
    });

    return NextResponse.json({
      success: true,
      data: result.items,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (err: any) {
    console.error("GET /api/admin/templates error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to list templates." } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // 1. Rate limiting
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  // 2. RBAC check (TEMPLATES_MANAGE) & CSRF origin
  const auth = requirePermission(request, "TEMPLATES_MANAGE");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: auth.error } },
      { status: auth.status }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));

    // 3. Schema validation
    const parsed = CreateTemplateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.issues[0]?.message || "Invalid template payload",
            details: parsed.error.issues.map((i) => i.message),
          },
        },
        { status: 400 }
      );
    }

    // 4. Verify approved renderer security rule
    if (!isApprovedRenderer(parsed.data.rendererId)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAPPROVED_RENDERER",
            message: `Renderer "${parsed.data.rendererId}" is not in the Approved Renderer Registry.`,
          },
        },
        { status: 400 }
      );
    }

    // 5. Create in store
    const { template, price } = await store.createTemplate(parsed.data);

    // 6. Immutable audit log
    const actor = auth.actor || getAdminActor(request)!;
    await logAdminAudit({
      actor,
      action: "TEMPLATE_CREATED",
      resourceType: "TEMPLATE",
      resourceId: template.id,
      metadata: {
        title: template.title,
        slug: template.slug,
        rendererId: template.rendererId,
        priceINR: parsed.data.priceINR,
      },
      request,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...template,
          priceINR: Math.round(price.amount / 100),
          draftsCount: 0,
          publicationsCount: 0,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /api/admin/templates error:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CREATION_FAILED",
          message: err.message || "Failed to create template.",
        },
      },
      { status: 400 }
    );
  }
}
