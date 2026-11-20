# INK & IVORY — ADMIN IMPLEMENTATION PLAN & MILESTONES (STEP 0 ROADMAP)

**Document:** Comprehensive Implementation Roadmap for Complete API-Driven Admin Platform  
**Date:** November 20, 2026  
**Architect:** Principal Full-Stack Engineer, SaaS Product Architect & DevSecOps Specialist  

---

## 1. SEQUENTIAL MILESTONE ROADMAP (MILESTONES 3 THROUGH 8)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        INK & IVORY ADMIN IMPLEMENTATION PLAN                           │
├─────────────┬────────────────────────────┬─────────────────────────────────────────────┤
│ MILESTONE   │ DOMAIN                     │ SCOPE & DELIVERABLES                        │
├─────────────┼────────────────────────────┼─────────────────────────────────────────────┤
│ Milestone 1 │ Foundation & RBAC Shell    │ • RBAC Engine, 5 roles, 20 permissions      │
│ (COMPLETED) │                            │ • Admin layout, sidebar, header & auth gate │
│             │                            │ • Session & CSRF route guards, audit logger │
├─────────────┼────────────────────────────┼─────────────────────────────────────────────┤
│ Milestone 2 │ Core Dashboard & Real KPIs │ • Real KPI calculations (Revenue, Orders)   │
│ (COMPLETED) │                            │ • Template performance leaderboard          │
│             │                            │ • Operational activity stream               │
│             │                            │ • Fast price updates with audit trail       │
├─────────────┼────────────────────────────┼─────────────────────────────────────────────┤
│ Milestone 3 │ Template & Category CRUD   │ • RESTful Template CRUD (`/api/admin/tpls`) │
│ (IMMEDIATE) │                            │ • Server-side search, filter & pagination   │
│             │                            │ • Category CRUD (`/api/admin/categories`)   │
│             │                            │ • Dedicated UI (`/admin/templates`, `/cat`) │
├─────────────┼────────────────────────────┼─────────────────────────────────────────────┤
│ Milestone 4 │ Dynamic Template Builder   │ • Approved Renderer Registry                │
│             │                            │ • Interactive Section Builder & Reordering  │
│             │                            │ • Customer-editable field schema manager    │
│             │                            │ • Responsive multi-device live preview      │
│             │                            │ • Immutable template versioning & rollback  │
├─────────────┼────────────────────────────┼─────────────────────────────────────────────┤
│ Milestone 5 │ Customers & Drafts         │ • Unified customer listing & profile viewer │
│             │                            │ • Activity history, drafts & payment links  │
│             │                            │ • Draft inspection & read-only preview      │
├─────────────┼────────────────────────────┼─────────────────────────────────────────────┤
│ Milestone 6 │ Publication Management     │ • Dedicated publications management table   │
│             │                            │ • Administrative suspension with reason log │
│             │                            │ • Restoration & public viewer enforcement   │
├─────────────┼────────────────────────────┼─────────────────────────────────────────────┤
│ Milestone 7 │ Finance, Orders & Coupons  │ • Orders & payments gateway reconciliation  │
│             │                            │ • Real database-backed Coupons CRUD         │
│             │                            │ • Refund authorization & financial reporting│
├─────────────┼────────────────────────────┼─────────────────────────────────────────────┤
│ Milestone 8 │ Operations, Staff & Audit  │ • Media Library with asset uploads          │
│             │                            │ • Customer Support ticket system            │
│             │                            │ • Notifications & Staff management          │
│             │                            │ • Platform settings & Audit log viewer      │
└─────────────┴────────────────────────────┴─────────────────────────────────────────────┘
```

---

## 2. MILESTONE 3: TEMPLATE & CATEGORY MANAGEMENT (IMMEDIATE NEXT WORK)

### A. Backend Endpoints to Create
1. `GET /api/admin/templates`:
   - Query params: `page`, `limit`, `search`, `category`, `status`, `tier`, `sortBy`, `sortOrder`.
   - Returns paginated data with metadata: `{ success: true, data: TemplateRecord[], meta: { page, limit, total, totalPages } }`.
2. `POST /api/admin/templates`:
   - Validates payload with Zod schema (`title`, `slug`, `occasion`, `description`, `tier`, `priceINR`, `rendererId`, `previewImage`).
   - Verifies slug uniqueness and approved renderer ID.
   - Enforces `TEMPLATES_MANAGE` permission and CSRF origin check.
   - Writes immutable audit log `ADMIN_TEMPLATE_CREATED`.
3. `GET /api/admin/templates/[id]`:
   - Returns single template record with its active price and version.
4. `PATCH /api/admin/templates/[id]`:
   - Updates title, description, badge, tier, price, or design config.
   - Enforces `TEMPLATES_MANAGE`.
   - Writes audit log `ADMIN_TEMPLATE_UPDATED`.
5. `DELETE /api/admin/templates/[id]`:
   - Soft-deletes (archives) template so existing customer drafts remain stable.
   - Enforces `TEMPLATES_MANAGE`.
6. `POST /api/admin/templates/[id]/duplicate`:
   - Creates a new template draft cloned from an existing template.
7. `POST /api/admin/templates/[id]/activate` & `/deactivate`:
   - Toggles public marketplace visibility (`isActive: boolean`).
8. `GET /api/admin/categories` & `POST /api/admin/categories`:
   - Category CRUD with display ordering.

### B. Store Enhancements
- Add `createTemplate()`, `updateTemplate()`, `archiveTemplate()`, `duplicateTemplate()`, `listTemplates(query)`.
- Add `createCategory()`, `updateCategory()`, `listCategories()`.

### C. Frontend Deliverables
- `src/lib/api/templates-api.ts`: Typed API client for templates and categories.
- `src/app/admin/templates/page.tsx`: Full-featured template management table with search, category pills, tier badges, status toggle, price editing, create template modal, duplicate button, and builder launch.
- `src/app/admin/categories/page.tsx`: Category management screen.

### D. Automated Test Verification
- Create `scripts/milestone3-templates-test.mjs` verifying all 8 template API endpoints, pagination, slug uniqueness, and audit logs.

---

## 3. MILESTONE 4: DYNAMIC TEMPLATE BUILDER & APPROVED RENDERER REGISTRY

### A. Architectural Invariants
- **Approved Renderer Registry**: Strictly decouples visual code from database configuration.
- **Security Barrier**: Zero execution of administrator-uploaded JS/HTML scripts. Only approved registry renderers (`wedding-imperial-navy`, `wedding-lake-palace`, `wedding-temple-thirumanam`, `birthday-interactive`, `valentine-proposal`, `date-planner-interactive`) are executed.
- **Section Builder**: Supports drag-and-drop / ordering of standard sections (Opening, Hero, Welcome, Story, Gallery, Events, Venue, Music, Closing).
- **Customer Field Schema**: Administrators define which fields are customer-editable vs design-locked.
- **Versioning**: Publishing changes creates immutable version snapshots (`v1`, `v2`, etc.).

---

## 4. MILESTONES 5–8 SUMMARY & EXECUTION SEQUENCE

Following completion of Milestone 3 and 4, we will proceed sequentially through:
- **Milestone 5**: Customer listing, profile viewer, and draft inspector.
- **Milestone 6**: Publications management with administrative suspension.
- **Milestone 7**: Financial orders, Razorpay payments, refund authorization, and real database-backed coupons.
- **Milestone 8**: Media library, support tickets, staff management, settings, and audit log viewer.
