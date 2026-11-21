/**
 * Ink & Ivory — Milestone 8: Operations, Staff, Settings, Media & Audit Logs Test Suite
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

async function runMilestone8Tests() {
  console.log("\n========================================================");
  console.log("   INK & IVORY — MILESTONE 8: OPERATIONS & STAFF TESTS  ");
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

  // 2. Media Library Listing
  console.log("\n--- 2. Testing Media Library Listing ---");
  const mediaRes = await fetch(`${BASE_URL}/api/admin/media?page=1&limit=20`, {
    headers: { Cookie: adminCookie },
  });
  assert(mediaRes.status === 200, "GET /api/admin/media returns 200 OK");
  const mediaData = await mediaRes.json();
  assert(Array.isArray(mediaData.data) && mediaData.data.length > 0, "Media library returned aggregated media assets");
  const firstMedia = mediaData.data[0];
  assert(Boolean(firstMedia.url), `Found asset: ${firstMedia.name} (${firstMedia.type})`);

  // 2.1 Delete Media
  const deleteMediaRes = await fetch(`${BASE_URL}/api/admin/media/${encodeURIComponent(firstMedia.id)}`, {
    method: "DELETE",
    headers: {
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
  });
  assert(deleteMediaRes.status === 200, "DELETE /api/admin/media/[id] removes asset with 200 OK");

  // 3. Support Inquiries Workflow
  console.log("\n--- 3. Testing Support Inquiries System ---");
  const uniqueId = Date.now().toString().slice(-6);
  const ticketRes = await fetch(`${BASE_URL}/api/admin/support`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      customerEmail: `customer_${uniqueId}@gmail.com`,
      subject: `Urgent RSVP Question ${uniqueId}`,
      message: "Can we increase the guest limit on our royal invitation?",
      priority: "HIGH",
    }),
  });
  assert(ticketRes.status === 201, "POST /api/admin/support creates new ticket with 201 Created");
  const ticketData = await ticketRes.json();
  const ticketId = ticketData.data.id;
  assert(ticketData.data.priority === "HIGH", "Support ticket assigned HIGH priority");

  // 3.1 List tickets
  const listTicketsRes = await fetch(`${BASE_URL}/api/admin/support`, {
    headers: { Cookie: adminCookie },
  });
  assert(listTicketsRes.status === 200, "GET /api/admin/support returns 200 OK");
  const listTicketsData = await listTicketsRes.json();
  assert(listTicketsData.data.some((t) => t.id === ticketId), "Newly created support ticket in tickets list");

  // 3.2 Staff reply
  const replyRes = await fetch(`${BASE_URL}/api/admin/support/${encodeURIComponent(ticketId)}/reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      message: "Dear Guest, your invitation includes unlimited RSVP submissions and guest entries.",
    }),
  });
  assert(replyRes.status === 200, "POST /api/admin/support/[id]/reply appends staff reply");
  const replyData = await replyRes.json();
  assert(replyData.data.messages.length === 2, "Ticket contains threaded customer message and staff reply");

  // 3.3 Update ticket status
  const updateTicketRes = await fetch(`${BASE_URL}/api/admin/support/${encodeURIComponent(ticketId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      status: "RESOLVED",
      internalNotes: "Verified unlimited RSVP capability for client.",
    }),
  });
  assert(updateTicketRes.status === 200, "PATCH /api/admin/support/[id] updates status to RESOLVED");

  // 4. Staff & RBAC Management
  console.log("\n--- 4. Testing Staff & Role Management ---");
  const staffEmail = `specialist_${uniqueId}@inkandivory.com`;
  const createStaffRes = await fetch(`${BASE_URL}/api/admin/staff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      name: "Tanya Sen",
      email: staffEmail,
      role: "SUPPORT",
    }),
  });
  assert(createStaffRes.status === 201, "POST /api/admin/staff creates new staff account with 201 Created");
  const createStaffData = await createStaffRes.json();
  const staffId = createStaffData.data.id;
  assert(createStaffData.data.role === "SUPPORT", "Staff member created with SUPPORT role");

  // 4.1 Update staff role
  const updateStaffRes = await fetch(`${BASE_URL}/api/admin/staff/${encodeURIComponent(staffId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      role: "CONTENT_MANAGER",
    }),
  });
  assert(updateStaffRes.status === 200, "PATCH /api/admin/staff/[id] promotes staff to CONTENT_MANAGER");
  const updateStaffData = await updateStaffRes.json();
  assert(updateStaffData.data.role === "CONTENT_MANAGER", "Staff role updated to CONTENT_MANAGER");

  // 4.2 Delete staff
  const deleteStaffRes = await fetch(`${BASE_URL}/api/admin/staff/${encodeURIComponent(staffId)}`, {
    method: "DELETE",
    headers: {
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
  });
  assert(deleteStaffRes.status === 200, "DELETE /api/admin/staff/[id] removes staff member");

  // 5. Platform Settings
  console.log("\n--- 5. Testing Platform Settings Configuration ---");
  const settingsRes = await fetch(`${BASE_URL}/api/admin/settings`, {
    headers: { Cookie: adminCookie },
  });
  assert(settingsRes.status === 200, "GET /api/admin/settings returns 200 OK");
  const settingsData = await settingsRes.json();
  const name = settingsData.data?.platformName?.toLowerCase() || "";
  assert(
    name.includes("mine") || name.includes("ivory"),
    "Platform settings name is valid brand name ('You Are Mine' / 'Ink & Ivory')"
  );

  // 5.1 Update settings
  const updateSettingsRes = await fetch(`${BASE_URL}/api/admin/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      supportEmail: "royal.concierge@inkandivory.com",
    }),
  });
  assert(updateSettingsRes.status === 200, "PUT /api/admin/settings updates settings");
  const updateSettingsData = await updateSettingsRes.json();
  assert(updateSettingsData.data.supportEmail === "royal.concierge@inkandivory.com", "Support email updated in datastore");

  // 6. Audit Logs Stream
  console.log("\n--- 6. Testing Immutable Audit Logs Stream ---");
  const auditRes = await fetch(`${BASE_URL}/api/admin/audit?page=1&limit=25`, {
    headers: { Cookie: adminCookie },
  });
  assert(auditRes.status === 200, "GET /api/admin/audit returns 200 OK");
  const auditData = await auditRes.json();
  assert(Array.isArray(auditData.data) && auditData.data.length > 0, "Audit logs returned chronological events");
  const recentAction = auditData.data[0];
  assert(Boolean(recentAction.action && recentAction.userId), `Recent audit event: ${recentAction.action} by ${recentAction.userId}`);

  // 7. RBAC Role Restrictions
  console.log("\n--- 7. Testing RBAC Role Enforcement on Operations ---");
  const supportCookie = createAdminToken("SUPPORT", "usr_support_1");

  const supportStaffRes = await fetch(`${BASE_URL}/api/admin/staff`, {
    headers: { Cookie: supportCookie },
  });
  assert(supportStaffRes.status === 403, "SUPPORT role strictly blocked from viewing staff directory (STAFF_MANAGE: 403)");

  const supportSettingsRes = await fetch(`${BASE_URL}/api/admin/settings`, {
    headers: { Cookie: supportCookie },
  });
  assert(supportSettingsRes.status === 403, "SUPPORT role strictly blocked from settings (SETTINGS_MANAGE: 403)");

  // 8. CSRF Protection
  console.log("\n--- 8. Testing CSRF Origin Defense on Operations ---");
  const csrfStaffRes = await fetch(`${BASE_URL}/api/admin/staff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: "https://untrusted-hacker.com",
    },
    body: JSON.stringify({ name: "Hacker", email: "hacker@evil.com", role: "SUPER_ADMIN" }),
  });
  assert(csrfStaffRes.status === 403, "POST /staff strictly blocks cross-origin requests (CSRF: 403)");

  console.log("\n========================================================");
  console.log(`MILESTONE 8 VERIFICATION COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("========================================================\n");

  if (failedCount > 0) process.exit(1);
}

runMilestone8Tests().catch((err) => {
  console.error("FATAL ERROR IN MILESTONE 8 TESTS:", err);
  process.exit(1);
});
