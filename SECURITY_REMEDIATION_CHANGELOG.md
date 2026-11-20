# INK & IVORY — SECURITY REMEDIATION CHANGELOG (STAGE 3)

**Version:** 3.0.0-PROD-HARDENED  
**Date:** November 20, 2026  
**Auditor / Architect:** Principal Application Security Engineer & Next.js Architect  

---

### SUMMARY OF REMEDIATIONS

This changelog records the concrete source-code remediations applied to resolve all vulnerabilities and gaps identified in `SECURITY_AUDIT_REPORT_STAGE_2.md`.

---

### 1. SEC-S2-001: Trusted Proxy IP Extraction & Anti-Spoofing
- **Status:** **REMEDIATED & VERIFIED**
- **Original Severity:** HIGH
- **Vulnerable File:** `src/lib/security/rate-limit-keys.ts`
- **Root Cause:** Untrusted parsing of client-supplied `X-Forwarded-For` allowed rotating headers to bypass sliding-window rate limits.
- **Changes Applied:**
  - Implemented environment-aware trusted-proxy detection (`TRUSTED_PROXY_TYPE`: `cloudflare`, `vercel`, `reverse-proxy`, `auto`, `none`).
  - Added strict validation for `cf-connecting-ip` (restricted to Cloudflare headers) and `x-vercel-ip`/`x-real-ip` (restricted to Vercel deployments).
  - Configured explicit reverse proxy trust gate (`TRUSTED_PROXY_SECRET`) before trusting `X-Forwarded-For`.
  - In direct / untrusted client connections, arbitrary forwarding headers are safely ignored and default to connecting address (`127.0.0.1`), closing the spoofing vector.
- **Verification Result:** Passed in both Stage 2 re-run and Stage 3 verification test suite (`scripts/stage3-verification-test.mjs`).

---

### 2. SEC-S2-002: Distributed Rate Limiting via Upstash Redis
- **Status:** **REMEDIATED & VERIFIED**
- **Original Severity:** HIGH
- **Files Modified:** `package.json`, `src/lib/security/rate-limit.ts`
- **Root Cause:** In-memory `Map` counters were partitioned across server instances and lost on process restart.
- **Changes Applied:**
  - Installed and integrated `@upstash/redis` (v1.41.0) and `@upstash/ratelimit` (v2.2.1).
  - Added `checkRateLimitAsync()` with sliding-window distributed counters across all instances when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are configured.
  - Implemented fail-safe resilience: Redis connection timeouts and errors are caught, logged as security events, and gracefully fallback to the local store (fail-open) to prevent customer checkout denial-of-service.
- **Verification Result:** Verified sliding window logic, config validation, and fail-safe handling in automated test suite.

---

### 3. SEC-S2-003: Secure Admin Authentication & Session Management
- **Status:** **REMEDIATED & VERIFIED**
- **Original Severity:** HIGH
- **Files Modified:** `src/lib/auth.ts`, `src/app/admin/page.tsx`
- **Files Created:** `src/app/api/admin/login/route.ts`, `src/app/api/admin/logout/route.ts`
- **Root Cause:** Raw `ADMIN_SECRET_KEY` was saved directly into browser `sessionStorage` in `AdminPage` and transmitted in custom request headers.
- **Changes Applied:**
  - Completely purged all `sessionStorage` credential storage from `src/app/admin/page.tsx`.
  - Built `POST /api/admin/login` enforcing constant-time comparison (`crypto.timingSafeEqual`) and brute-force rate limiting (`adminAuth`).
  - Created cryptographically signed, 2-hour time-bound admin session tokens (`adm_<uuid>.<expiresAt>.<sig>`).
  - Issued session token via `HttpOnly`, `SameSite=Strict`, `Path=/`, and conditional `Secure` cookie `ink_ivory_admin_session`.
  - Built `POST /api/admin/logout` to immediately revoke and expire the cookie.
  - Updated `verifyAdminAccess()` to validate the session cookie on all admin API calls.
- **Verification Result:** Passed 4 test controls: invalid credential rejection (401), HttpOnly session issuance (200), session-based dashboard retrieval (200), and logout cookie invalidation (200).

---

### 4. SEC-S2-004: Payment Verification Idempotency & Replay Defense
- **Status:** **REMEDIATED & VERIFIED**
- **Original Severity:** MEDIUM
- **Files Modified:** `src/app/api/payments/verify/route.ts`, `src/lib/store.ts`
- **Root Cause:** Calling `/api/payments/verify` repeatedly created redundant duplicate publication snapshot records.
- **Changes Applied:**
  - In `src/app/api/payments/verify/route.ts`: added an idempotency guard. If an order is already marked `PAID` or a draft is already published, the existing publication and invitation URL are returned with `isIdempotent: true`.
  - In `src/lib/store.ts`: updated `publishDraft()` to upsert active publications rather than pushing duplicates.
- **Verification Result:** Verified in test 3: 3 rapid repeated verification calls returned identical slug and publication records without duplication.

---

### 5. PostgreSQL Database Architecture & Safe Data Migration
- **Status:** **IMPLEMENTED & VERIFIED**
- **Original Severity:** HIGH (Scalability & Concurrency Risk)
- **Files Created:** `prisma/schema.prisma`, `scripts/migrate-json-to-postgres.mjs`, `prisma/seed_data.sql`
- **Changes Applied:**
  - Designed comprehensive Prisma relational schema for PostgreSQL: `User`, `GuestIdentity`, `GuestSession`, `AdminSession`, `Template`, `TemplatePrice`, `Draft`, `DraftMedia`, `PaymentOrder`, `PaymentTransaction`, `Invitation`, `Publication`, `AuditEvent`.
  - Built automated pre-migration backup pipeline that generates SHA256 checksums and immutable backup snapshots (`data/backups/`).
  - Generated PostgreSQL DML seed script (`prisma/seed_data.sql`) containing sanitized relational inserts with JSONB columns.
  - Verified 100% referential integrity across all existing drafts and templates.

---

### 6. Cloudinary Direct Signed Upload API & File Security
- **Status:** **IMPLEMENTED & VERIFIED**
- **Original Severity:** MEDIUM (Missing Upload Architecture)
- **Files Created:** `src/app/api/upload/cloudinary-sign/route.ts`
- **Files Modified:** `src/middleware.ts`
- **Changes Applied:**
  - Created `POST /api/upload/cloudinary-sign` generating SHA1 signed upload parameters for Cloudinary direct uploads.
  - Enforced draft ownership validation and strict extension whitelisting (`.jpg, .jpeg, .png, .webp, .mp3, .wav`). Disallowed extensions (`.exe`) are rejected with `HTTP 400`.
  - Cloudinary API secret is never exposed to client browsers.
  - Hardened `src/middleware.ts` to ensure security headers are applied to all routes except explicitly matched static file extensions.

---

### 7. Regression & Full Test Execution
- **Stage 2 Regression Test Suite:** 21 / 21 Passed (100%)
- **Stage 3 Verification Test Suite:** 11 / 11 Passed (100%)
- **TypeScript Compilation:** 0 errors (`npx tsc --noEmit`)
