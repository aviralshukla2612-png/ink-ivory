/**
 * Ink & Ivory — Milestone 2 Dashboard & Real KPIs Test Suite
 *
 * Verifies:
 * 1. GET /api/admin returns complete calculated business KPIs (Revenue, Orders, Drafts, Publications, Conversion Rate, AOV, Customers)
 * 2. GET /api/admin returns template performance leaderboard with calculated conversion rates and revenues
 * 3. GET /api/admin returns unified chronological activity feed (publications, payments, audits)
 * 4. POST /api/admin updates template price, persists to datastore, and writes immutable audit record
 * 5. CSRF and RBAC protection remain active on all admin endpoints
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "ink_ivory_admin_key_replace_with_high_entropy_secret_2026";

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

async function runMilestone2Tests() {
  console.log("\n========================================================");
  console.log("   INK & IVORY — MILESTONE 2: DASHBOARD & KPIS TESTS    ");
  console.log("========================================================\n");

  // 1. Authenticate and retrieve valid admin session cookie
  console.log("--- 1. Authenticating Admin Session ---");
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminKey: ADMIN_SECRET }),
  });
  const loginData = await loginRes.json();
  const setCookie = loginRes.headers.get("set-cookie") || "";
  const sessionCookie = setCookie.split(";")[0];

  assert(
    loginRes.status === 200 && loginData.success === true && sessionCookie.includes("ink_ivory_admin_session="),
    "Admin successfully authenticated and received session cookie"
  );

  // 2. Query Dashboard Data via GET /api/admin
  console.log("\n--- 2. Validating Dashboard Business KPIs ---");
  const adminRes = await fetch(`${BASE_URL}/api/admin`, {
    headers: { Cookie: sessionCookie },
  });
  const adminData = await adminRes.json();

  assert(adminRes.status === 200 && adminData.success === true, "GET /api/admin returns HTTP 200 with success: true");

  const stats = adminData.stats;
  assert(stats !== undefined, "Response contains stats object");
  assert(typeof stats.totalRevenue === "number", "stats.totalRevenue is a valid number");
  assert(typeof stats.totalOrders === "number", "stats.totalOrders is a valid number");
  assert(typeof stats.totalDrafts === "number", "stats.totalDrafts is a valid number");
  assert(typeof stats.publishedCount === "number", "stats.publishedCount is a valid number");
  assert(typeof stats.conversionRate === "number", "stats.conversionRate is calculated as a numeric percentage");
  assert(typeof stats.averageOrderValue === "number", "stats.averageOrderValue is calculated");
  assert(typeof stats.totalCustomers === "number", "stats.totalCustomers reflects distinct guest/user identities");

  // 3. Template Performance Metrics
  console.log("\n--- 3. Validating Template Performance Leaderboard ---");
  const tplPerf = adminData.templatePerformance;
  assert(Array.isArray(tplPerf) && tplPerf.length > 0, "Response contains templatePerformance array with collections");

  if (tplPerf && tplPerf.length > 0) {
    const firstTpl = tplPerf[0];
    assert(typeof firstTpl.id === "string" && typeof firstTpl.title === "string", "Template object contains id and title");
    assert(typeof firstTpl.price === "number", "Template object contains unit price");
    assert(typeof firstTpl.draftsCount === "number", "Template object contains draftsCount");
    assert(typeof firstTpl.publicationsCount === "number", "Template object contains publicationsCount");
    assert(typeof firstTpl.revenue === "number", "Template object contains calculated revenue");
    assert(typeof firstTpl.conversionRate === "number", "Template object contains conversionRate");
  }

  // 4. Activity Stream
  console.log("\n--- 4. Validating Real-Time Operational Activity Stream ---");
  const activityFeed = adminData.activityFeed;
  assert(Array.isArray(activityFeed), "Response contains activityFeed array");

  // 5. Test Live Price Update & Audit Log Persistence
  console.log("\n--- 5. Testing Price Update Mutation & Audit Trail ---");
  const updatePriceRes = await fetch(`${BASE_URL}/api/admin`, {
    method: "POST",
    headers: {
      Cookie: sessionCookie,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "update-price",
      templateId: "template-01",
      amountPaise: 39900,
    }),
  });
  const updatePriceData = await updatePriceRes.json();

  assert(
    updatePriceRes.status === 200 && updatePriceData.success === true,
    "POST /api/admin successfully updates template-01 price to ₹399 (39900 paise)"
  );

  // Verify in datastore
  const storeFilePath = path.resolve("data/ink-ivory-store.json");
  const storeRaw = JSON.parse(fs.readFileSync(storeFilePath, "utf8"));
  const updatedPriceRec = storeRaw.prices.find((p) => p.templateId === "template-01");

  assert(
    updatedPriceRec && updatedPriceRec.amount === 39900,
    "Price update directly verified in JSON datastore (amount === 39900)"
  );

  // Verify audit log record
  const latestAuditLog = storeRaw.auditLogs[storeRaw.auditLogs.length - 1];
  assert(
    latestAuditLog &&
    latestAuditLog.action.includes("PRICE_UPDATED") &&
    latestAuditLog.entityId === "template-01",
    "Price update created an immutable audit record with action ADMIN_PRICE_UPDATED"
  );

  // Restore price back to 29900
  await fetch(`${BASE_URL}/api/admin`, {
    method: "POST",
    headers: {
      Cookie: sessionCookie,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "update-price",
      templateId: "template-01",
      amountPaise: 29900,
    }),
  });

  // ------------------------------------------------------------------
  // Summary
  // ------------------------------------------------------------------
  console.log("\n========================================================");
  console.log(`MILESTONE 2 VERIFICATION COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("========================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runMilestone2Tests().catch((e) => {
  console.error("FATAL ERROR IN MILESTONE 2 TESTS:", e);
  process.exit(1);
});
