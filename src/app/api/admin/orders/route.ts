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

  const result = await store.listOrders({ page, limit, search, status });
  const allTemplates = await store.getAllTemplates();
  const templateMap = new Map(allTemplates.map((t) => [t.id, t]));

  const items = result.items.map((o) => {
    const tpl = templateMap.get(o.templateId);
    const phone = o.customerPhone && o.customerPhone !== '—' ? o.customerPhone : '—';
    const platform = o.platform || 'Website';

    return {
      ...o,
      orderId: o.orderId || o.id,
      thumbnail: tpl?.previewImage || '/images/templates/udaipur-royal-palace-card.jpg',
      occasionBadge: (tpl?.occasion || 'Wedding').toUpperCase().includes('WEDDING') ? '👑 WEDDING' : '💍 CELEBRATION',
      customerPhone: phone,
      customerPlatform: platform,
      paymentId: o.paymentId || '—',
      amountRupees: o.amountRupees || Math.round((o.amount || 0) / 100),
      statusDisplay: o.status === 'PAID' ? 'Paid' : o.status === 'REFUNDED' ? 'Refunded' : 'Pending',
    };
  });

  const paidCount = result.items.filter((o) => o.status === 'PAID').length;
  const pendingCount = result.items.filter((o) => o.status === 'PENDING').length;
  const refundedCount = result.items.filter((o) => o.status === 'REFUNDED').length;
  const totalRevenue = result.items
    .filter((o) => o.status === 'PAID')
    .reduce((sum, o) => sum + (o.amount || 0), 0) / 100;

  return NextResponse.json({
    success: true,
    data: items,
    stats: {
      totalOrders: result.total,
      paidOrders: paidCount,
      pendingOrders: pendingCount,
      refundedOrders: refundedCount,
      totalRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
    },
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
}
