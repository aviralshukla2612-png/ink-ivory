# INK & IVORY — ADMIN API ARCHITECTURE & INTEGRATION AUDIT (STEP 0)

**Platform:** Ink & Ivory Bespoke Digital Invitation & Personalized Experience Engine  
**Document:** Deep Codebase Audit of Administrative APIs, Data Sources, and Client-Server Integrations  
**Date:** November 20, 2026  
**Auditor / Architect:** Principal Full-Stack Engineer, SaaS Product Architect & DevSecOps Specialist  

---

## 1. EXECUTIVE SUMMARY

Ink & Ivory has established a secure foundation in **Milestone 1** (RBAC, constant-time HMAC session tokens, and admin shell) and **Milestone 2** (Executive Dashboard KPIs, real-time activity stream, and template performance calculations). 

However, a comprehensive code-level inspection reveals that the application currently operates on a **hybrid architectural model**:
1. **Core Dashboard (`/admin`)**: Fully API-connected via `/api/admin` (GET for metrics, POST for price updates).
2. **Sub-Modules in Layout Sidebar**: Links to `/admin/templates`, `/admin/builder`, `/admin/categories`, `/admin/customers`, `/admin/drafts`, `/admin/publications`, `/admin/orders`, `/admin/coupons`, `/admin/media`, `/admin/support`, `/admin/staff`, `/admin/audit`, and `/admin/settings` point to unmounted routes, while `/admin/page.tsx` handles a subset of these views via in-page tabs (`publications`, `drafts`, `pricing`, `orders`, `coupons`).
3. **Template Management**: Lacks RESTful CRUD endpoints (`POST /api/admin/templates`, `PATCH /api/admin/templates/[id]`, `DELETE /api/admin/templates/[id]`, duplicate, activate/deactivate).
4. **Dynamic Template Builder**: No section configuration API, no approved renderer registry execution mechanism, and no template versioning schema.
5. **Persistence**: Operates on `data/ink-ivory-store.json` via `StoreService`. Prisma schema has relational models for 12 core tables, but lacks models for categories, coupons, support tickets, template versions, and platform settings.

To achieve an **Enterprise API-First Architecture**, every single admin screen must be powered by dedicated backend APIs with server-side pagination, search, sorting, role-based authorization, CSRF defense, and automated audit logging.

---

## 2. DETAILED MODULE-BY-MODULE AUDIT

### 2.1 Executive Dashboard (`/admin`)
- **Data Source**: Live datastore via `GET /api/admin`
- **Backend API**: `src/app/api/admin/route.ts`
- **Mutation Endpoints**: `POST /api/admin` (Action: `update-price`)
- **Authentication**: `ink_ivory_admin_session` HttpOnly signed session cookie or `x-admin-key` header.
- **Authorization / RBAC**: Enforces `verifyAdminAccess()`. Needs `requirePermission(request, "DASHBOARD_VIEW")`.
- **Database Persistence**: Fully persisted in `data/ink-ivory-store.json`.
- **Missing Connections**: Date-range filtering (Last 7 days, 30 days, Year) is currently static; needs query param support (`/api/admin/dashboard?timeRange=30d`).
- **Test Coverage**: Tested by `scripts/milestone2-dashboard-test.mjs` (21/21 controls passing).

### 2.2 Template Catalog & Management (`/admin/templates`)
- **Current Route Status**: Unmounted (Sidebar links to `/admin/templates`, in-page tab handles pricing only).
- **Data Source**: Hybrid (Static `templatesData` in `src/data/templates.ts` merged with `store.getAllTemplates()`).
- **Backend API**: Missing dedicated `GET /api/admin/templates`.
- **Mutation Endpoints**: Missing `POST /api/admin/templates`, `PATCH /api/admin/templates/[id]`, `DELETE /api/admin/templates/[id]`, `POST /api/admin/templates/[id]/duplicate`, `POST /api/admin/templates/[id]/activate`, `POST /api/admin/templates/[id]/deactivate`.
- **Authentication**: Required (`ink_ivory_admin_session`).
- **Authorization**: Must require `TEMPLATES_VIEW` (read) and `TEMPLATES_MANAGE` (mutations).
- **Database Persistence**: Only `updateTemplatePrice` currently persists in `store.ts`. Full template metadata persistence is missing.
- **Missing Connections**: Template creation modal/form, activation toggle, duplication button, server-side search, category filter, pagination.
- **Test Coverage**: Only price updates tested; template CRUD untested.

