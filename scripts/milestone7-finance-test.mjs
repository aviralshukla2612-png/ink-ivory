/**
 * Ink & Ivory — Milestone 7: Financial Management, Orders, Payments & Real Coupons Test Suite
 */

import crypto from "crypto";

const BASE_URL = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "ink_ivory_admin_key_replace_with_high_entropy_secret_2026";
const RAZORPAY_SECRET = process.env.RAZORPAY_KEY_SECRET || "inkivory_secret_test_987654";

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, detail = "") {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${testName}${detail ? " - " + detail : ""}`);
    failedCount++;
  }
}

function createAdminToken(role, userId) {
  const sessionId = "adm_" + crypto.randomUUID().slice(0, 8);
  const expiresAt = Date.now() + 2 * 60 * 60 * 1000;
  const payload = `${sessionId}.${role}.${userId}.${expiresAt}`;
  const sig = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex").slice(0, 32);
  return `ink_ivory_admin_session=${payload}.${sig}`;
}

async function runMilestone7Tests() {
  console.log("\n========================================================");
  console.log("   INK & IVORY — MILESTONE 7: FINANCE & ORDERS TESTS    ");
  console.log("========================================================\n");

  // 1. Authenticate as SUPER_ADMIN
  console.log("--- 1. Authenticating Admin Session ---");
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminKey: ADMIN_SECRET }),
  });
  assert(loginRes.status === 200, "POST /api/admin/login authenticates with 200 OK");
  const setCookie = loginRes.headers.get("set-cookie") || "";
  const adminCookie = setCookie.split(";")[0] || createAdminToken("SUPER_ADMIN", "usr_super");

  // 2. Setup Order and Payment for testing
  console.log("\n--- 2. Setting Up Seed Order & Captured Payment ---");
  const uniqueId = Date.now().toString().slice(-6);
  const rawToken = "gst_" + crypto.randomUUID().replace(/-/g, "");
  const HMAC_SECRET = process.env.SESSION_SECRET || "ink_ivory_dev_fallback_hmac_secret_2026_salt";
  const guestSig = crypto.createHmac("sha256", HMAC_SECRET).update(rawToken).digest("hex").slice(0, 16);
  const testGuestToken = `${rawToken}.${guestSig}`;

  const draftRes = await fetch(`${BASE_URL}/api/drafts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-guest-token": testGuestToken },
    body: JSON.stringify({
      templateId: "tpl-date-planner-07",
      title: `Financial Order Test Draft ${uniqueId}`,
      fields: { names: "Aditya & Sanjana" },
    }),
  });
  const draftData = await draftRes.json();
  const draftId = draftData.data ? draftData.data.id : draftData.draft?.id;
  assert(Boolean(draftId), "Draft created for order verification");

  const orderRes = await fetch(`${BASE_URL}/api/payments/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-guest-token": testGuestToken },
    body: JSON.stringify({ draftId }),
  });
  const orderData = await orderRes.json();
  const createdOrderId = orderData.orderId || orderData.data?.orderId;
  assert(Boolean(createdOrderId), `Payment order created: ${createdOrderId}`);

  const testPaymentId = `pay_fin_${uniqueId}`;
  const sigPayload = `${createdOrderId}|${testPaymentId}`;
  const signature = crypto.createHmac("sha256", RAZORPAY_SECRET).update(sigPayload).digest("hex");

  const verifyRes = await fetch(`${BASE_URL}/api/payments/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-guest-token": testGuestToken },
    body: JSON.stringify({
      orderId: createdOrderId,
      paymentId: testPaymentId,
      signature,
      draftId,
      requestedSlug: `fin-order-${uniqueId}`,
    }),
  });
  const verifyData = await verifyRes.json();
  assert(verifyRes.status === 200 && verifyData.success, "Payment verified and recorded in datastore");

  // 3. Orders Listing & Search
  console.log("\n--- 3. Testing Orders Listing & Filters ---");
  const ordersRes = await fetch(`${BASE_URL}/api/admin/orders?page=1&limit=20`, {
    headers: { Cookie: adminCookie },
  });
  assert(ordersRes.status === 200, "GET /api/admin/orders returns 200 OK");
  const ordersData = await ordersRes.json();
  assert(Array.isArray(ordersData.data) && ordersData.data.length > 0, "Orders returned non-empty list");

  const targetOrder = ordersData.data.find((o) => o.orderId === createdOrderId);
  assert(Boolean(targetOrder), `Newly created order found in admin listing (${createdOrderId})`);
  assert(targetOrder?.status === "PAID", "Order status is PAID");
  assert(targetOrder?.amountRupees > 0, `Order amount in INR: ₹${targetOrder?.amountRupees}`);

  // 4. Single Order Details
  console.log("\n--- 4. Testing Order Details by ID ---");
  const orderDetailRes = await fetch(`${BASE_URL}/api/admin/orders/${encodeURIComponent(createdOrderId)}`, {
    headers: { Cookie: adminCookie },
  });
  assert(orderDetailRes.status === 200, "GET /api/admin/orders/[id] returns 200 OK");
  const orderDetailData = await orderDetailRes.json();
  assert(orderDetailData.data?.order?.orderId === createdOrderId, "Order details contain matched order");
  assert(Boolean(orderDetailData.data?.payment), "Order details joined with payment record");
  assert(Boolean(orderDetailData.data?.publication), "Order details joined with publication record");

  // 5. Payments Listing
  console.log("\n--- 5. Testing Payments Listing ---");
  const paymentsRes = await fetch(`${BASE_URL}/api/admin/payments?page=1&limit=20`, {
    headers: { Cookie: adminCookie },
  });
  assert(paymentsRes.status === 200, "GET /api/admin/payments returns 200 OK");
  const paymentsData = await paymentsRes.json();
  assert(Array.isArray(paymentsData.data) && paymentsData.data.length > 0, "Payments returned list of transactions");
  const matchedPayment = paymentsData.data.find((p) => p.paymentId === testPaymentId);
  assert(Boolean(matchedPayment), `Recorded payment ${testPaymentId} found in payments list`);
  assert(matchedPayment?.status === "CAPTURED", "Payment status is CAPTURED");

  // 6. Authorized Refund Workflow
  console.log("\n--- 6. Testing Authorized Refund Workflow ---");
  const refundRes = await fetch(`${BASE_URL}/api/admin/payments/${encodeURIComponent(testPaymentId)}/refund`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      reason: "Customer requested cancellation for change of ceremony date",
    }),
  });
  assert(refundRes.status === 200, "POST /api/admin/payments/[id]/refund returns 200 OK");
  const refundData = await refundRes.json();
  assert(refundData.data?.payment?.status === "REFUNDED", "Payment status transitioned to REFUNDED");
  assert(refundData.data?.order?.status === "REFUNDED", "Corresponding order status transitioned to REFUNDED");

  // 6.1 Duplicate Refund Protection
  const dupRefundRes = await fetch(`${BASE_URL}/api/admin/payments/${encodeURIComponent(testPaymentId)}/refund`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({ reason: "Duplicate refund attempt" }),
  });
  assert(dupRefundRes.status === 400, "Duplicate refund attempt rejected with 400 Bad Request");

  // 7. Real Coupons CRUD Engine
  console.log("\n--- 7. Testing Real Coupons CRUD Operations ---");
  const couponCode = `ROYALTEST${uniqueId}`;
  const createCouponRes = await fetch(`${BASE_URL}/api/admin/coupons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      code: couponCode,
      discountType: "FIXED",
      discountValue: 5000,
      minOrderValuePaise: 29900,
      usageLimit: 100,
    }),
  });
  assert(createCouponRes.status === 201, "POST /api/admin/coupons creates new coupon with 201 Created");
  const createCouponData = await createCouponRes.json();
  const couponId = createCouponData.data.id;
  assert(createCouponData.data.code === couponCode, "Coupon created with expected uppercase code");

  // 7.1 Read coupons list
  const couponsListRes = await fetch(`${BASE_URL}/api/admin/coupons`, {
    headers: { Cookie: adminCookie },
  });
  assert(couponsListRes.status === 200, "GET /api/admin/coupons returns 200 OK");
  const couponsListData = await couponsListRes.json();
  const createdInList = couponsListData.data.find((c) => c.id === couponId);
  assert(Boolean(createdInList), "Newly created coupon present in list");

  // 7.2 Update coupon
  const updateCouponRes = await fetch(`${BASE_URL}/api/admin/coupons/${encodeURIComponent(couponId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      discountValue: 7500,
      isActive: false,
    }),
  });
  assert(updateCouponRes.status === 200, "PATCH /api/admin/coupons/[id] updates coupon");
  const updateCouponData = await updateCouponRes.json();
  assert(updateCouponData.data.discountValue === 7500 && updateCouponData.data.isActive === false, "Coupon fields updated correctly");

  // 7.3 Delete coupon
  const deleteCouponRes = await fetch(`${BASE_URL}/api/admin/coupons/${encodeURIComponent(couponId)}`, {
    method: "DELETE",
    headers: {
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
  });
  assert(deleteCouponRes.status === 200, "DELETE /api/admin/coupons/[id] removes coupon");

  // 8. RBAC Role Guards
  console.log("\n--- 8. Testing RBAC Role Enforcement on Financial Operations ---");
  const financeCookie = createAdminToken("FINANCE", "usr_fin_1");
  const contentCookie = createAdminToken("CONTENT_MANAGER", "usr_content_1");

  const finOrdersRes = await fetch(`${BASE_URL}/api/admin/orders`, {
    headers: { Cookie: financeCookie },
  });
  assert(finOrdersRes.status === 200, "FINANCE role authorized to view orders (FINANCIALS_VIEW)");

  const contentOrdersRes = await fetch(`${BASE_URL}/api/admin/orders`, {
    headers: { Cookie: contentCookie },
  });
  assert(contentOrdersRes.status === 403, "CONTENT_MANAGER strictly blocked from orders with 403 Forbidden");

  const contentRefundRes = await fetch(`${BASE_URL}/api/admin/payments/${encodeURIComponent(testPaymentId)}/refund`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: contentCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({ reason: "Unauthorized refund" }),
  });
  assert(contentRefundRes.status === 403, "CONTENT_MANAGER strictly blocked from refunds with 403 Forbidden");

  // 9. CSRF Origin Defense
  console.log("\n--- 9. Testing CSRF Origin Defense on Financial Mutations ---");
  const csrfRefundRes = await fetch(`${BASE_URL}/api/admin/payments/${encodeURIComponent(testPaymentId)}/refund`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: "https://evil-attacker.site",
    },
    body: JSON.stringify({ reason: "CSRF refund attack" }),
  });
  assert(csrfRefundRes.status === 403, "POST /refund strictly rejects cross-origin requests (CSRF: 403)");

  const csrfCouponRes = await fetch(`${BASE_URL}/api/admin/coupons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: "https://malicious-site.org",
    },
    body: JSON.stringify({ code: "CSRFCODE", discountType: "FIXED", discountValue: 100 }),
  });
  assert(csrfCouponRes.status === 403, "POST /coupons strictly rejects cross-origin requests (CSRF: 403)");

  console.log("\n========================================================");
  console.log(`MILESTONE 7 VERIFICATION COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("========================================================\n");

  if (failedCount > 0) process.exit(1);
}

runMilestone7Tests().catch((err) => {
  console.error("FATAL ERROR IN MILESTONE 7 TESTS:", err);
  process.exit(1);
});
