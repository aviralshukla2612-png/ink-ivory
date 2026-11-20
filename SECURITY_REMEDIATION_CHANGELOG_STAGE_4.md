# INK & IVORY — SECURITY REMEDIATION CHANGELOG (STAGE 4)

**Version:** 3.1.0-PROD-VALIDATED  
**Date:** November 20, 2026  
**Auditor / Architect:** Principal Application Security Engineer & DevSecOps Specialist  

---

### STAGE 4 HARDENING & REMEDIATION SUMMARY

This changelog records the security improvements implemented during Stage 4 final technical verification:

---

### 1. SEC-S4-001: Fail-Closed Rate Limiting Policy on Sensitive Endpoints
- **Affected File:** `src/lib/security/rate-limit.ts`
- **Issue:** In the event of an Upstash Redis outage, all endpoints universally fell back to local in-memory rate limiting, which could allow unbounded attempts on distributed clusters.
- **Remediation:**
  - Defined explicit category sets: `SENSITIVE_FAIL_CLOSED_CATEGORIES` (`admin_auth`, `admin_api`, `payment_order`, `payment_verify`, `media_upload`).
  - Enforced strict fail-closed behavior in production: if Redis fails on a sensitive route, the request is rejected with `HTTP 429 / 503` for abuse prevention.
  - Public browsing and autosave endpoints retain availability-oriented fallback to local memory.
- **Verification:** Verified via test harness and simulated outage condition.

---

### 2. SEC-S4-002: CSRF & Origin Validation on Administrative Mutations
- **Affected Files:** `src/lib/auth.ts`, `src/app/api/admin/route.ts`
- **Issue:** Cross-origin form posts or malicious site scripts could attempt state-changing administrative actions if an admin had an active session cookie.
- **Remediation:**
  - Created `verifyCsrfOrigin(request)` in `src/lib/auth.ts`, validating incoming `Origin` and `Referer` headers against `Host`.
  - Added strict CSRF enforcement to `POST /api/admin` and `GET /api/admin`. Cross-origin requests from foreign domains are rejected with `HTTP 403 Forbidden`.
- **Verification:** Stage 4 test suite verified: cross-origin POST from `https://malicious-attacker-website.com` was rejected with `HTTP 403`.

---

### 3. SEC-S4-003: Disaster Recovery Restore Testing & Certification
- **Affected Files:** `scripts/test-backup-restoration.mjs`
- **Issue:** Pre-migration datastore backups had never been empirically restored in a sandbox to prove recoverability.
- **Remediation:**
  - Built automated restore validation pipeline.
  - Successfully restored backup snapshot `ink-ivory-store-backup-2026-11-20T06-04-18-989Z.json` to sandbox target.
  - Verified bit-for-bit SHA256 checksum equality (`ecfbb3c0361e0cee65647655e22353a177a30af2b912dc878f550df556f959d0`).
  - Verified all 7 drafts, 5 templates, 5 prices, 4 orders, 1 payment, and 1 publication are completely intact.
- **Verification:** Disaster recovery test executed and passed (`scripts/test-backup-restoration.mjs`).

---

### 4. SEC-S4-004: Multi-Customer Parallel IDOR Stress Testing
- **Affected Files:** `scripts/stage4-final-verification.mjs`
- **Scope:** Simulated 3 simultaneous customer identities with 10 concurrent cross-customer read/write attacks.
- **Result:** 100% of unauthorized attacks were rejected with `HTTP 403 Forbidden`. Zero data leakage across customer draft boundaries.