### 2.3 Dynamic Template Builder (`/admin/builder` & `/admin/templates/[id]/builder`)
- **Current Route Status**: Unmounted (Sidebar links to `/admin/builder`).
- **Data Source**: None currently mounted for administrative building.
- **Backend API**: Missing `GET /api/admin/templates/[id]/builder`, `PUT /api/admin/templates/[id]/builder`, `POST /api/admin/templates/[id]/builder/validate`, `POST /api/admin/templates/[id]/builder/preview`.
- **Mutation Endpoints**: Missing section CRUD and reordering APIs (`PUT /api/admin/templates/[id]/sections/reorder`).
- **Authentication**: Required.
- **Authorization**: Must require `TEMPLATES_MANAGE`.
- **Approved Renderer Registry**: Needs formal decoupling from hardcoded page URLs. Must support:
  - `wedding-imperial-navy` (`src/app/template-01/page.jsx`)
  - `wedding-lake-palace` (`src/app/template-02/page.jsx`)
  - `wedding-temple-thirumanam` (`src/app/template-03/page.jsx`)
  - `birthday-interactive` (`src/app/birthday/page.jsx`)
  - `valentine-proposal` (`src/app/valentine/page.jsx`)
  - `date-planner-interactive` (`src/app/date-planner/page.jsx`)
- **Database Persistence**: Missing `templateSections`, `templateVersions`, and `customerFieldsSchema` entities in `store.ts` and `schema.prisma`.
- **Test Coverage**: 0% (Not yet built).

### 2.4 Categories Management (`/admin/categories`)
- **Current Route Status**: Unmounted.
- **Data Source**: Static list `occasionsList` in `src/data/templates.ts`.
- **Backend API**: Missing `GET /api/admin/categories`, `POST /api/admin/categories`, `PATCH /api/admin/categories/[id]`, `DELETE /api/admin/categories/[id]`.
- **Authentication & RBAC**: Must require `CATEGORIES_MANAGE`.
- **Database Persistence**: Missing `CategoryRecord` in `store.ts`.
- **Test Coverage**: 0%.

### 2.5 Customer Management (`/admin/customers` & `/admin/customers/[id]`)
- **Current Route Status**: Unmounted.
- **Data Source**: Derived on-the-fly from distinct `guestToken` / `userId` across drafts in `/api/admin`.
- **Backend API**: Missing dedicated `GET /api/admin/customers`, `GET /api/admin/customers/[id]`, `GET /api/admin/customers/[id]/activity`, `POST /api/admin/customers/[id]/notes`, `PATCH /api/admin/customers/[id]/status`.
- **Authentication & RBAC**: Must require `CUSTOMERS_VIEW` (read) and `CUSTOMERS_MANAGE` (notes/status).
- **Database Persistence**: `users` table exists, but guest customers are currently tracked across draft and order tables. Need unified customer abstraction.
- **Test Coverage**: Customer total count tested in Milestone 2; customer list and profile routes untested.

### 2.6 Customer Drafts (`/admin/drafts`)
- **Current Route Status**: Rendered as tab in `/admin/page.tsx`.
- **Data Source**: Backend `drafts` array from `GET /api/admin`.
- **Backend API**: `/api/admin` returns raw array; missing dedicated paginated `GET /api/admin/drafts` with search and status filtering.
- **Mutation Endpoints**: None currently exposed to admin.
- **Authentication & RBAC**: `DRAFTS_VIEW`.
- **Database Persistence**: Persisted in `store.data.drafts`.
- **Missing Connections**: Dedicated standalone page, server-side pagination, date range filtering, read-only snapshot inspection drawer.
- **Test Coverage**: List verification tested; paginated endpoint untested.

### 2.7 Live Publications (`/admin/publications`)
- **Current Route Status**: Rendered as tab in `/admin/page.tsx`.
- **Data Source**: Backend `publications` array from `GET /api/admin`.
- **Backend API**: Missing dedicated `GET /api/admin/publications`, `POST /api/admin/publications/[id]/suspend`, `POST /api/admin/publications/[id]/restore`.
- **Authentication & RBAC**: `PUBLICATIONS_VIEW` (read), `PUBLICATIONS_MANAGE` (suspension/restoration).
- **Database Persistence**: Persisted in `store.data.publications`.
- **Missing Connections**: Administrative suspension button with mandatory reason logging, suspension enforcement in public viewer `/invite/[slug]`.
- **Test Coverage**: Read verified; suspension and restoration untested.

### 2.8 Orders, Payments & Financials (`/admin/orders`, `/admin/payments`, `/admin/refunds`)
- **Current Route Status**: Orders rendered as tab in `/admin/page.tsx`. Payments and refunds lack dedicated views.
- **Data Source**: Backend `orders` and `payments` arrays from `GET /api/admin`.
- **Backend API**: Missing dedicated `GET /api/admin/orders`, `GET /api/admin/payments`, `POST /api/admin/refunds`.
- **Authentication & RBAC**: `FINANCIALS_VIEW` (read), `REFUNDS_MANAGE` (refund mutations).
- **Database Persistence**: Persisted in `store.data.orders` and `store.data.payments`.
- **Missing Connections**: Razorpay refund initiation, financial reconciliation breakdown, downloadable CSV export.
- **Test Coverage**: Order listing and payment totals tested; refund workflow untested.

