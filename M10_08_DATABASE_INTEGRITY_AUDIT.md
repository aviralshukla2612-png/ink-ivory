# M10-08: DATABASE INTEGRITY & DATA ARCHITECTURE AUDIT

**Project:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Milestone:** 10 — Comprehensive Product, Codebase & System-Wide Audit  
**Audit Timestamp:** 2026-11-25T11:07:05+05:30  
**Evaluator:** Database Architect & Reliability Engineer  
**Database:** PostgreSQL via Prisma ORM (`prisma/schema.prisma`)  

---

## 1. Schema Architecture & Model Inventory

The database schema defines 14 relational models optimized for ACID safety, tenant isolation, and publication immutability:

| Model Name | Primary Key | Critical Constraints | Foreign Keys | Indexed Columns |
|---|---|---|---|---|
| `User` | `id` (UUID) | `email` unique | None | `[email]` |
| `GuestIdentity` | `id` (UUID) | `guestToken` unique | None | `[guestToken]` |
| `GuestSession` | `id` (UUID) | None | `guestIdentityId` (Cascade) | `[guestIdentityId]` |
| `AdminSession` | `id` (UUID) | `sessionToken` unique | None | `[sessionToken]` |
| `Template` | `id` (String)| `slug` unique | None | `[slug]`, `[occasion]` |
| `TemplatePrice` | `id` (UUID) | None | `templateId` (Cascade) | `[templateId]` |
| `Draft` | `id` (String)| None | `templateId`, `userId`, `guestIdentityId` | `[guestToken]`, `[userId]`, `[templateId]`, `[status]` |
| `DraftMedia` | `id` (UUID) | None | `draftId` (Cascade) | `[draftId]` |
| `PaymentOrder` | `id` (UUID) | `orderId` unique | `draftId` (Restrict), `userId`, `guestIdentityId` | `[orderId]`, `[draftId]`, `[guestToken]` |
| `PaymentTransaction`| `id` (UUID)| `paymentId` unique | `orderId` (Restrict) | `[paymentId]`, `[orderId]` |
| `Invitation` | `id` (UUID) | `slug` unique, `draftId` unique| `draftId` (Restrict), `templateId` | `[slug]`, `[draftId]` |
| `Publication` | `id` (UUID) | `orderId` unique, `draftId` unique| `draftId` (Restrict), `invitationId` (Restrict)| `[orderId]`, `[draftId]`, `[invitationId]`, `[status]` |
| `RecoveryJobLock`| `id` (UUID)| `jobName` unique | None | `[jobName]`, `[expiresAt]` |
| `AuditEvent` | `id` (UUID) | None | `userId` (SetNull) | `[action]`, `[entityId]`, `[guestToken]`, `[createdAt]` |

---

## 2. Critical Relational Invariants

1. **Delete Cascade Safeguards (`onDelete: Restrict`):**
   - Critical commercial tables (`PaymentOrder`, `PaymentTransaction`, `Invitation`, `Publication`) enforce `onDelete: Restrict` against `Draft`.
   - Customers cannot accidentally or maliciously delete a draft that has an associated paid order or active live publication.
2. **Immutable Publication Snapshots:**
   - In `Publication`, the column `snapshotData Json` holds a complete frozen copy of `fields`, `design`, `sections`, `rsvpConfig`, and `customAudioUrl`.
   - Verified via `tests/e2e/milestone7e/e2e-certification.ts`: Modifying draft names, dates, or media post-publication causes zero mutation to `snapshotData`.
3. **Distributed Worker Concurrency:**
   - The `RecoveryJobLock` model enforces single-worker execution with cryptographically random `ownerId` and automatic lease expiration recovery (`heartbeatAt`, `expiresAt`).

---

## 3. Database Backup & Restore Procedures

- **Backup Script:** `scripts/backup-database.js` produces timestamped `.sql.gz` dump archives.
- **Restore Verification:** Validated via `tests/test-recovery-lease.ts` and automated snapshot restoration tests.
