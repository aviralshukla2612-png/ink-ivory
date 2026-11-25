# M10-11: CENTRALIZED ADMIN PANEL AUDIT

**Project:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Milestone:** 10 — Comprehensive Product, Codebase & System-Wide Audit  
**Audit Timestamp:** 2026-11-25T11:07:51+05:30  
**Evaluator:** Principal Software Architect & Security Auditor  
**Portal Path:** `src/app/admin` (Unified Next.js Administration Interface)  

---

## 1. Single Admin Portal Invariant

Platform security and operational policies strictly mandate **one centralized administration portal**.
- Repository scan confirmed: **0 administrative routes or screens exist in `you-are-mine-mobile`**.
- All administrative operations occur strictly through authenticated Next.js routes under `/admin`.

---

## 2. Admin Modules Inventory

| Admin Route Path | Subsystem | Operational Capabilities | RBAC Role Required |
|---|---|---|---|
| `/admin` | Dashboard | Executive metrics, publication stats, recent revenue, order volume | `ADMIN`, `SUPER_ADMIN` |
| `/admin/templates` | Catalog | View 8 templates, toggle active/inactive status, inspect sections | `ADMIN`, `SUPER_ADMIN` |
| `/admin/templates/[id]`| Catalog | Edit template details, preview live demo, view pricing | `SUPER_ADMIN` (for price mutation) |
| `/admin/orders` | Finance | Inspect all customer payment orders, amounts, receipts, status | `ADMIN`, `SUPER_ADMIN`, `STAFF` |
| `/admin/payments` | Finance | Reconcile Razorpay transactions, transaction IDs, captured status | `ADMIN`, `SUPER_ADMIN` |
| `/admin/publications` | Publications | Audit live publications, inspect immutable JSON snapshots, view URLs | `ADMIN`, `SUPER_ADMIN`, `STAFF` |
| `/admin/customers` | Customers | View verified phone sessions, guest token mappings, order counts | `ADMIN`, `SUPER_ADMIN` |
| `/admin/drafts` | Drafts | Inspect customer drafts, version numbers, last saved timestamps | `ADMIN`, `SUPER_ADMIN` |
| `/admin/music` | Media | Manage 116+ soundtracks, category chips, audio preview playback | `ADMIN`, `SUPER_ADMIN` |
| `/admin/media` | Media | Audit uploaded customer photographs, file sizes, relative paths | `ADMIN`, `SUPER_ADMIN` |
| `/admin/coupons` | Promotions | View active discount codes (`YOUMINE50`), expiry, usage stats | `ADMIN`, `SUPER_ADMIN` |
| `/admin/refunds` | Finance | Process customer refunds with live publication preservation | `SUPER_ADMIN` |
| `/admin/audit` | Security | Comprehensive tamper-evident audit trail of administrative actions | `SUPER_ADMIN` |
| `/admin/settings` | System | Platform configuration, operational parameters, rate limit dials | `SUPER_ADMIN` |
| `/admin/staff` | RBAC | Manage administrative staff members, roles, session revocations | `SUPER_ADMIN` |
| `/admin/android` | Mobile Ops | Monitor Android distribution channel, version codes, play metadata | `ADMIN`, `SUPER_ADMIN` |

---

## 3. Server-Side RBAC Enforcement

- Validated via `tests/test-checkpoint7c.ts`:
  - `SUPPORT_AGENT` / `STAFF` roles attempting to mutate base template prices or alter system settings receive HTTP 403 Forbidden.
  - Audit trail entries in `AuditEvent` are write-only and cannot be updated or deleted by administrators.