### 2.9 Coupons & Promotions (`/admin/coupons`)
- **Current Route Status**: Rendered as hardcoded static cards in `src/app/admin/page.tsx` tab!
- **Data Source**: **HARDCODED FRONTEND MOCK** (`ROYAL100`, `LOVE2026`, `TEMPLE50` hardcoded in `page.tsx` lines 737-742).
- **Backend API**: Completely missing!
- **Mutation Endpoints**: Completely missing!
- **Authentication & RBAC**: Must require `COUPONS_MANAGE`.
- **Database Persistence**: Missing `coupons` entity in `store.ts`.
- **Violation Identified**: **VIOLATES RULE 1 (NO MOCK DATA)**. Must be replaced immediately with real database-backed CRUD.

### 2.10 Media Library (`/admin/media`)
- **Current Route Status**: Unmounted.
- **Data Source**: Direct file uploads to `/public/uploads/` and Cloudinary signed endpoints.
- **Backend API**: Missing `GET /api/admin/media`, `POST /api/admin/media/upload`, `DELETE /api/admin/media/[id]`.
- **Authentication & RBAC**: Must require `MEDIA_MANAGE`.
- **Database Persistence**: Missing `mediaAssets` entity in `store.ts`.
- **Test Coverage**: Audio file magic-byte upload tested; administrative media asset catalog untested.

### 2.11 Customer Support (`/admin/support`)
- **Current Route Status**: Unmounted.
- **Data Source**: None.
- **Backend API**: Missing `GET /api/admin/support/tickets`, `POST /api/admin/support/tickets`, `PATCH /api/admin/support/tickets/[id]`, `POST /api/admin/support/tickets/[id]/messages`.
- **Authentication & RBAC**: Must require `SUPPORT_MANAGE`.
- **Database Persistence**: Missing `supportTickets` and `supportMessages` in `store.ts`.
- **Test Coverage**: 0%.

### 2.12 Notifications (`/admin/notifications`)
- **Current Route Status**: Unmounted.
- **Data Source**: Derived on-the-fly from activity feed in `/api/admin`.
- **Backend API**: Missing `GET /api/admin/notifications`, `PATCH /api/admin/notifications/[id]/read`.
- **Authentication & RBAC**: Must require administrative session.
- **Database Persistence**: Missing `notifications` in `store.ts`.
- **Test Coverage**: 0%.

### 2.13 Staff & RBAC Management (`/admin/staff`)
- **Current Route Status**: Unmounted.
- **Data Source**: Hardcoded in `store.data.users` (`usr_admin_default`).
- **Backend API**: Missing `GET /api/admin/staff`, `POST /api/admin/staff`, `PATCH /api/admin/staff/[id]`, `POST /api/admin/staff/[id]/deactivate`.
- **Authentication & RBAC**: Must require `STAFF_MANAGE` (restricted strictly to `SUPER_ADMIN`).
- **Database Persistence**: Partial (`users` in `store.ts`).
- **Test Coverage**: RBAC matrix tested; staff user CRUD untested.

### 2.14 Platform Settings & Security Audit (`/admin/settings` & `/admin/audit`)
- **Current Route Status**: Unmounted.
- **Data Source**: Audit logs exist in `store.data.auditLogs` and `src/lib/security/audit.ts`. Settings are in environment variables.
- **Backend API**: Missing `GET /api/admin/audit-logs`, `GET /api/admin/settings`, `PATCH /api/admin/settings`.
- **Authentication & RBAC**: `AUDIT_LOGS_VIEW` (audit), `SETTINGS_MANAGE` (settings).
- **Database Persistence**: Audit logs persisted; platform settings missing database table.
- **Test Coverage**: Audit creation tested; admin audit log viewer endpoint untested.

---

## 3. CORE ARCHITECTURAL FINDINGS & REMEDIATION MATRIX

| Priority | Area | Identified Defect | Remediation Plan |
| :---: | :--- | :--- | :--- |
| **P0** | **Coupons Module** | Hardcoded mock cards in `page.tsx` violating Rule 1. | Implement `CouponRecord` in `store.ts`, create `/api/admin/coupons` CRUD, and connect UI. |
| **P0** | **Templates CRUD** | Missing creation, update, duplicate, and activation APIs. | Create `src/app/api/admin/templates/route.ts` and `[id]/route.ts`. |
| **P0** | **Template Builder** | Missing Dynamic Section Builder & Approved Renderer Registry. | Build registry in `src/lib/templates/renderer-registry.ts`, section builder API, and builder UI. |
| **P1** | **Customer Abstraction** | No consolidated customer table for guest & registered users. | Build unified Customer service in `store.ts` and `/api/admin/customers` API. |
| **P1** | **Publications** | No administrative suspension/restoration controls. | Implement `/api/admin/publications/[id]/suspend` with reason logging. |
| **P1** | **API Client Layer** | No centralized `src/lib/api/` client service layer. | Create typed API client in `src/lib/api/` for all administrative domains. |
| **P2** | **Server-side Pagination** | Entire collections are returned in single payloads. | Standardize `?page=1&limit=20&search=...` across all list endpoints. |
| **P2** | **Operations** | Support, Staff, Media, and Settings lack dedicated backend APIs. | Add operational endpoints and store tables for Milestones 7 & 8. |
