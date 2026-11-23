import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requirePermission } from "@/lib/security/rbac";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";

export async function GET(request: NextRequest) {
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  const auth = requirePermission(request, "FINANCIALS_VIEW");
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
  const status = searchParams.get("status") || undefined;

  const result = await store.listPayments({ page, limit, search, status });

  const items = result.items.map((p) => {
    return {
      ...p,
      paymentId: p.paymentId || p.id,
      orderId: p.orderId || '—',
      customerPhone: p.customerPhone && p.customerPhone !== '—' ? p.customerPhone : '—',
      amountRupees: Math.round((p.amount || 0) / 100),
      method: p.method || 'UPI',
      statusDisplay: p.status === 'CAPTURED' ? 'Captured' : p.status === 'REFUNDED' ? 'Refunded' : 'Pending',
    };
  });

  const totalAmount = result.items.reduce((s, p) => s + (p.amount || 0), 0) / 100;
  const settled = result.items.filter((p) => p.status === 'CAPTURED');
  const settledAmount = settled.reduce((s, p) => s + (p.amount || 0), 0) / 100;
  const pending = result.items.filter((p) => p.status === 'PENDING');
  const pendingAmount = pending.reduce((s, p) => s + (p.amount || 0), 0) / 100;
  const refunded = result.items.filter((p) => p.status === 'REFUNDED');
  const refundedAmount = refunded.reduce((s, p) => s + (p.amount || 0), 0) / 100;

  return NextResponse.json({
    success: true,
    data: items,
    stats: {
      totalPayments: `₹${totalAmount.toLocaleString('en-IN')}`,
      settledPayments: `₹${settledAmount.toLocaleString('en-IN')}`,
      settledOrders: settled.length,
      pendingPayments: `₹${pendingAmount.toLocaleString('en-IN')}`,
      pendingOrders: pending.length,
      refundedAmount: `₹${refundedAmount.toLocaleString('en-IN')}`,
      refundCount: refunded.length,
      refundRate: result.total > 0 ? `${Math.round((refunded.length / result.total) * 1000) / 10}%` : '0%',
    },
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
}
