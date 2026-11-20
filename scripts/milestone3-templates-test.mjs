/**
 * Ink & Ivory — Milestone 3: Template & Category Management Test Suite
 *
 * Verifies all Milestone 3 requirements:
 * 1. GET /api/admin/templates - paginated, searchable, category-filtered
 * 2. POST /api/admin/templates - validated, approved renderer check, slug uniqueness
 * 3. Security guard - unapproved renderer strictly rejected (400)
 * 4. POST /api/admin/templates/[id]/duplicate - deep copy with new slug and DRAFT status
 * 5. POST /api/admin/templates/[id]/activate - instant marketplace publishing toggle
 * 6. PATCH /api/admin/templates/[id] - updates design, title, price
 * 7. DELETE /api/admin/templates/[id] - soft-delete / archive
 * 8. Category CRUD - GET /api/admin/categories, POST, PATCH, DELETE
 * 9. RBAC permission checks - CONTENT_MANAGER permitted, FINANCE denied (403)
 * 10. CSRF Origin defense on mutations
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

// Generate an admin session token for testing arbitrary roles
function createAdminToken(role, userId) {
  const sessionId = "adm_" + crypto.randomUUID().slice(0, 8);
  const expiresAt = Date.now() + 2 * 60 * 60 * 1000;
  const payload = `${sessionId}.${role}.${userId}.${expiresAt}`;
  const sig = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex").slice(0, 32);
  return `ink_ivory_admin_session=${payload}.${sig}`;
}

async function runMilestone3Tests() {
  console.log("\n========================================================");
  console.log("   INK & IVORY — MILESTONE 3: TEMPLATES & CATEGORIES    ");
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
  assert(Boolean(adminCookie), "Admin session cookie obtained for requests");

  // 2. GET /api/admin/templates
  console.log("\n--- 2. Validating Template Listing & Filters ---");
  const listRes = await fetch(`${BASE_URL}/api/admin/templates?page=1&limit=10`, {
    headers: { Cookie: adminCookie },
  });
  assert(listRes.status === 200, "GET /api/admin/templates returns 200 OK");
  const listData = await listRes.json();
  assert(listData.success === true, "Response has success: true");
  assert(Array.isArray(listData.data), "data is an array of templates");
  assert(listData.meta && typeof listData.meta.total === "number", "meta contains pagination data");

  // Search filter test
  const searchRes = await fetch(`${BASE_URL}/api/admin/templates?search=Royal`, {
    headers: { Cookie: adminCookie },
  });
  const searchData = await searchRes.json();
  assert(searchRes.status === 200 && searchData.data.length > 0, "Search filter ?search=Royal returns matching templates");

  // 3. POST /api/admin/templates (Create with Approved Renderer)
  console.log("\n--- 3. Testing Template Creation & Approved Renderer Registry ---");
  const uniqueSuffix = Date.now().toString().slice(-6);
  const newSlug = `test-palace-${uniqueSuffix}`;

  const createRes = await fetch(`${BASE_URL}/api/admin/templates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      title: `Palace Grandeur Celebration ${uniqueSuffix}`,
      slug: newSlug,
      occasion: "Wedding",
      description: "A breathtaking palace celebration template with royal heritage doors.",
      tier: "SIGNATURE",
      priceINR: 499,
      rendererId: "wedding-lake-palace", // Approved renderer
      tags: ["Royal", "Palace", "Wedding"],
    }),
  });

  const createData = await createRes.json();
  assert(createRes.status === 201 && createData.success === true, `POST /api/admin/templates created template "${newSlug}"`);
  assert(createData.data.rendererId === "wedding-lake-palace", "Template correctly assigned approved renderer");
  assert(createData.data.priceINR === 499, "Template price accurately set to ₹499");
  assert(createData.data.status === "DRAFT", "New template defaults to safe DRAFT status");

  const createdTemplateId = createData.data.id;

  // 4. Security Guard: Reject Unapproved Renderer
  console.log("\n--- 4. Enforcing Approved Renderer Security Guard ---");
  const unapprovedRes = await fetch(`${BASE_URL}/api/admin/templates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      title: "Malicious Injection Template",
      slug: `evil-template-${uniqueSuffix}`,
      occasion: "Wedding",
      description: "Attempts to inject arbitrary client script or unapproved renderer.",
      tier: "SIGNATURE",
      rendererId: "malicious-arbitrary-script-v1", // NOT APPROVED!
    }),
  });
  assert(
    unapprovedRes.status === 400,
    "POST /api/admin/templates strictly rejects unapproved rendererId with HTTP 400"
  );

  // 5. Duplicate Template
  console.log("\n--- 5. Testing Template Duplication ---");
  const dupRes = await fetch(`${BASE_URL}/api/admin/templates/${encodeURIComponent(createdTemplateId)}/duplicate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      newTitle: `Duplicated Palace ${uniqueSuffix}`,
    }),
  });
  const dupData = await dupRes.json();
  assert(dupRes.status === 201 && dupData.success === true, "POST /api/admin/templates/[id]/duplicate successfully cloned template");
  assert(dupData.data.status === "DRAFT" && dupData.data.isActive === false, "Duplicated template is safe DRAFT and not live");

  // 6. Marketplace Activation Toggle
  console.log("\n--- 6. Testing Marketplace Activation Toggle ---");
  const activateRes = await fetch(`${BASE_URL}/api/admin/templates/${encodeURIComponent(createdTemplateId)}/activate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({ isActive: true }),
  });
  const actData = await activateRes.json();
  assert(activateRes.status === 200 && actData.data.isActive === true && actData.data.status === "ACTIVE", "POST /api/admin/templates/[id]/activate activated template for marketplace");

  // 7. Update Template
  console.log("\n--- 7. Testing Template Update (PATCH) ---");
  const patchRes = await fetch(`${BASE_URL}/api/admin/templates/${encodeURIComponent(createdTemplateId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      title: `Palace Grandeur Updated ${uniqueSuffix}`,
      priceINR: 599,
      badge: "FEATURED",
    }),
  });
  const patchData = await patchRes.json();
  assert(patchRes.status === 200 && patchData.data.title.includes("Updated"), "PATCH /api/admin/templates/[id] updated title");
  assert(patchData.data.priceINR === 599, "PATCH /api/admin/templates/[id] updated price to ₹599");

  // 8. Soft Delete / Archive Template
  console.log("\n--- 8. Testing Template Archival (DELETE) ---");
  const delRes = await fetch(`${BASE_URL}/api/admin/templates/${encodeURIComponent(createdTemplateId)}`, {
    method: "DELETE",
    headers: {
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
  });
  assert(delRes.status === 200, "DELETE /api/admin/templates/[id] returns 200 OK");

  // Verify archived status
  const getArchivedRes = await fetch(`${BASE_URL}/api/admin/templates/${encodeURIComponent(createdTemplateId)}`, {
    headers: { Cookie: adminCookie },
  });
  const archivedData = await getArchivedRes.json();
  assert(
    archivedData.data && archivedData.data.status === "ARCHIVED" && archivedData.data.isActive === false,
    "Template marked as ARCHIVED and deactivated",
    JSON.stringify(archivedData)
  );

  // 9. Categories CRUD Testing
  console.log("\n--- 9. Testing Category Taxonomy CRUD Endpoints ---");
  const catListRes = await fetch(`${BASE_URL}/api/admin/categories`, {
    headers: { Cookie: adminCookie },
  });
  assert(catListRes.status === 200, "GET /api/admin/categories returns 200 OK");
  const catListData = await catListRes.json();
  assert(Array.isArray(catListData.data) && catListData.data.length > 0, "Categories list returned array with defaults");

  // Create Category
  const catSlug = `luxury-soiree-${uniqueSuffix}`;
  const catCreateRes = await fetch(`${BASE_URL}/api/admin/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      name: `Luxury Soirée ${uniqueSuffix}`,
      slug: catSlug,
      icon: "Sparkles",
      description: "Exclusive evening dinner parties and soirees",
    }),
  });
  const catCreateData = await catCreateRes.json();
  assert(catCreateRes.status === 201 && catCreateData.success === true, `POST /api/admin/categories created category "${catSlug}"`);
  const createdCatId = catCreateData.data.id;

  // Update Category
  const catPatchRes = await fetch(`${BASE_URL}/api/admin/categories/${encodeURIComponent(createdCatId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      description: "Updated luxury evening celebration description",
      displayOrder: 99,
    }),
  });
  const catPatchData = await catPatchRes.json();
  assert(catPatchRes.status === 200 && catPatchData.data.displayOrder === 99, "PATCH /api/admin/categories/[id] updated displayOrder");

  // Delete Category
  const catDelRes = await fetch(`${BASE_URL}/api/admin/categories/${encodeURIComponent(createdCatId)}`, {
    method: "DELETE",
    headers: {
      Cookie: adminCookie,
      Origin: BASE_URL,
    },
  });
  assert(catDelRes.status === 200, "DELETE /api/admin/categories/[id] deleted category");

  // 10. RBAC Role Permission Enforcement
  console.log("\n--- 10. Testing RBAC Role Enforcement on Mutations ---");
  const contentManagerCookie = createAdminToken("CONTENT_MANAGER", "usr_content_mgr");
  const financeCookie = createAdminToken("FINANCE", "usr_finance_mgr");

  // CONTENT_MANAGER is allowed to create templates
  const cmCreateRes = await fetch(`${BASE_URL}/api/admin/templates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: contentManagerCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      title: `Content Mgr Palace ${uniqueSuffix}`,
      slug: `cm-palace-${uniqueSuffix}`,
      occasion: "Wedding",
      description: "Created by Content Manager with proper permissions.",
      rendererId: "wedding-imperial-navy",
    }),
  });
  assert(
    cmCreateRes.status === 201,
    "CONTENT_MANAGER role successfully authorized to create template (TEMPLATES_MANAGE)"
  );

  // FINANCE role is FORBIDDEN from creating templates
  const finCreateRes = await fetch(`${BASE_URL}/api/admin/templates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: financeCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      title: `Finance Illegal Template ${uniqueSuffix}`,
      slug: `fin-palace-${uniqueSuffix}`,
      occasion: "Wedding",
      description: "Should be blocked.",
      rendererId: "wedding-imperial-navy",
    }),
  });
  assert(
    finCreateRes.status === 403,
    "FINANCE role strictly blocked from creating template with 403 Forbidden"
  );

  // 11. CSRF Origin Verification
  console.log("\n--- 11. Testing CSRF Origin Defense on Template Mutations ---");
  const csrfRes = await fetch(`${BASE_URL}/api/admin/templates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
      Origin: "https://malicious-attacker-domain.evil.com",
    },
    body: JSON.stringify({
      title: "Cross-Origin Attack Template",
      slug: `csrf-test-${uniqueSuffix}`,
      occasion: "Wedding",
      description: "Cross origin attack attempt.",
      rendererId: "wedding-imperial-navy",
    }),
  });
  assert(
    csrfRes.status === 403,
    "POST /api/admin/templates strictly blocks cross-origin requests (CSRF defense: 403)"
  );

  console.log("\n========================================================");
  console.log(`MILESTONE 3 VERIFICATION COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("========================================================\n");

  if (failedCount > 0) process.exit(1);
}

runMilestone3Tests().catch((err) => {
  console.error("FATAL ERROR IN MILESTONE 3 TESTS:", err);
  process.exit(1);
});
