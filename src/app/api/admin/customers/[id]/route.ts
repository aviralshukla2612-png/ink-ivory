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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "CUSTOMERS_MANAGE");
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: auth.error } },
      { status: auth.status }
    );
  }

  const { id } = await params;

  try {
    const body = await request.json();

    if (body.action === "add_note") {
      const note = await store.addCustomerNote(id, {
        text: body.text,
        author: body.author || "Admin",
      });
      return NextResponse.json({ success: true, data: note });
    }

    const updated = await store.updateCustomer(id, {
      phone: body.phone,
      phoneVerified: body.phoneVerified,
      email: body.email,
      isActive: body.isActive,
      platform: body.platform,
      profileImageUrl: body.profileImageUrl,
      profileImageUpdatedAt: body.profileImageUpdatedAt,
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_FAILED", message: err.message } },
      { status: 500 }
    );
  }
}
