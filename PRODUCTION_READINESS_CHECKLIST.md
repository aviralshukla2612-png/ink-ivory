# INK & IVORY — PRODUCTION READINESS CHECKLIST (STAGE 4 FINAL)

**Platform:** Ink & Ivory Bespoke Digital Invitation & Personalized Experience Engine  
**Target Release:** v3.1.0-PROD-VALIDATED  
**Date:** November 20, 2026  

---

## 1. COMPREHENSIVE PRODUCTION READINESS CHECKLIST

### Category 1: Authentication & Credential Isolation
- [x] **No Master Credentials in Browser Storage:** Purged all `sessionStorage` and `localStorage` admin keys.
- [x] **Server-Side Admin Authentication:** Implemented `POST /api/admin/login` and `POST /api/admin/logout`.
- [x] **Secure Session Cookies:** `ink_ivory_admin_session` configured with `HttpOnly`, `SameSite=Strict`, `Path=/`, and conditional `Secure`.
- [x] **Time-Bound Sessions:** Admin session tokens strictly expire after 2 hours.
- [x] **Constant-Time Verification:** Used `crypto.timingSafeEqual` for all master keys and session signatures.
- [x] **CSRF Origin Protection:** Added `verifyCsrfOrigin` on all state-changing administrative routes.
- [x] **Guest Identity Signing:** Anonymous customers tracked via HMAC-SHA256 signed tokens (`gst_<uuid>.<sig>`).

### Category 2: Access Control & Anti-IDOR Defense
- [x] **Draft Ownership Verification:** `verifyOwnership` enforced on `GET /api/drafts/[id]` and `PUT /api/drafts/[id]`.
- [x] **Order Creation Isolation:** Customer cannot initiate payment orders for drafts owned by another user.
- [x] **Publication List Filtering:** Customer dashboard only retrieves publications belonging to the requester's identity.
- [x] **Unpublished Draft Privacy:** Accessing unpublished draft IDs on `/invite/[slug]` renders the "Invitation Not Published" screen (no data leak).
- [x] **Stress-Tested Parallel Isolation:** 10 concurrent cross-customer attacks were 100% blocked with `HTTP 403`.

### Category 3: Rate Limiting & Abuse Prevention
- [x] **Anti-Spoofing Trusted Proxy Policy:** Environment-aware IP resolution (`cloudflare`, `vercel`, `reverse-proxy`). Unauthenticated direct clients cannot bypass limits using rotating `X-Forwarded-For`.
- [x] **Distributed Upstash Redis Integration:** Sliding-window counters supported via `@upstash/ratelimit` and `@upstash/redis`.
- [x] **Fail-Closed Policy on Sensitive Routes:** In production, Redis errors cause `adminAuth`, `createOrder`, `verifyPayment`, and `mediaUpload` to fail closed.
- [x] **Availability Fallback for Public Browsing:** Template viewing and draft autosave gracefully fall back to local store to prevent guest disruption.
- [x] **RFC 6585 Compliance:** Rate limit exhaustion generates `HTTP 429 Too Many Requests` with `Retry-After` headers.

### Category 4: Payment Integrity & Razorpay Verification
- [x] **Server-Side Price Quote Calculation:** Pricing calculated strictly via template catalog configuration; client prices rejected.
- [x] **HMAC-SHA256 Signature Verification:** Checkout signatures verified using `crypto.timingSafeEqual`.
- [x] **Raw Webhook Verification:** Webhook signatures computed using the exact unparsed raw request body string.
- [x] **Production Mock Bypass Elimination:** Dev mock signatures (`dev_mock_signature_`) are strictly blocked in production.
- [x] **Payment Verification Idempotency:** Repeated calls to `/api/payments/verify` return the existing publication without duplication (`isIdempotent: true`).
- [x] **Order-to-Draft Binding:** Verified payment can only publish the specific draft for which the order was created.

### Category 5: File Upload & Asset Security
- [x] **Binary Magic-Byte Inspection:** Audio uploads validated via ID3 tags, MPEG sync frames, RIFF/WAVE, and ftyp headers.
- [x] **Extension Whitelisting:** Disallowed extensions (`.exe, .sh, .html`) are rejected with `HTTP 400`.
- [x] **Path Traversal Sanitization:** Filenames stripped of `../` and control characters via `sanitizeFileName`.
- [x] **Cloudinary Direct Signed Uploads:** Created `POST /api/upload/cloudinary-sign` generating SHA1 signatures without exposing API secret.
- [x] **Upload Size Limits:** 25MB boundary enforced on local audio uploads.

### Category 6: HTTP Headers & Technology Fingerprinting
- [x] **Content Security Policy (CSP):** Strict policy permitting Razorpay checkout scripts, Google Fonts, and self assets.
- [x] **Clickjacking Defense:** `X-Frame-Options: SAMEORIGIN` and `frame-ancestors 'self'`.
- [x] **MIME Sniffing Defense:** `X-Content-Type-Options: nosniff`.
- [x] **Referrer Policy:** `strict-origin-when-cross-origin`.
- [x] **Technology Fingerprint Concealment:** `poweredByHeader: false` suppresses `X-Powered-By: Next.js`.

### Category 7: Database Architecture & Disaster Recovery
- [x] **Enterprise PostgreSQL Schema:** 12 relational models, foreign keys, and indexes in `prisma/schema.prisma`.
- [x] **Pre-Migration Datastore Backup:** Verified backup snapshots stored in `data/backups/`.
- [x] **Bit-for-Bit Restore Verified:** Restore test script confirmed matching SHA256 checksums and 100% data integrity.
- [x] **SQL DML Seed Script:** Generated `prisma/seed_data.sql` for PostgreSQL initialization.

---

## 2. ENVIRONMENT LAUNCH VERDICTS

| Deployment Environment | Readiness Status | Operational Notes |
| :--- | :---: | :--- |
| **A. Local Development** | **READY (100%)** | All routes, components, and tests verified on `http://127.0.0.1:3000`. |
| **B. Staging Environment** | **READY (100%)** | Security headers, admin login, and test-mode Razorpay checkout ready. |
| **C. Single-Instance Production** | **READY (100%)** | Fully protected with local sliding-window rate limiting and hardened file storage. |
| **D. Multi-Instance Cloud Production** | **CONDITIONAL** | Verified code; requires provisioning PostgreSQL (`DATABASE_URL`) and Upstash Redis (`UPSTASH_REDIS_*`) in cloud host secrets. |
| **E. Payment Processing** | **READY** | Razorpay Test Mode verified; requires injecting live Razorpay keys for live transactions. |
| **F. Customer Data Protection** | **READY (100%)** | Flawless IDOR isolation, unpublished link privacy, and PII masking verified. |
