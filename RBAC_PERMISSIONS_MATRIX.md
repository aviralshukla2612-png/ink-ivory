# YOU ARE MINE — Role-Based Access Control (RBAC) Matrix
**Security Standard:** Principle of Least Privilege (PoLP)  
**Implementation:** `src/lib/security/rbac.ts`  
**Brand Identity:** YOU ARE MINE

---

## 1. Role Definitions

1. **`SUPER_ADMIN`:** Full sovereign authority across Web, Android, Finance, Staff, and Operations.
2. **`FINANCE`:** Financial auditor with access to revenue, orders, payments, coupons, and refunds. Blocked from modifying templates or drafts.
3. **`CONTENT_MANAGER`:** Visual designer and curator managing templates, section builders, categories, and music libraries. Blocked from finance and staff.
4. **`SUPPORT`:** Customer relations agent managing inquiries, inspecting customer drafts, and reviewing reported publications. Blocked from sensitive settings.

---

## 2. Granular Permissions Matrix (20 Permissions)

| Permission Code | Description | SUPER_ADMIN | FINANCE | CONTENT_MANAGER | SUPPORT |
| :--- | :--- | :---: | :---: | :---: | :---: |
| `DASHBOARD_VIEW` | View top-level executive metrics and revenue KPIs | ✅ | ✅ | ❌ | ❌ |
| `TEMPLATES_VIEW` | Browse template catalog and pricing tiers | ✅ | ❌ | ✅ | ❌ |
| `TEMPLATES_MANAGE`| Create, edit, and duplicate template renderers | ✅ | ❌ | ✅ | ❌ |
| `CATEGORIES_MANAGE`| Reorder occasion categories and visibility | ✅ | ❌ | ✅ | ❌ |
| `CUSTOMERS_VIEW` | Search and inspect customer identity directory | ✅ | ❌ | ❌ | ✅ |
| `DRAFTS_VIEW` | View customer drafts and design configurations | ✅ | ❌ | ❌ | ✅ |
| `PUBLICATIONS_VIEW`| Inspect active public invitation URLs | ✅ | ❌ | ❌ | ✅ |
| `PUBLICATIONS_MANAGE`| Suspend or restore public invitation URLs | ✅ | ❌ | ❌ | ❌ |
| `FINANCIALS_VIEW` | Access orders, captured transactions, and GMV | ✅ | ✅ | ❌ | ❌ |
| `REFUNDS_MANAGE` | Approve and process customer payment reversals | ✅ | ✅ | ❌ | ❌ |
| `COUPONS_MANAGE` | Create and retire promotional discount codes | ✅ | ✅ | ❌ | ❌ |
| `MEDIA_MANAGE` | Curate music library, uploads, and visual media | ✅ | ❌ | ✅ | ❌ |
| `SUPPORT_MANAGE` | Reply to customer tickets and update status | ✅ | ❌ | ❌ | ✅ |
| `STAFF_MANAGE` | Create staff accounts and assign RBAC roles | ✅ | ❌ | ❌ | ❌ |
| `SETTINGS_MANAGE` | Android app versioning, banners, force-update | ✅ | ❌ | ❌ | ❌ |
| `AUDIT_LOGS_VIEW` | Inspect chronological administrative audit stream | ✅ | ❌ | ❌ | ❌ |
