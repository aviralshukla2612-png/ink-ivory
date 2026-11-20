/**
 * Ink & Ivory — Milestone 4: Dynamic Template Builder & Registry Test Suite
 *
 * Verifies all Milestone 4 requirements:
 * 1. GET /api/admin/templates/[id]/builder - loads template config, renderer spec, sections & versions
 * 2. PUT /api/admin/templates/[id]/builder - saves sections, designConfig, creates version snapshot
 * 3. PUT /api/admin/templates/[id]/sections/reorder - reorders section display sequence
 * 4. GET /api/admin/templates/[id]/versions - lists immutable version snapshots
 * 5. POST /api/admin/templates/[id]/versions/restore - rolls back to previous snapshot
 * 6. RBAC permissions - CONTENT_MANAGER authorized, FINANCE forbidden (403)
 * 7. CSRF Origin defense on builder mutations
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

async function runMilestone4Tests() {
  console.log("\n========================================================");
  console.log("   INK & IVORY — MILESTONE 4: TEMPLATE BUILDER TESTS    ");
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

  // Pick a base template: tpl-engagement-garden-03 (Thirumanam Temple)
  const templateId = "tpl-engagement-garden-03";

  // 2. GET Builder Data
  console.log("\n--- 2. Validating GET /builder Configuration ---");
  const builderRes = await fetch(`${BASE_URL}/api/admin/templates/${templateId}/builder`, {
    headers: { Cookie: adminCookie },
  });
  assert(builderRes.status === 200, "GET /api/admin/templates/[id]/builder returns 200 OK");
  const builderData = await builderRes.json();
  assert(builderData.success === true, "Response has success: true");
  assert(Boolean(builderData.data.template), "Response contains template object");
  assert(Array.isArray(builderData.data.sections) && builderData.data.sections.length > 0, "Response contains auto-populated sections from approved renderer");
  assert(typeof builderData.data.currentVersion === "number", "Response provides currentVersion number");

  const initialSections = builderData.data.sections;
  const initialSectionCount = initialSections.length;

  // 3. PUT Builder: Update Sections & Fields + Create Snapshot
  console.log("\n--- 3. Testing Builder Configuration Save & Version Snapshot ---");
  const updatedSections = initialSections.map((s, idx) => ({
    ...s,
    title: idx === 0 ? "Grand Welcoming & Sacred Nadaswaram" : s.title,
    isEnabled: true,
  }));

  const saveRes = await fetch(`${BASE_URL}/api/admin/templates/${templateId}/builder`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      sections: updatedSections,
      defaultFields: {
        headline: "Sacred Thirumanam Celebration",
        names: "Karthik & Meenakshi Sundaram",
        date: "Sunday, 14 February 2027",
        venue: "Sri Meenakshi Kalyana Mandapam",
      },
      designConfig: {
        themeColor: "#0A251E",
        accentColor: "#E5B942",
        fontFamily: "Cinzel",
      },
      changeSummary: "Added sacred nadaswaram opening and updated gold theme palette",
    }),
  });

  const saveData = await saveRes.json();
  assert(saveRes.status === 200 && saveData.success === true, "PUT /builder saved configuration and created version snapshot");
  assert(saveData.data.version && saveData.data.version.versionNumber >= 1, "New snapshot created with valid versionNumber");
  assert(saveData.data.template.defaultFields.headline === "Sacred Thirumanam Celebration", "Template defaultFields successfully updated");

  const createdVersionNumber = saveData.data.version.versionNumber;

  // 4. PUT Sections Reorder
  console.log("\n--- 4. Testing Section Reorder Operation ---");
  const reorderedList = [...updatedSections].reverse().map((s, idx) => ({
    id: s.id,
    order: idx + 1,
  }));

  const reorderRes = await fetch(`${BASE_URL}/api/admin/templates/${templateId}/sections/reorder`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      sectionOrders: reorderedList,
    }),
  });
  const reorderData = await reorderRes.json();
  assert(reorderRes.status === 200 && reorderData.success === true, "PUT /sections/reorder updated display sequence");
  assert(reorderData.data[0].id === reorderedList[0].id, "First section reflects newly inverted order");

  // 5. GET Versions History
  console.log("\n--- 5. Testing Version History Listing ---");
  const versionsRes = await fetch(`${BASE_URL}/api/admin/templates/${templateId}/versions`, {
    headers: { Cookie: adminCookie },
  });
  assert(versionsRes.status === 200, "GET /versions returns 200 OK");
  const versionsData = await versionsRes.json();
  assert(Array.isArray(versionsData.data) && versionsData.data.length >= 1, "Versions list contains snapshot history");

  // 6. Restore Previous Version
  console.log("\n--- 6. Testing Version Snapshot Rollback (Restore) ---");
  const restoreRes = await fetch(`${BASE_URL}/api/admin/templates/${templateId}/versions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      versionNumber: createdVersionNumber,
    }),
  });
  const restoreData = await restoreRes.json();
  assert(restoreRes.status === 200 && restoreData.success === true, `POST /versions/restore rolled back to v${createdVersionNumber}`);
  assert(restoreData.data.restoredVersion.versionNumber === createdVersionNumber, "Restored version verified in response");

  // 7. RBAC Role Enforcement on Builder Mutations
  console.log("\n--- 7. Testing RBAC Role Enforcement on Builder ---");
  const cmCookie = createAdminToken("CONTENT_MANAGER", "usr_content_mgr");
  const finCookie = createAdminToken("FINANCE", "usr_fin_mgr");

  const cmBuilderRes = await fetch(`${BASE_URL}/api/admin/templates/${templateId}/builder`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: cmCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      changeSummary: "Content manager tweak",
    }),
  });
  assert(cmBuilderRes.status === 200, "CONTENT_MANAGER authorized to modify template builder (TEMPLATES_MANAGE)");

  const finBuilderRes = await fetch(`${BASE_URL}/api/admin/templates/${templateId}/builder`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: finCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      changeSummary: "Finance illegal edit",
    }),
  });
  assert(finBuilderRes.status === 403, "FINANCE role strictly blocked from builder mutations with 403 Forbidden");

  // 8. CSRF Origin Defense
  console.log("\n--- 8. Testing CSRF Origin Defense on Builder ---");
  const csrfRes = await fetch(`${BASE_URL}/api/admin/templates/${templateId}/builder`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: "https://attacker-domain.evil.com",
    },
    body: JSON.stringify({
      changeSummary: "Cross site attack",
    }),
  });
  assert(csrfRes.status === 403, "PUT /builder strictly blocks cross-origin requests (CSRF defense: 403)");

  console.log("\n========================================================");
  console.log(`MILESTONE 4 VERIFICATION COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("========================================================\n");

  if (failedCount > 0) process.exit(1);
}

runMilestone4Tests().catch((err) => {
  console.error("FATAL ERROR IN MILESTONE 4 TESTS:", err);
  process.exit(1);
});
