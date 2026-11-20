# INK & IVORY — ADMIN DATABASE GAP ANALYSIS & SCHEMA MIGRATION BLUEPRINT

**Platform:** Ink & Ivory Bespoke Digital Invitation & Personalized Experience Engine  
**Document:** Datastore Model Gap Analysis, Entity Mappings & Migration Blueprint  
**Date:** November 20, 2026  
**Architect:** Database Architect & Principal Full-Stack Engineer  

---

## 1. COMPREHENSIVE ENTITY COMPARISON & GAP MATRIX

| Logical Entity | Current JSON Store (`store.ts`) | Current Prisma Schema (`prisma/schema.prisma`) | Production Admin Panel Requirement | Migration / Implementation Action Required |
| :--- | :---: | :---: | :---: | :--- |
| **AdminUser / Staff** | Basic record in `users` | Modeled as `User` with `role: ADMIN` | 5 Granular staff roles (`SUPER_ADMIN`, `ADMIN`, `FINANCE`, `CONTENT_MANAGER`, `SUPPORT`), status (`ACTIVE`/`DEACTIVATED`) | Add `StaffRecord` with role and status to `store.ts`; expand `Role` enum in Prisma. |
| **AdminSession** | Cryptographic token | Modeled as `AdminSession` | Multi-device session tracking and instant revocation | Persist issued sessions in `store.ts` for immediate revocation on deactivation. |
| **Template** | Implemented (`templates`) | Modeled as `Template` | Full CRUD, status (`DRAFT`, `ACTIVE`, `ARCHIVED`), tags, renderer ID | Add `status`, `rendererId`, `tags`, and `authorId` to `TemplateRecord`. |
| **TemplateVersion** | Hardcoded version `1` | None | Immutable snapshots of published versions, version number, rollback history | Create `TemplateVersionRecord` in `store.ts` and `TemplateVersion` in Prisma. |
| **TemplateSection** | Embedded in designConfig | None | Section builder items (type, title, isEnabled, order, settings, fieldsSchema) | Create `TemplateSectionRecord` in `store.ts` and `TemplateSection` in Prisma. |
| **TemplateCategory** | Implicit string `occasion` | Implicit string `occasion` | Category CRUD with slug, name, icon, description, displayOrder, isActive | Create `CategoryRecord` in `store.ts` and `Category` model in Prisma. |
| **Customer** | Implicit `users` / `guestToken` | `User` & `GuestIdentity` | Dedicated Customer view with spending, draft count, publication count, notes, and status | Create unified customer query abstraction in `store.ts` aggregating draft/order data. |
| **Draft** | Implemented (`drafts`) | Modeled as `Draft` | Read-only inspection, search, filter, and pagination | Add administrative filter/search query helpers to `store.ts`. |
| **Publication** | Implemented (`publications`) | Modeled as `Publication` | Administrative suspension (`SUSPENDED`), reason logging, restoration (`ACTIVE`) | Add `suspendedAt` and `suspensionReason` to `PublicationRecord` and `Publication` model. |
| **PaymentOrder** | Implemented (`orders`) | Modeled as `PaymentOrder` | Order listing, search, status tracking | Add server-side search and status filters to `store.ts`. |
| **PaymentTransaction** | Implemented (`payments`) | Modeled as `PaymentTransaction` | Financial reconciliation and refund records | Add `refundedAmount`, `refundReason` to `PaymentRecord`. |
| **Coupon** | In-memory quote logic | Missing model | Coupon CRUD with code, discountType, discountValue, minOrder, usage limits, counters | Create `CouponRecord` in `store.ts` and `Coupon` model in Prisma. |
| **MediaAsset** | Local files in `/uploads/` | `DraftMedia` model | Media library managing template, background, audio, and customer assets | Create `MediaAssetRecord` in `store.ts` and `MediaAsset` model in Prisma. |
| **SupportTicket** | Missing | Missing model | Support ticket system with status, priority, customer email, messages | Create `SupportTicketRecord` in `store.ts` and `SupportTicket` in Prisma. |
| **Notification** | Dynamic activity stream | Missing model | Read/unread operational notifications for payments, security alerts | Create `NotificationRecord` in `store.ts` and `Notification` in Prisma. |
| **PlatformSetting** | Environment variables | Missing model | Non-secret platform settings (brand, support email, maintenance mode) | Create `PlatformSettingsRecord` in `store.ts` and `PlatformSetting` in Prisma. |
| **AuditEvent** | Implemented (`auditLogs`) | Modeled as `AuditEvent` | Immutability, staff attribution, automated credential redaction | Implemented in `src/lib/security/audit.ts` and `store.ts`. |

---

## 2. NEW ENTITY TYPE DEFINITIONS FOR `STORE.TS`

```typescript
// Categories
export interface CategoryRecord {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Template Versions & Sections
export interface TemplateVersionRecord {
  id: string;
  templateId: string;
  versionNumber: number;
  snapshotConfig: Record<string, any>;
  changeSummary: string;
  createdBy: string;
  createdAt: string;
}

export interface TemplateSectionRecord {
  id: string;
  templateId: string;
  sectionType: string;
  title: string;
  order: number;
  isEnabled: boolean;
  settings: Record<string, any>;
  fieldsSchema: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Coupons & Promotions
export interface CouponRecord {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number; // Percentage (e.g. 20) or Paise (e.g. 5000 = Rs 50)
  minOrderValuePaise: number;
  maxDiscountPaise?: number;
  usageLimit?: number;
  usageCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Support Tickets
export interface SupportMessageRecord {
  id: string;
  ticketId: string;
  sender: "CUSTOMER" | "STAFF";
  senderName: string;
  message: string;
  createdAt: string;
}

export interface SupportTicketRecord {
  id: string;
  ticketNumber: string;
  customerEmail: string;
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "WAITING_FOR_CUSTOMER" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assignedStaffId?: string;
  internalNotes?: string;
  messages: SupportMessageRecord[];
  createdAt: string;
  updatedAt: string;
}

// Platform Settings
export interface PlatformSettingsRecord {
  id: string;
  platformName: string;
  supportEmail: string;
  supportPhone?: string;
  defaultCurrency: string;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  maxAudioUploadBytes: number;
  maxImageUploadBytes: number;
  updatedAt: string;
}
```

---

## 3. PERSISTENCE HARMONY & MIGRATION POLICY

1. **Backwards Compatibility**: Existing drafts, orders, publications, and guest tokens must never break.
2. **Dual-Ready Store Service**: All new entities will be seamlessly integrated into `StoreService` in `src/lib/store.ts` with auto-initialization from default data.
3. **Atomic Persistence**: Every mutation triggers `this.save()` writing to `data/ink-ivory-store.json`.
4. **Prisma Synchronization**: When transitioning to cloud PostgreSQL, `scripts/migrate-json-to-postgres.mjs` will map all new JSON records directly into PostgreSQL tables with matching foreign key constraints.
