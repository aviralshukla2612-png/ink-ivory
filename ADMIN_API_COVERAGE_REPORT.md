# INK & IVORY — ADMIN API COVERAGE REPORT

**Platform:** Ink & Ivory Bespoke Digital Invitation & Personalized Experience Engine  
**Date:** November 20, 2026  
**Auditor / Architect:** Principal Full-Stack Engineer, SaaS Product Architect & Application Security Specialist  

---

## 1. COMPREHENSIVE ROUTE INVENTORY

Every protected administrative operation across the entire platform is mapped below with its HTTP method, endpoint, permission requirement, rate limit profile, input validation, and test evidence:

| Method | Endpoint | Required Permission | CSRF Guard | Validation Schema | Rate Limit Profile | Test Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/admin/login` | Public (Master Key) | N/A | String (Admin Secret) | `auth` | `milestone1` (Pass) |
| **POST** | `/api/admin/logout` | Session Active | Verified | N/A | `adminApi` | `milestone1` (Pass) |
| **GET** | `/api/admin/me` | Session Active | N/A | N/A | `adminApi` | `milestone1` (Pass) |
| **GET** | `/api/admin` | `DASHBOARD_VIEW` | N/A | N/A | `adminApi` | `milestone2` (Pass) |
| **POST** | `/api/admin` | `TEMPLATES_MANAGE` | Verified | `AdminUpdatePriceSchema` | `adminApi` | `milestone2` (Pass) |
| **GET** | `/api/admin/templates` | `TEMPLATES_VIEW` | N/A | Query params | `adminApi` | `milestone3` (Pass) |
| **POST** | `/api/admin/templates` | `TEMPLATES_MANAGE` | Verified | `CreateTemplateSchema` | `adminApi` | `milestone3` (Pass) |
| **GET** | `/api/admin/templates/[id]` | `TEMPLATES_VIEW` | N/A | UUID/Slug | `adminApi` | `milestone3` (Pass) |
| **PATCH** | `/api/admin/templates/[id]` | `TEMPLATES_MANAGE` | Verified | `UpdateTemplateSchema` | `adminApi` | `milestone3` (Pass) |
| **DELETE** | `/api/admin/templates/[id]` | `TEMPLATES_MANAGE` | Verified | UUID/Slug | `adminApi` | `milestone3` (Pass) |
| **POST** | `/api/admin/templates/[id]/duplicate` | `TEMPLATES_MANAGE` | Verified | `DuplicateTemplateSchema`| `adminApi` | `milestone3` (Pass) |
| **POST** | `/api/admin/templates/[id]/activate` | `TEMPLATES_PUBLISH` | Verified | Boolean | `adminApi` | `milestone3` (Pass) |
| **GET** | `/api/admin/categories` | `CATEGORIES_MANAGE` | N/A | N/A | `adminApi` | `milestone3` (Pass) |
| **POST** | `/api/admin/categories` | `CATEGORIES_MANAGE` | Verified | `CreateCategorySchema` | `adminApi` | `milestone3` (Pass) |
| **PATCH** | `/api/admin/categories/[id]` | `CATEGORIES_MANAGE` | Verified | `UpdateCategorySchema` | `adminApi` | `milestone3` (Pass) |
| **DELETE** | `/api/admin/categories/[id]` | `CATEGORIES_MANAGE` | Verified | Category ID | `adminApi` | `milestone3` (Pass) |
| **GET** | `/api/admin/templates/[id]/builder` | `TEMPLATES_MANAGE` | N/A | Template ID | `adminApi` | `milestone4` (Pass) |
| **PUT** | `/api/admin/templates/[id]/builder` | `TEMPLATES_MANAGE` | Verified | `SaveTemplateBuilderSchema`| `adminApi` | `milestone4` (Pass) |
| **PUT** | `/api/admin/templates/[id]/sections/reorder` | `TEMPLATES_MANAGE` | Verified | `ReorderSectionsSchema` | `adminApi` | `milestone4` (Pass) |
| **GET** | `/api/admin/templates/[id]/versions` | `TEMPLATES_MANAGE` | N/A | Template ID | `adminApi` | `milestone4` (Pass) |
| **POST** | `/api/admin/templates/[id]/versions` | `TEMPLATES_MANAGE` | Verified | `RestoreVersionSchema` | `adminApi` | `milestone4` (Pass) |
| **GET** | `/api/admin/customers` | `CUSTOMERS_VIEW` | N/A | Query params | `adminApi` | `milestone5` (Pass) |
| **GET** | `/api/admin/customers/[id]` | `CUSTOMERS_VIEW` | N/A | Customer ID | `adminApi` | `milestone5` (Pass) |
| **GET** | `/api/admin/drafts` | `DRAFTS_VIEW` | N/A | Query params | `adminApi` | `milestone5` (Pass) |
| **GET** | `/api/admin/drafts/[id]` | `DRAFTS_VIEW` | N/A | Draft ID | `adminApi` | `milestone5` (Pass) |
| **DELETE** | `/api/admin/drafts/[id]` | `CUSTOMERS_MANAGE` | Verified | Draft ID | `adminApi` | `milestone5` (Pass) |
| **GET** | `/api/admin/publications` | `PUBLICATIONS_VIEW` | N/A | Query params | `adminApi` | `milestone6` (Pass) |
| **POST** | `/api/admin/publications/[id]/suspend` | `PUBLICATIONS_MANAGE` | Verified | Reason string | `adminApi` | `milestone6` (Pass) |
| **POST** | `/api/admin/publications/[id]/restore` | `PUBLICATIONS_MANAGE` | Verified | Publication ID | `adminApi` | `milestone6` (Pass) |
| **GET** | `/api/admin/orders` | `FINANCIALS_VIEW` | N/A | Query params | `adminApi` | `milestone7` (Pass) |
| **GET** | `/api/admin/orders/[id]` | `FINANCIALS_VIEW` | N/A | Order ID | `adminApi` | `milestone7` (Pass) |
| **GET** | `/api/admin/payments` | `FINANCIALS_VIEW` | N/A | Query params | `adminApi` | `milestone7` (Pass) |
| **POST** | `/api/admin/payments/[id]/refund` | `REFUNDS_MANAGE` | Verified | `RefundPaymentSchema` | `adminApi` | `milestone7` (Pass) |
| **GET** | `/api/admin/coupons` | `COUPONS_MANAGE` | N/A | Query params | `adminApi` | `milestone7` (Pass) |
| **POST** | `/api/admin/coupons` | `COUPONS_MANAGE` | Verified | `CreateCouponSchema` | `adminApi` | `milestone7` (Pass) |
| **PATCH** | `/api/admin/coupons/[id]` | `COUPONS_MANAGE` | Verified | `UpdateCouponSchema` | `adminApi` | `milestone7` (Pass) |
| **DELETE** | `/api/admin/coupons/[id]` | `COUPONS_MANAGE` | Verified | Coupon ID | `adminApi` | `milestone7` (Pass) |
| **GET** | `/api/admin/media` | `MEDIA_MANAGE` | N/A | Query params | `adminApi` | `milestone8` (Pass) |
| **DELETE** | `/api/admin/media/[id]` | `MEDIA_MANAGE` | Verified | Media ID | `adminApi` | `milestone8` (Pass) |
| **GET** | `/api/admin/support` | `SUPPORT_MANAGE` | N/A | Query params | `adminApi` | `milestone8` (Pass) |
| **POST** | `/api/admin/support` | `SUPPORT_MANAGE` | Verified | `CreateSupportTicketSchema` | `adminApi` | `milestone8` (Pass) |
| **GET** | `/api/admin/support/[id]` | `SUPPORT_MANAGE` | N/A | Ticket ID | `adminApi` | `milestone8` (Pass) |
| **PATCH** | `/api/admin/support/[id]` | `SUPPORT_MANAGE` | Verified | `UpdateSupportTicketSchema` | `adminApi` | `milestone8` (Pass) |
| **POST** | `/api/admin/support/[id]/reply` | `SUPPORT_MANAGE` | Verified | `AddSupportReplySchema` | `adminApi` | `milestone8` (Pass) |
| **GET** | `/api/admin/staff` | `STAFF_MANAGE` | N/A | N/A | `adminApi` | `milestone8` (Pass) |
| **POST** | `/api/admin/staff` | `STAFF_MANAGE` | Verified | `CreateStaffSchema` | `adminApi` | `milestone8` (Pass) |
| **PATCH** | `/api/admin/staff/[id]` | `STAFF_MANAGE` | Verified | `UpdateStaffSchema` | `adminApi` | `milestone8` (Pass) |
| **DELETE** | `/api/admin/staff/[id]` | `STAFF_MANAGE` | Verified | Staff User ID | `adminApi` | `milestone8` (Pass) |
| **GET** | `/api/admin/settings` | `SETTINGS_MANAGE` | N/A | N/A | `adminApi` | `milestone8` (Pass) |
| **PUT** | `/api/admin/settings` | `SETTINGS_MANAGE` | Verified | `UpdateSettingsSchema` | `adminApi` | `milestone8` (Pass) |
| **GET** | `/api/admin/audit` | `AUDIT_LOGS_VIEW` | N/A | Query params | `adminApi` | `milestone8` (Pass) |

---

## 2. AUTOMATED REGRESSION SUITE EXECUTION SUMMARY

Executing `node scripts/run-all-milestones.mjs`:
```
==========================================================
   ALL 8 MILESTONES VERIFIED WITH 100% SUCCESSFUL PASS!   
==========================================================
  ✓ scripts/milestone1-rbac-test.mjs (Exit Code: 0) — 30/30 PASSED
  ✓ scripts/milestone2-dashboard-test.mjs (Exit Code: 0) — 21/21 PASSED
  ✓ scripts/milestone3-templates-test.mjs (Exit Code: 0) — 27/27 PASSED
  ✓ scripts/milestone4-builder-test.mjs (Exit Code: 0) — 18/18 PASSED
  ✓ scripts/milestone5-customers-test.mjs (Exit Code: 0) — 23/23 PASSED
  ✓ scripts/milestone6-publications-test.mjs (Exit Code: 0) — 19/19 PASSED
  ✓ scripts/milestone7-finance-test.mjs (Exit Code: 0) — 33/33 PASSED
  ✓ scripts/milestone8-operations-test.mjs (Exit Code: 0) — 27/27 PASSED
==========================================================
TOTAL TESTS PASSED: 198 / 198 (100% SUCCESS)
```
