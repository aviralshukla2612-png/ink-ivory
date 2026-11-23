import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission } from "@/lib/security/rbac";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";

export async function GET(request: NextRequest) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "CUSTOMERS_VIEW");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: auth.error } },
      { status: auth.status }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search") || undefined;
  const type = (searchParams.get("type") as any) || undefined;
  const status = (searchParams.get("status") as any) || undefined;
  const platform = (searchParams.get("platform") as any) || undefined;
  const verified = (searchParams.get("verified") as any) || undefined;
  const sortBy = (searchParams.get("sortBy") as any) || "lastActive";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const result = await store.listCustomers({
    page,
    limit,
    search,
    type,
    status,
    platform,
    verified,
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
    stats: result.stats,
  });
}

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "CUSTOMERS_MANAGE");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: auth.error } },
      { status: auth.status }
    );
  }

  try {
    const body = await request.json();
    if (!body.phone) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Phone number is required." } },
        { status: 400 }
      );
    }

    const newCustomer = await store.createCustomer({
      phone: body.phone,
      email: body.email,
      platform: body.platform || "WEBSITE",
      phoneVerified: body.phoneVerified ?? true,
      profileImageUrl: body.profileImageUrl,
    });

    return NextResponse.json({
      success: true,
      data: newCustomer,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
