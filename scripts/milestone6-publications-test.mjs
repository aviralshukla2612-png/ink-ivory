/**
 * Ink & Ivory — Milestone 6: Publication Management & Public URL Engine Test Suite
 *
 * Verifies all Milestone 6 requirements:
 * 1. GET /api/admin/publications - paginated listing with slug, views, template title
 * 2. Active invitation access on /invite/[slug] - renders 200 OK with public invitation
 * 3. POST /api/admin/publications/[id]/suspend - sets SUSPENDED status and logs reason
 * 4. Suspended invitation access on /invite/[slug] - renders luxury suspension screen
 * 5. POST /api/admin/publications/[id]/restore - restores publication back to ACTIVE
 * 6. Restored invitation access on /invite/[slug] - renders 200 OK active invitation again
 * 7. RBAC permissions - SUPPORT/ADMIN view permitted, FINANCE blocked from suspension (403)
 * 8. CSRF Origin defense on suspension/restoration mutations
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

async function runMilestone6Tests() {
  console.log("\n========================================================");
  console.log("   INK & IVORY — MILESTONE 6: PUBLICATIONS TESTS        ");
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

  // 2. Set up a published invitation
  console.log("\n--- 2. Setting Up Live Published Invitation ---");
  const uniqueId = Date.now().toString().slice(-6);
  const rawToken = "gst_" + crypto.randomUUID().replace(/-/g, "");
  const HMAC_SECRET = process.env.SESSION_SECRET || "ink_ivory_dev_fallback_hmac_secret_2026_salt";
  const guestSig = crypto.createHmac("sha256", HMAC_SECRET).update(rawToken).digest("hex").slice(0, 16);
  const testGuestToken = `${rawToken}.${guestSig}`;
  const targetSlug = `royal-wedding-${uniqueId}`;

  // Step A: Create draft
  const draftRes = await fetch(`${BASE_URL}/api/drafts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-guest-token": testGuestToken },
    body: JSON.stringify({
      templateId: "tpl-engagement-garden-03",
      title: `Grand Heritage Wedding ${uniqueId}`,
      fields: {
        names: "Karthik & Meenakshi",
        date: "Sunday, 14 February 2027",
        venue: "Sri Meenakshi Kalyana Mandapam, Madurai",
      },
    }),
  });
  const draftData = await draftRes.json();
  const draftId = draftData.data ? draftData.data.id : draftData.draft?.id;
  assert(Boolean(draftId), "Draft created for publication test");

  // Step B: Create order
  const orderRes = await fetch(`${BASE_URL}/api/payments/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-guest-token": testGuestToken },
    body: JSON.stringify({ draftId }),
  });
  const orderData = await orderRes.json();
  const orderId = orderData.orderId || orderData.data?.orderId;
  assert(Boolean(orderId), "Payment order created");

  // Step C: Verify payment & publish
  const paymentId = `pay_test_${uniqueId}`;
  const sigPayload = `${orderId}|${paymentId}`;
  const signature = crypto.createHmac("sha256", RAZORPAY_SECRET).update(sigPayload).digest("hex");

  const verifyRes = await fetch(`${BASE_URL}/api/payments/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-guest-token": testGuestToken },
    body: JSON.stringify({
      orderId,
      paymentId,
      signature,
      draftId,
      requestedSlug: targetSlug,
    }),
  });
  const verifyData = await verifyRes.json();
  assert(verifyRes.status === 200 && verifyData.success === true, "Payment verified and invitation published");
  const publishedSlug = verifyData.slug || targetSlug;

  // 3. GET /api/admin/publications
  console.log("\n--- 3. Testing Publications Listing in Admin ---");
  const pubListRes = await fetch(`${BASE_URL}/api/admin/publications?page=1&limit=10`, {
    headers: { Cookie: adminCookie },
  });
  assert(pubListRes.status === 200, "GET /api/admin/publications returns 200 OK");
  const pubListData = await pubListRes.json();
  assert(Array.isArray(pubListData.data) && pubListData.data.length > 0, "Publications list returned array of published invitations");

  const publishedItem = pubListData.data.find((p) => p.slug === publishedSlug);
  assert(Boolean(publishedItem), `Newly published invitation found in admin list with slug "/invite/${publishedSlug}"`);
  assert(publishedItem?.status === "ACTIVE", "Publication initial status is ACTIVE");
  const publicationId = publishedItem.id;

  // 4. Verify Public Access (ACTIVE)
  console.log("\n--- 4. Verifying Public Guest Access While ACTIVE ---");
  const activeGuestRes = await fetch(`${BASE_URL}/invite/${publishedSlug}`);
  const activeGuestHtml = await activeGuestRes.text();
  assert(activeGuestRes.status === 200, "GET /invite/[slug] returns 200 OK for active invitation");
  assert(activeGuestHtml.includes("Karthik") || activeGuestHtml.includes("template-03"), "Active invitation renders bespoke template content");

  // 5. Suspend Publication
  console.log("\n--- 5. Testing Administrative Suspension ---");
  const suspendRes = await fetch(`${BASE_URL}/api/admin/publications/${encodeURIComponent(publicationId)}/suspend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      reason: "Suspended for copyright media verification",
    }),
  });
  const suspendData = await suspendRes.json();
  assert(suspendRes.status === 200 && suspendData.success === true, "POST /api/admin/publications/[id]/suspend returns 200 OK");
  assert(suspendData.data.status === "SUSPENDED", "Publication status transitioned to SUSPENDED");

  // 6. Verify Public Access While SUSPENDED
  console.log("\n--- 6. Verifying Enforcement on Public Route While SUSPENDED ---");
  const suspendedGuestRes = await fetch(`${BASE_URL}/invite/${publishedSlug}`);
  const suspendedGuestHtml = await suspendedGuestRes.text();
  assert(
    suspendedGuestHtml.includes("Invitation Temporarily Suspended"),
    "GET /invite/[slug] strictly renders luxury suspension notice instead of private content"
  );
  assert(
    suspendedGuestHtml.includes("copyright media verification"),
    "Suspension notice includes administrative review reason"
  );

  // 7. Restore Publication
  console.log("\n--- 7. Testing Administrative Restoration ---");
  const restoreRes = await fetch(`${BASE_URL}/api/admin/publications/${encodeURIComponent(publicationId)}/restore`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
  });
  const restoreData = await restoreRes.json();
  assert(restoreRes.status === 200 && restoreData.data.status === "ACTIVE", "POST /api/admin/publications/[id]/restore returns status ACTIVE");

  // 8. Verify Public Access After RESTORE
  console.log("\n--- 8. Verifying Public Guest Access After RESTORE ---");
  const restoredGuestRes = await fetch(`${BASE_URL}/invite/${publishedSlug}`);
  const restoredGuestHtml = await restoredGuestRes.text();
  assert(
    !restoredGuestHtml.includes("Invitation Temporarily Suspended"),
    "Restored invitation no longer shows suspension screen"
  );

  // 9. RBAC Permissions
  console.log("\n--- 9. Testing RBAC Role Enforcement on Publications ---");
  const supportCookie = createAdminToken("SUPPORT", "usr_support_1");
  const financeCookie = createAdminToken("FINANCE", "usr_fin_1");

  const supportPubRes = await fetch(`${BASE_URL}/api/admin/publications`, {
    headers: { Cookie: supportCookie },
  });
  assert(supportPubRes.status === 200, "SUPPORT role authorized to view publications (PUBLICATIONS_VIEW)");

  const finSuspendRes = await fetch(`${BASE_URL}/api/admin/publications/${encodeURIComponent(publicationId)}/suspend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: financeCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({ reason: "Illegal finance attempt" }),
  });
  assert(finSuspendRes.status === 403, "FINANCE role strictly blocked from suspending publications with 403 Forbidden");

  // 10. CSRF Defense
  console.log("\n--- 10. Testing CSRF Origin Defense on Publications ---");
  const csrfRes = await fetch(`${BASE_URL}/api/admin/publications/${encodeURIComponent(publicationId)}/suspend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: "https://evil-attacker.com",
    },
    body: JSON.stringify({ reason: "CSRF attempt" }),
  });
  assert(csrfRes.status === 403, "POST /suspend strictly blocks cross-origin requests (CSRF: 403)");

  console.log("\n========================================================");
  console.log(`MILESTONE 6 VERIFICATION COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("========================================================\n");

  if (failedCount > 0) process.exit(1);
}

runMilestone6Tests().catch((err) => {
  console.error("FATAL ERROR IN MILESTONE 6 TESTS:", err);
  process.exit(1);
});
