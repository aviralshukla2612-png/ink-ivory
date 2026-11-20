import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission } from "@/lib/security/rbac";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "CUSTOMERS_VIEW");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: auth.error } },
      { status: auth.status }
    );
  }

  const { id } = await params;
  const customer = await store.getCustomerDetails(id);

  if (!customer) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: `Customer "${id}" not found.` } },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: customer,
  });
}
