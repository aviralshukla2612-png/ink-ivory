# M10-07: BACKEND & API SUBSYSTEM AUDIT

**Project:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Milestone:** 10 — Comprehensive Product, Codebase & System-Wide Audit  
**Audit Timestamp:** 2026-11-25T11:06:48+05:30  
**Evaluator:** Backend Architect & Application Security Engineer  
**Runtime:** Next.js Route Handlers (Node.js runtime)  

---

## 1. Master API Route Inventory

The repository contains 42 active route handler files. Below is the structural audit matrix of all core customer and operational APIs:

| Method | Endpoint | Purpose | Authentication | Authorization | Validation | Rate Limit | DB Operation |
|---|---|---|---|---|---|---|---|
| `GET` | `/api/health` | System & DB Health Probe | Public | None | None | Standard | `store.getTemplates()` |
| `GET` | `/api/templates` | Retrieve Active Templates | Public | None | Query params | Cacheable | Read `Template` |
| `GET` | `/api/templates/:id` | Template Details by ID | Public | None | ID string | Cacheable | Read `Template` |
| `GET` | `/api/music` | Curated Soundtrack Catalog | Public | None | Category filter | Cacheable | Read static/music |
| `POST`| `/api/drafts` | Initialize New Draft | Optional Guest | Guest Token Bind | Zod Schema | 60/min | Insert `Draft` |
| `GET` | `/api/drafts/:id` | Fetch Draft State | Guest / User | IDOR Ownership | UUID | Standard | Read `Draft` |
| `PUT` | `/api/drafts/:id` | Autosave Draft State | Guest / User | IDOR Ownership | Zod Partial | 120/min | Update `Draft` |
| `DELETE`| `/api/drafts/:id` | Delete Customer Draft | Guest / User | IDOR Ownership | UUID | Standard | Delete `Draft` |
| `POST`| `/api/drafts/:id/duplicate`| Clone Existing Draft | Guest / User | IDOR Ownership | UUID | Standard | Insert `Draft` |
| `POST`| `/api/upload/image` | Upload Invitation Photo | Guest / User | Token Auth | Magic Bytes + 10MB | 20/10min | Write disk `/uploads` |
| `POST`| `/api/pricing/quote` | Authoritative Quote (₹299)| Public | None | Template ID | 60/min | Calculate quote |
| `POST`| `/api/orders` | Create Razorpay Order | Guest / User | Draft Ownership | Authoritative price| 30/min | Insert `PaymentOrder` |
| `POST`| `/api/payments/verify` | Verify Payment Signature | Guest / User | HMAC SHA256 | Signature params | Mutex lock | Insert `Publication` |
| `POST`| `/api/payments/webhook`| Razorpay Webhook Handler | Webhook Secret | Signature | Event payload | Idempotent | Update `PaymentOrder` |
| `POST`| `/api/payments/recovery`| Recover Orphaned Orders | CRON / Worker | Recovery Lease | Timing-safe auth | Concurrency | Activate `Publication` |
| `GET` | `/api/publications` | List Customer Publications | Guest / User | Token Bind | Query filters | Standard | Read `Publication` |
| `GET` | `/api/publications/:id`| Fetch Public Snapshot | Public | None | Slug / UUID | CDN cached | Read `snapshotData` |
| `POST`| `/api/admin/login` | Admin Password Login | Admin Credentials| None | Email/Password | 5/15min | Insert `AdminSession` |
| `GET` | `/api/admin/me` | Current Admin Session | Cookie | RBAC Session | Bearer/Cookie | Standard | Read `AdminSession` |
| `GET` | `/api/admin/templates`| Admin Template Governance| Cookie | RBAC (`ADMIN`) | Query filters | Standard | Read/Write `Template` |
| `GET` | `/api/admin/orders` | Admin Financial Orders | Cookie | RBAC (`ADMIN`) | Filter params | Standard | Read `PaymentOrder` |
| `GET` | `/api/admin/audit` | Admin Audit Log Trail | Cookie | RBAC (`SUPER_ADMIN`)| Filter params | Standard | Read `AuditEvent` |

---

## 2. API Security & Integrity Findings

1. **IDOR Ownership Enforcement:**
   - Every draft operation (`GET`, `PUT`, `DELETE`, `duplicate`) validates that `guestToken` matches `Draft.guestToken`.
   - Verified via `tests/test-checkpoint7b.ts` Test 4: Cross-customer IDOR access attempts return HTTP 403 / security event `IDOR_ATTEMPT_BLOCKED`.
2. **Server-Authoritative Pricing:**
   - Handled in `POST /api/orders`. Any client attempting to submit custom or manipulated amounts (e.g. `amount: 1`) is overridden by the authoritative ₹299 quote calculated by the backend.
3. **Double-Publication Prevention:**
   - `PublicationActivationService` utilizes atomic transactions and unique constraints on `Publication.orderId` and `Publication.draftId`, ensuring duplicate webhook calls or race conditions resolve idempotently.
