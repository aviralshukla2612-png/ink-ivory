/**
 * INK & IVORY — AUTOMATED SECURITY AUDIT & PENETRATION TEST SUITE (Node Native)
 */

const BASE_URL = process.env.TEST_APP_URL || "http://127.0.0.1:3000";
const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || "ink_ivory_admin_key_replace_with_high_entropy_secret_2026";

const results = [];

function record(suite, test, passed, expected, actual, details) {
  results.push({ suite, test, passed, expected, actual, details });
  const status = passed ? "✓ PASS" : "✗ FAIL";
  console.log(`[${status}] [${suite}] ${test} (Expected: ${expected}, Got: ${actual})`);
}

async function runTests() {
  console.log("==========================================================");
  console.log("  INK & IVORY — SECURITY AUDIT & VERIFICATION TEST SUITE  ");
  console.log(`  Target: ${BASE_URL}                                     `);
  console.log(`  Time:   ${new Date().toISOString()}                     `);
  console.log("==========================================================\n");

  // ----------------------------------------------------
  // TEST SUITE 1: SECURITY HEADERS & FINGERPRINTING
  // ----------------------------------------------------
  console.log("--- 1. Security Headers Audit ---");
  try {
    const res = await fetch(`${BASE_URL}/`, { method: "GET" });
    const csp = res.headers.get("content-security-policy");
    const nosniff = res.headers.get("x-content-type-options");
    const frameOptions = res.headers.get("x-frame-options");
    const referrer = res.headers.get("referrer-policy");
    const poweredBy = res.headers.get("x-powered-by");

    record("Headers", "Content-Security-Policy Present", !!csp && csp.includes("default-src 'self'"), "Present", csp ? "Present" : "Missing");
    record("Headers", "X-Content-Type-Options: nosniff", nosniff === "nosniff", "nosniff", nosniff || "Missing");
    record("Headers", "X-Frame-Options: SAMEORIGIN", frameOptions === "SAMEORIGIN", "SAMEORIGIN", frameOptions || "Missing");
    record("Headers", "Referrer-Policy Configured", !!referrer, "strict-origin-when-cross-origin", referrer || "Missing");
    record("Headers", "Technology Fingerprint Concealed (No X-Powered-By)", !poweredBy, "Undefined", poweredBy || "Undefined");
  } catch (err) {
    record("Headers", "Headers check", false, "Headers returned", err.message);
  }

  // ----------------------------------------------------
  // TEST SUITE 2: ADMIN AUTHENTICATION & ACCESS CONTROL
  // ----------------------------------------------------
  console.log("\n--- 2. Admin Authentication & Authorization Audit ---");
  try {
    // 2.1 Unauthenticated access to /api/admin
    const resNoAuth = await fetch(`${BASE_URL}/api/admin`, { method: "GET" });
    record("Admin Auth", "Unauthenticated GET /api/admin rejected", resNoAuth.status === 401, "401", String(resNoAuth.status));

    // 2.2 Invalid key to /api/admin
    const resBadAuth = await fetch(`${BASE_URL}/api/admin`, {
      method: "GET",
      headers: { "x-admin-key": "invalid_hacker_key_999" },
    });
    record("Admin Auth", "Invalid Key GET /api/admin rejected", resBadAuth.status === 401, "401", String(resBadAuth.status));

    // 2.3 Valid key to /api/admin
    const resValidAuth = await fetch(`${BASE_URL}/api/admin`, {
      method: "GET",
      headers: { "x-admin-key": ADMIN_KEY },
    });
    const validData = await resValidAuth.json();
    record("Admin Auth", "Valid Key GET /api/admin allowed", resValidAuth.status === 200 && validData.success === true, "200 + success:true", `${resValidAuth.status} + success:${validData.success}`);

    // 2.4 Unauthenticated price change attempt
    const resPriceNoAuth = await fetch(`${BASE_URL}/api/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-price", templateId: "tpl-date-planner-07", amountPaise: 100 }),
    });
    record("Admin Auth", "Unauthenticated Price Change Rejected", resPriceNoAuth.status === 401, "401", String(resPriceNoAuth.status));
  } catch (err) {
    record("Admin Auth", "Admin API testing error", false, "200/401", err.message);
  }

  // ----------------------------------------------------
  // TEST SUITE 3: IDOR & DRAFT OWNERSHIP CONTROL
  // ----------------------------------------------------
  console.log("\n--- 3. Authorization & IDOR Protection Audit ---");
  let legitimateDraftId = "";
  const legitToken = "gst_owner_legitimate_user_token_12345";
  const attackerToken = "gst_attacker_unauthorized_token_99999";

  try {
    // 3.1 Legitimate user creates draft
    const createRes = await fetch(`${BASE_URL}/api/drafts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-guest-token": legitToken,
      },
      body: JSON.stringify({
        templateId: "tpl-date-planner-07",
        title: "Confidential Anniversary Plan",
        fields: { names: "Riya & Aarav", secretNotes: "Private Surprise Hotel" },
      }),
    });
    const createData = await createRes.json();
    legitimateDraftId = createData.draft?.id;
    record("IDOR", "Legitimate Draft Created", createRes.status === 200 && !!legitimateDraftId, "200", String(createRes.status));

    // 3.2 Attacker attempts to read legitimate draft
    if (legitimateDraftId) {
      const idorReadRes = await fetch(`${BASE_URL}/api/drafts/${legitimateDraftId}`, {
        method: "GET",
        headers: { "x-guest-token": attackerToken },
      });
      record("IDOR", "Attacker Cannot Read Another User's Draft", idorReadRes.status === 403, "403", String(idorReadRes.status));

      // 3.3 Attacker attempts to modify legitimate draft
      const idorWriteRes = await fetch(`${BASE_URL}/api/drafts/${legitimateDraftId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-guest-token": attackerToken,
        },
        body: JSON.stringify({ title: "Hacked by Attacker" }),
      });
      record("IDOR", "Attacker Cannot Modify Another User's Draft", idorWriteRes.status === 403, "403", String(idorWriteRes.status));

      // 3.4 Attacker attempts to create payment order for victim's draft
      const idorOrderRes = await fetch(`${BASE_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-guest-token": attackerToken,
        },
        body: JSON.stringify({ draftId: legitimateDraftId }),
      });
      record("IDOR", "Attacker Cannot Initiate Payment for Victim's Draft", idorOrderRes.status === 403, "403", String(idorOrderRes.status));

      // 3.5 Legitimate owner can read their own draft
      const legitReadRes = await fetch(`${BASE_URL}/api/drafts/${legitimateDraftId}`, {
        method: "GET",
        headers: { "x-guest-token": legitToken },
      });
      record("IDOR", "Legitimate Owner Access Granted", legitReadRes.status === 200, "200", String(legitReadRes.status));
    }
  } catch (err) {
    record("IDOR", "Draft ownership tests", false, "Protected", err.message);
  }

  // ----------------------------------------------------
  // TEST SUITE 4: PAYMENT SECURITY & SIGNATURE VERIFICATION
  // ----------------------------------------------------
  console.log("\n--- 4. Payment Security & Signature Verification Audit ---");
  try {
    // 4.1 Forged payment verification signature rejected
    const fakeVerifyRes = await fetch(`${BASE_URL}/api/payments/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-guest-token": legitToken,
      },
      body: JSON.stringify({
        orderId: "order_fake_123456",
        paymentId: "pay_fake_999999",
        signature: "fake_spoofed_signature_00000000000000000000000000000000",
        draftId: legitimateDraftId || "non_existent_draft",
      }),
    });
    record("Payment", "Forged Payment Signature Rejected", fakeVerifyRes.status === 400, "400", String(fakeVerifyRes.status));

    // 4.2 Malformed payment verification payload rejected
    const badPayloadRes = await fetch(`${BASE_URL}/api/payments/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-guest-token": legitToken,
      },
      body: JSON.stringify({ orderId: "short" }),
    });
    record("Payment", "Malformed Verification Payload Rejected (Zod)", badPayloadRes.status === 400, "400", String(badPayloadRes.status));
  } catch (err) {
    record("Payment", "Payment tests", false, "Rejected", err.message);
  }

  // ----------------------------------------------------
  // TEST SUITE 5: FILE UPLOAD & MAGIC BYTE VALIDATION
  // ----------------------------------------------------
  console.log("\n--- 5. File Upload & Magic Byte Security Audit ---");
  try {
    // 5.1 Valid MP3 audio upload with ID3 header
    const validMp3Buffer = Buffer.from([
      0x49, 0x44, 0x33, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0xff, 0xfb, 0x90, 0x64, 0x00, 0x00,
    ]);
    const formDataValid = new FormData();
    formDataValid.append("file", new Blob([validMp3Buffer], { type: "audio/mpeg" }), "wedding_song.mp3");

    const validUploadRes = await fetch(`${BASE_URL}/api/upload/audio`, {
      method: "POST",
      body: formDataValid,
    });
    const validUploadData = await validUploadRes.json();
    record("Upload", "Authentic Audio Upload with Magic Bytes Accepted", validUploadRes.status === 200 && validUploadData.success === true, "200 + success:true", `${validUploadRes.status} + success:${validUploadData.success}`);

    // 5.2 Malicious / Spoofed File Upload (Text/Script disguised as .mp3)
    const fakeMp3Buffer = Buffer.from("<?php echo 'malicious payload'; ?>", "utf8");
    const formDataFake = new FormData();
    formDataFake.append("file", new Blob([fakeMp3Buffer], { type: "audio/mpeg" }), "exploit.mp3");

    const fakeUploadRes = await fetch(`${BASE_URL}/api/upload/audio`, {
      method: "POST",
      body: formDataFake,
    });
    const fakeUploadData = await fakeUploadRes.json();
    record("Upload", "Disguised File Lacking Audio Signature Rejected", fakeUploadRes.status === 400 && fakeUploadData.success === false, "400 + success:false", `${fakeUploadRes.status} + success:${fakeUploadData.success}`);

    // 5.3 Unsupported File Extension (.exe / .sh)
    const formDataExe = new FormData();
    formDataExe.append("file", new Blob([validMp3Buffer], { type: "application/octet-stream" }), "payload.exe");

    const exeUploadRes = await fetch(`${BASE_URL}/api/upload/audio`, {
      method: "POST",
      body: formDataExe,
    });
    record("Upload", "Executable Extension (.exe) Rejected", exeUploadRes.status === 400, "400", String(exeUploadRes.status));
  } catch (err) {
    record("Upload", "Upload security tests", false, "Protected", err.message);
  }

  // ----------------------------------------------------
  // TEST SUITE 6: RATE LIMITING & ABUSE PREVENTION
  // ----------------------------------------------------
  console.log("\n--- 6. Centralized Rate Limiting & Throttling Audit ---");
  try {
    const rateLimitIp = "192.168.100.42";
    let hitRateLimit = false;
    let rateLimitStatus = 0;
    let retryAfterHeader = "";

    // Send 7 rapid order creation requests from same IP (limit is 5 / 10 min)
    for (let i = 0; i < 7; i++) {
      const res = await fetch(`${BASE_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-real-ip": rateLimitIp,
          "cf-connecting-ip": rateLimitIp,
          "x-guest-token": "gst_ratelimit_tester_token",
        },
        body: JSON.stringify({ draftId: legitimateDraftId || "non_existent_for_rl" }),
      });

      if (res.status === 429) {
        hitRateLimit = true;
        rateLimitStatus = res.status;
        retryAfterHeader = res.headers.get("retry-after") || "";
        break;
      }
    }

    record("Rate Limit", "Excessive Requests Trigger HTTP 429 Too Many Requests", hitRateLimit, "429", String(rateLimitStatus));
    record("Rate Limit", "HTTP 429 Response Contains Retry-After Header", !!retryAfterHeader, "Retry-After Header", retryAfterHeader || "Missing");
  } catch (err) {
    record("Rate Limit", "Rate limiting test", false, "429 Triggered", err.message);
  }

  // ----------------------------------------------------
  // FINAL SCORECARD & SUMMARY
  // ----------------------------------------------------
  console.log("\n==========================================================");
  console.log("               SECURITY AUDIT TEST SUMMARY                ");
  console.log("==========================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  const scorePercent = Math.round((passed / total) * 100);

  console.log(`Total Controls Tested: ${total}`);
  console.log(`Passed:                ${passed}`);
  console.log(`Failed:                ${failed}`);
  console.log(`Compliance Score:      ${scorePercent}%\n`);

  if (failed === 0) {
    console.log("🎉 ALL SECURITY CONTROLS VERIFIED AND PASSED WITH 100% SUCCESS!");
  } else {
    console.log(`⚠️ ${failed} controls failed verification.`);
  }
}

runTests();
