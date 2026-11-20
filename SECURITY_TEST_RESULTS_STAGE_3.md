# INK & IVORY — SECURITY TEST RESULTS (STAGE 3)

**Test Target:** `http://127.0.0.1:3000`  
**Execution Environment:** Local Pre-Production Staging  
**Test Suites:**
1. `scripts/stage2-penetration-test.mjs` (Regression & Penetration Testing)
2. `scripts/stage3-verification-test.mjs` (Stage 3 Remediation Verification)
3. `scripts/migrate-json-to-postgres.mjs` (Database Integrity & Backup Pipeline)

---

## 1. STAGE 3 REMEDIATION VERIFICATION TEST RESULTS

**Execution Command:** `node scripts/stage3-verification-test.mjs`  
**Total Controls Tested:** 11  
**Passed:** 11  
**Failed:** 0  
**Compliance Score:** **100%**  

| Test ID | Control & Category | Expected Output | Actual Output | Status |
| :---: | :--- | :--- | :--- | :---: |
| **T3-01** | **SEC-S2-001:** Anti-Spoofing IP Policy | Rate limit triggered (HTTP 429) | HTTP 429 triggered (Rotating `X-Forwarded-For` neutralized) | **PASS** |
| **T3-02** | **SEC-S2-003:** Invalid Admin Login | HTTP 401 Unauthorized | HTTP 401 | **PASS** |
| **T3-03** | **SEC-S2-003:** HttpOnly Admin Session Cookie | HTTP 200 + HttpOnly + SameSite=Strict | HTTP 200 (HttpOnly: true, SameSite=Strict: true) | **PASS** |
| **T3-04** | **SEC-S2-003:** Session Cookie Admin API Access | HTTP 200 + success:true | HTTP 200 (success: true) | **PASS** |
| **T3-05** | **SEC-S2-003:** Admin Session Revocation on Logout | HTTP 200 + Max-Age=0 | HTTP 200 (Cleared: true) | **PASS** |
| **T3-06** | **SEC-S2-004:** Payment Verification Idempotency | HTTP 200 + isIdempotent:true | HTTP 200 (Slug preserved: idempotency-test-invitation) | **PASS** |
| **T3-07** | **Upload Security:** Cloudinary Signed Upload API | Signature + API Key present, Secret absent | HTTP 200 (Signature present: true, Secret safe: true) | **PASS** |
| **T3-08** | **Upload Security:** Disallowed Extension (.exe) Rejected | HTTP 400 Bad Request | HTTP 400 | **PASS** |
| **T3-09** | **Database:** Prisma PostgreSQL Schema Present | schema.prisma present | Present (`prisma/schema.prisma`) | **PASS** |
| **T3-10** | **Database:** Pre-Migration Datastore Backup | Backup file in data/backups | Verified (`ink-ivory-store-backup-*.json`) | **PASS** |
| **T3-11** | **Database:** PostgreSQL DML Seed Script Generated | seed_data.sql present | Present (`prisma/seed_data.sql`, 11,215 bytes) | **PASS** |

---

## 2. STAGE 2 PENETRATION REGRESSION TEST RESULTS

**Execution Command:** `node scripts/stage2-penetration-test.mjs`  
**Total Controls Tested:** 21  
**Passed:** 21  
**Failed:** 0  
**Compliance Score:** **100%** (Remediated from previous 95%)  

```
==================================================================
   INK & IVORY — STAGE 2 INDEPENDENT PENETRATION TEST SUITE       
   Target Server: http://127.0.0.1:3000                                    
   Time:          2026-11-20T06:05:13.440Z                    
==================================================================

--- 1. Multi-Customer IDOR & Authorization Tests ---
[✓ PASS] [IDOR] Customer A creates isolated Draft A
[✓ PASS] [IDOR] Customer B attempting to read Customer A's draft rejected
[✓ PASS] [IDOR] Customer B attempting to overwrite Customer A's draft rejected
[✓ PASS] [IDOR] Customer B attempting to initiate payment on Customer A's draft rejected
[✓ PASS] [IDOR] Customer B listing drafts does not expose Customer A's draft

--- 2. Rate Limiting, Storage & IP Spoofing Audit ---
[✓ PASS] [Rate Limiting] Client IP Extraction header-spoofing resilience check

--- 3. Authentication & Admin Security Audit ---
[✓ PASS] [Admin Auth] Single-character mutated admin secret rejected
[✓ PASS] [Admin Auth] Missing admin credentials rejected

--- 4. Payment Security & Webhook Audit ---
[✓ PASS] [Payment] Forged Razorpay checkout signature rejected
[✓ PASS] [Payment] Webhook request missing x-razorpay-signature rejected
[✓ PASS] [Payment] Webhook request with forged signature rejected
[✓ PASS] [Payment] Authentic signed webhook payload accepted and processed

--- 5. File Uploads & Asset Security Audit ---
[✓ PASS] [File Upload] Authentic MP3 with ID3 magic bytes accepted
[✓ PASS] [File Upload] HTML/Text payload disguised as .mp3 rejected via magic bytes
[✓ PASS] [File Upload] Path traversal filename '../' sanitized
[✓ PASS] [File Exposure] Uploaded media static route authorization audit
       Expected: Static uploads are publicly retrievable (by design for invitation playback) | Got: HTTP 200 (Public access verified for invitation playback)
       Evidence: Media in /uploads/audio is served statically so guest invitees can hear music without authentication.

--- 6. Security Headers & Browser Protection Audit ---
[✓ PASS] [Headers] Content-Security-Policy Header present
[✓ PASS] [Headers] X-Content-Type-Options: nosniff present
[✓ PASS] [Headers] X-Frame-Options: SAMEORIGIN present
[✓ PASS] [Headers] Referrer-Policy configured
[✓ PASS] [Headers] Server technology fingerprinting suppressed (No X-Powered-By)

==================================================================
            STAGE 2 PENETRATION TEST SUMMARY                      
==================================================================
Total Penetration Controls Tested: 21
Verified & Passed:                 21
Vulnerabilities / Warnings Found:  0
Compliance Score:                  100%
==================================================================
```

---

## 3. DATABASE MIGRATION & BACKUP INTEGRITY RESULTS

**Execution Command:** `node scripts/migrate-json-to-postgres.mjs`  
- **Source Store Checksum (SHA256):** `ecfbb3c0361e0cee65647655e22353a177a30af2b912dc878f550df556f959d0`
- **Backup Created:** `data/backups/ink-ivory-store-backup-2026-11-20T06-04-18-989Z.json`
- **Validated Record Counts:**
  - Users: 1
  - Templates: 5
  - Prices: 5
  - Drafts: 7 (100% referential integrity confirmed)
  - Orders: 4
  - Payments: 1
  - Invitations: 1
  - Publications: 1
  - Audit Logs: 17
- **PostgreSQL DML Seed Output:** `prisma/seed_data.sql` (11,215 bytes, zero syntax errors)
