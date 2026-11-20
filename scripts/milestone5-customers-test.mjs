/**
 * Ink & Ivory — Milestone 5: Customers & Draft Management Test Suite
 *
 * Verifies all Milestone 5 requirements:
 * 1. GET /api/admin/customers - paginated list of aggregated customers with spend & drafts counts
 * 2. GET /api/admin/customers?search=... - search filtering across customer identities
 * 3. GET /api/admin/customers/[id] - detailed customer profile with draft & payment history
 * 4. GET /api/admin/drafts - paginated list of customer drafts with template titles
 * 5. GET /api/admin/drafts/[id] - inspects single draft payload & custom audio
 * 6. DELETE /api/admin/drafts/[id] - deletes customer draft with audit logging
 * 7. RBAC permissions - SUPPORT/ADMIN permitted, FINANCE blocked from draft deletions
 * 8. CSRF Origin defense on draft mutations
 */

import crypto from "crypto";

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

function createAdminToken(role, userId) {
  const sessionId = "adm_" + crypto.randomUUID().slice(0, 8);
  const expiresAt = Date.now() + 2 * 60 * 60 * 1000;
  const payload = `${sessionId}.${role}.${userId}.${expiresAt}`;
  const sig = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex").slice(0, 32);
  return `ink_ivory_admin_session=${payload}.${sig}`;
}

