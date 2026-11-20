import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { verifyAdminAccess, verifyCsrfOrigin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { AdminUpdatePriceSchema } from "@/lib/security/validators";
import { logSecurityEvent } from "@/lib/security/logger";
import { logAdminAudit } from "@/lib/security/audit";
import { getAdminActor } from "@/lib/security/rbac";

export async function GET(request: NextRequest) {
  // 1. Rate Limiting Check
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  // 2. Authentication & Authorization Check
  if (!verifyAdminAccess(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Valid administrative session required." },
      { status: 401 }
    );
  }

  // 2.1 CSRF Origin Check
  if (!verifyCsrfOrigin(request)) {
    return NextResponse.json(
      { success: false, error: "Cross-site request blocked (CSRF protection)." },
      { status: 403 }
    );
  }

  try {
    const rawStats = await store.getAdminStats();
    const drafts = await store.listAllDrafts();
    const publications = await store.listPublications();
    const payments = await store.getAllPayments();
    const templates = await store.getAllTemplates();
    const allInvitations = (store as any).data?.invitations || [];
    const allOrders = (store as any).data?.orders || [];
    const prices = (store as any).data?.prices || [];
    const auditLogs = (store as any).data?.auditLogs || [];

    // Calculate Conversion Rate & Average Order Value
    const conversionRate =
      drafts.length > 0 ? Number(((publications.length / drafts.length) * 100).toFixed(1)) : 0;
    const averageOrderValue =
      payments.length > 0 ? Math.round(rawStats.totalRevenue / payments.length) : 0;

    const stats = {
      ...rawStats,
      conversionRate,
      averageOrderValue,
      totalCustomers: drafts.reduce((acc: Set<string>, d) => {
        if (d.guestToken) acc.add(d.guestToken);
        if (d.userId) acc.add(d.userId);
        return acc;
      }, new Set<string>()).size,
    };

    // Calculate Template Performance Metrics
    const templatePerformance = templates.map((tpl) => {
      const tplDrafts = drafts.filter((d) => d.templateId === tpl.id || d.templateId === tpl.slug);
      const tplPubs = publications.filter((p) => p.templateId === tpl.id || p.templateId === tpl.slug);
      const tplRevenue = payments
        .filter((p) => {
          const draft = drafts.find((d) => d.id === (p as any).draftId);
          return draft && (draft.templateId === tpl.id || draft.templateId === tpl.slug);
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      const priceRec = prices.find((pr: any) => pr.templateId === tpl.id);
      const currentPrice = priceRec ? Math.round(priceRec.amount / 100) : 299;

      return {
        id: tpl.id,
        slug: tpl.slug,
        title: tpl.title,
        category: tpl.occasion || "Invitation",
        isActive: tpl.isActive,
        price: currentPrice,
        draftsCount: tplDrafts.length,
        publicationsCount: tplPubs.length,
        revenue: Math.round(tplRevenue / 100),
        conversionRate:
          tplDrafts.length > 0 ? Number(((tplPubs.length / tplDrafts.length) * 100).toFixed(1)) : 0,
      };
    });

    // Enriched Publications with Live Slugs
    const enrichedPublications = publications.map((pub) => {
      const inv = allInvitations.find((i: any) => i.id === pub.invitationId || i.draftId === pub.draftId);
      const tpl = templates.find((t) => t.id === pub.templateId);
      return {
        ...pub,
        slug: inv?.slug || "unknown",
        viewCount: inv?.viewCount || 0,
        templateTitle: tpl?.title || "Bespoke Invitation",
        liveUrl: `/invite/${inv?.slug || "unknown"}`,
      };
    });

    // Unified Chronological Activity Feed
    const activityFeed = [
      ...publications.map((p) => {
        const inv = allInvitations.find((i: any) => i.id === p.invitationId || i.draftId === p.draftId);
        const tpl = templates.find((t) => t.id === p.templateId);
        return {
          id: `pub_${p.id}`,
          type: "PUBLICATION",
          title: `Invitation Published: ${p.snapshotData?.templateTitle || tpl?.title || "Custom Invitation"}`,
          timestamp: (p as any).publishedAt || (p as any).createdAt || new Date().toISOString(),
          details: `Template: ${p.templateId} • Slug: /invite/${inv?.slug || p.id}`,
        };
      }),
      ...payments.map((pm) => ({
        id: `pay_${pm.id}`,
        type: "PAYMENT",
        title: `Payment Received: ₹${Math.round((pm.amount || 0) / 100)}`,
        timestamp: pm.createdAt,
        details: `Order: ${pm.orderId} • Status: ${pm.status}`,
      })),
      ...auditLogs.slice(-10).map((l: any) => ({
        id: `log_${l.id}`,
        type: "AUDIT",
        title: `Administrative Action: ${l.action}`,
        timestamp: l.createdAt,
        details: `${l.entityType} ${l.entityId || ""}`,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 15);

    logSecurityEvent({
      event: "ADMIN_DASHBOARD_ACCESSED",
      level: "INFO",
      details: { draftsCount: drafts.length, publicationsCount: publications.length },
    });

    return NextResponse.json({
      success: true,
      stats,
      drafts,
      publications: enrichedPublications,
      payments,
      orders: allOrders,
      templates,
      prices,
      templatePerformance,
      activityFeed,
    });
  } catch (error: any) {
    console.error("Admin API GET error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // 1. Rate Limiting Check
  const rl = checkRateLimit(request, "adminApi");
  if (!rl.success) return createRateLimitResponse(rl);

  // 2. Authentication & Authorization Check
  if (!verifyAdminAccess(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Valid administrative key required." },
      { status: 401 }
    );
  }

  // 2.1 CSRF Origin Check
  if (!verifyCsrfOrigin(request)) {
    return NextResponse.json(
      { success: false, error: "Cross-site request blocked (CSRF protection)." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    // 3. Schema Input Validation
    const parsed = AdminUpdatePriceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const { templateId, amountPaise, promotionalPricePaise } = parsed.data;

    const updatedPrice = await store.updateTemplatePrice(
      templateId,
      amountPaise,
      promotionalPricePaise
    );

    const actor = getAdminActor(request) || {
      userId: "usr_super_admin",
      role: "SUPER_ADMIN",
      email: "admin@inkandivory.com",
    };

    // 4. Log Immutable Administrative Audit Event
    await logAdminAudit({
      actor,
      action: "PRICE_UPDATED",
      resourceType: "TEMPLATE_PRICE",
      resourceId: templateId,
      metadata: {
        amountPaise,
        promotionalPricePaise,
        newPriceINR: Math.round(amountPaise / 100),
      },
      request,
    });

    return NextResponse.json({ success: true, price: updatedPrice });
  } catch (error: any) {
    console.error("Admin API POST error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