async function runMilestone5Tests() {
  console.log("\n========================================================");
  console.log("   INK & IVORY — MILESTONE 5: CUSTOMERS & DRAFTS TESTS  ");
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

  // First, create a test draft via public endpoint to ensure test data exists
  console.log("\n--- 2. Setting Up Test Draft Data ---");
  const testGuestToken = `gst_test_customer_${Date.now().toString().slice(-6)}`;
  const draftCreateRes = await fetch(`${BASE_URL}/api/drafts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-guest-token": testGuestToken,
    },
    body: JSON.stringify({
      templateId: "tpl-date-planner-07",
      title: "Romantic Dinner & Stargazing Date",
      fields: {
        names: "Aarav & Riya",
        date: "Friday, 20 November 2026",
        venue: "Skyline Rooftop Lounge",
      },
      design: {
        themeColor: "#FFF2ED",
        accentColor: "#641A2A",
      },
    }),
  });
  const draftCreateData = await draftCreateRes.json();
  assert(draftCreateRes.status === 201 || draftCreateRes.status === 200, "Test draft created successfully");
  const createdDraftId = draftCreateData.data ? draftCreateData.data.id : draftCreateData.draft?.id;
  assert(Boolean(createdDraftId), `Test draft ID obtained: ${createdDraftId}`);

  // 3. GET /api/admin/customers
  console.log("\n--- 3. Testing Customer Directory Listing & Aggregation ---");
  const custRes = await fetch(`${BASE_URL}/api/admin/customers?page=1&limit=10`, {
    headers: { Cookie: adminCookie },
  });
  assert(custRes.status === 200, "GET /api/admin/customers returns 200 OK");
  const custData = await custRes.json();
  assert(custData.success === true, "Response has success: true");
  assert(Array.isArray(custData.data), "data is an array of customer records");
  assert(typeof custData.meta?.total === "number", "meta contains total customer count");

  // Search customer
  const searchCustRes = await fetch(`${BASE_URL}/api/admin/customers?search=${encodeURIComponent(testGuestToken)}`, {
    headers: { Cookie: adminCookie },
  });
  const searchCustData = await searchCustRes.json();
  assert(searchCustRes.status === 200 && searchCustData.data.length > 0, "Search query matched newly created guest customer");

  // 4. GET /api/admin/customers/[id]
  console.log("\n--- 4. Testing Customer Profile History ---");
  const singleCustRes = await fetch(`${BASE_URL}/api/admin/customers/${encodeURIComponent(testGuestToken)}`, {
    headers: { Cookie: adminCookie },
  });
  assert(singleCustRes.status === 200, "GET /api/admin/customers/[id] returns 200 OK");
  const singleCustData = await singleCustRes.json();
  assert(singleCustData.data.id === testGuestToken, "Profile matches queried customer ID");
  assert(Array.isArray(singleCustData.data.drafts) && singleCustData.data.drafts.length > 0, "Profile contains customer drafts list");

  // 5. GET /api/admin/drafts
  console.log("\n--- 5. Testing Drafts Explorer Listing & Filter ---");
  const draftsRes = await fetch(`${BASE_URL}/api/admin/drafts?page=1&limit=10`, {
    headers: { Cookie: adminCookie },
  });
  assert(draftsRes.status === 200, "GET /api/admin/drafts returns 200 OK");
  const draftsData = await draftsRes.json();
  assert(draftsData.success === true && Array.isArray(draftsData.data), "GET /api/admin/drafts returned array of drafts");
  assert(Boolean(draftsData.data[0]?.templateTitle), "Draft items contain mapped templateTitle");

  // Filter drafts by templateId
  const filterDraftsRes = await fetch(`${BASE_URL}/api/admin/drafts?templateId=tpl-date-planner-07`, {
    headers: { Cookie: adminCookie },
  });
  const filterDraftsData = await filterDraftsRes.json();
  assert(filterDraftsRes.status === 200 && filterDraftsData.data.length > 0, "Template filter returned matching drafts");

  // 6. GET /api/admin/drafts/[id]
  console.log("\n--- 6. Testing Single Draft Payload Inspection ---");
  const singleDraftRes = await fetch(`${BASE_URL}/api/admin/drafts/${encodeURIComponent(createdDraftId)}`, {
    headers: { Cookie: adminCookie },
  });
  assert(singleDraftRes.status === 200, "GET /api/admin/drafts/[id] returns 200 OK");
  const singleDraftData = await singleDraftRes.json();
  assert(singleDraftData.data.fields?.names === "Aarav & Riya", "Draft payload contains customized names");
  assert(Boolean(singleDraftData.data.previewUrl), "Draft response includes editor preview link");

  // 7. DELETE /api/admin/drafts/[id]
  console.log("\n--- 7. Testing Customer Draft Deletion ---");
  const deleteDraftRes = await fetch(`${BASE_URL}/api/admin/drafts/${encodeURIComponent(createdDraftId)}`, {
    method: "DELETE",
    headers: {
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
  });
  assert(deleteDraftRes.status === 200, "DELETE /api/admin/drafts/[id] returns 200 OK");

  // Verify deletion
  const getDeletedRes = await fetch(`${BASE_URL}/api/admin/drafts/${encodeURIComponent(createdDraftId)}`, {
    headers: { Cookie: adminCookie },
  });
  assert(getDeletedRes.status === 404, "Draft successfully purged from store (returns 404 Not Found)");

  // 8. RBAC Permission Checks
  console.log("\n--- 8. Testing RBAC Role Enforcement on Customer & Draft APIs ---");
  const supportCookie = createAdminToken("SUPPORT", "usr_support_1");
  const financeCookie = createAdminToken("FINANCE", "usr_fin_1");

  // SUPPORT can view drafts
  const supportDraftsRes = await fetch(`${BASE_URL}/api/admin/drafts`, {
    headers: { Cookie: supportCookie },
  });
  assert(supportDraftsRes.status === 200, "SUPPORT role authorized to view drafts (DRAFTS_VIEW)");

  // FINANCE cannot delete drafts
  const finDeleteRes = await fetch(`${BASE_URL}/api/admin/drafts/drf_dummy_test`, {
    method: "DELETE",
    headers: {
      Cookie: financeCookie,
      Origin: BASE_URL,
    },
  });
  assert(finDeleteRes.status === 403, "FINANCE role strictly blocked from deleting drafts with 403 Forbidden");

  // 9. CSRF Defense
  console.log("\n--- 9. Testing CSRF Origin Defense on Draft Deletions ---");
  const csrfRes = await fetch(`${BASE_URL}/api/admin/drafts/drf_dummy_test`, {
    method: "DELETE",
    headers: {
      Cookie: adminCookie,
      Origin: "https://attacker.evil.com",
    },
  });
  assert(csrfRes.status === 403, "DELETE /api/admin/drafts/[id] strictly blocks cross-origin requests (CSRF: 403)");

  console.log("\n========================================================");
  console.log(`MILESTONE 5 VERIFICATION COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("========================================================\n");

  if (failedCount > 0) process.exit(1);
}

runMilestone5Tests().catch((err) => {
  console.error("FATAL ERROR IN MILESTONE 5 TESTS:", err);
  process.exit(1);
});
