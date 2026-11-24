# YOU ARE MINE — MILESTONE 7C PRE-IMPLEMENTATION AUDIT
## Concurrency, Persistence, State Recovery & Transactional Integrity Audit

**Date:** November 24, 2026  
**Auditor:** Senior Backend & Distributed Transaction Systems Architect  
**Objective:** Rigorous technical audit of Checkpoint 7B payment and publication architecture under real-world concurrency, server clustering, and crash failure modes.

---

### 1. DIRECT ANSWERS TO MANDATORY AUDIT QUESTIONS

#### 1. Is the order mutex process-local or distributed?
**Process-Local (In-Memory).**  
In `src/lib/payments/deduplication.ts`, `inFlightLocks` is implemented as `new Map<string, number>()`.  
- **Vulnerability:** This mutex only protects requests arriving within the exact same Node.js OS process thread. If the application is deployed with horizontal scaling (e.g. Next.js on multiple containers, Kubernetes pods, PM2 cluster, or Vercel/serverless instances), Node Instance A has zero visibility into the locks held by Node Instance B.

#### 2. Is webhook event deduplication stored in memory or persistently?
**In-Memory Only.**  
In `src/lib/payments/deduplication.ts`, `processedEvents` is implemented as `new Map<string, { timestamp, status }>()`.  
- **Vulnerability:** If the server restarts, redeploys, or crashes, the entire deduplication map is erased. When Razorpay retries a webhook delivery (standard Razorpay policy retries up to 24 hours), the server treats the redelivered event as completely new, risking duplicate processing.

#### 3. Can multiple server instances safely process the same order?
**No.**  
Because both deduplication and order locking reside in ephemeral Node.js process memory, two concurrent requests routed to different server instances will execute side-by-side without mutual exclusion.

#### 4. Can webhook and verification requests race?
**Yes.**  
In multi-instance deployments, or if an in-memory lock expires (30-second timeout), a client-driven `POST /api/payments/verify` and an asynchronous gateway `POST /api/payments/webhook` will race. Because payment recording and draft publishing were executed as sequential asynchronous steps rather than a single atomic transaction, state anomalies can occur.

#### 5. Can a webhook mark an order paid without publishing its draft?
**Yes.**  
In `src/app/api/payments/webhook/route.ts`:
```ts
await store.recordPayment({ ... }); // 1. Order marked PAID
const draft = await store.getDraft(order.draftId);
if (draft && draft.status !== "PUBLISHED") {
  await store.publishDraft({ draftId: draft.id, paymentId: event.paymentId }); // 2. Can throw
}
```
If `store.publishDraft(...)` throws an error (e.g. network timeout, transient database deadlock, unhandled slug conflict), the payment has already been recorded and the order status is set to `PAID`, but the draft remains unpublished.

#### 6. Can a later verification request incorrectly return success without an existing publication?
**In Edge Cases, Yes.**  
In `verify/route.ts`, if `order.status === 'PAID'` but `allInvitations.find(...)` returns null (due to failure in step 5), the endpoint falls through and re-invokes `recordPayment` and `publishDraft`. If the payment record fails uniqueness checks or throws, the client receives an unhandled 500 error, leaving the customer charged but without an invitation link.

#### 7. Can payment be recorded without the corresponding order update?
**Yes, in non-transactional database updates.**  
If `PaymentRecord` is inserted but the process crashes before updating `PaymentOrderRecord.status = 'PAID'`, the database is left in a corrupted state where a captured payment exists with an orphaned `PENDING` order.

#### 8. Can publication be created without a verified captured payment?
**Historically, Yes.**  
In `store.publishDraft(params: { draftId: string; paymentId?: string })`, `paymentId` was optional. Any internal routine or administrative call could invoke `publishDraft` on a draft without verifying that a verified `PaymentRecord` with status `CAPTURED` exists for that draft.

#### 9. Can two publications be created for the same order?
**Yes, under high concurrency.**  
In `store.publishDraft`, the check `this.data!.publications.find(p => p.draftId === draft.id)` is not protected by a database unique constraint across processes. Two simultaneous requests on separate processes can both see zero publications and create duplicate publication records with different IDs and different slugs.

#### 10. What happens when the process crashes between payment capture and publication?
**The order is orphaned.**  
The order remains marked `PAID`, but no publication is created. In Checkpoint 7B, there was no persistent outbox, no recovery job queue, and no reconciliation worker. The customer was charged without receiving their published website.

---

### 2. ARCHITECTURAL REQUIREMENTS FOR CHECKPOINT 7C

To achieve genuine enterprise-grade transactional integrity:

1. **Persistent Deduplication & Order Locks**:
   - Webhook event IDs must be stored persistently in the database (`WebhookEventRecord` / `store.data.webhookEvents`) with unique constraint enforcement.
2. **Unified Publication Activation Service (`PublicationActivationService`)**:
   - Both `POST /api/payments/verify` and `POST /api/payments/webhook` must call a single, centralized service.
   - The service must enforce that publication is created ONLY when a verified `PaymentRecord` with status `CAPTURED` exists.
   - Database-level unique constraint on `orderId` and `draftId` for publications.
3. **Collision-Safe & Stable Slug Allocation**:
   - Database uniqueness constraint on `slug`.
   - Idempotent retries MUST return the exact existing slug and never generate a second slug for the same publication.
4. **Publication Failure Outbox & Recovery Engine (`PublicationRecoveryService`)**:
   - When payment is captured, an atomic publication job is tracked (`PUBLICATION_PENDING`).
   - If publication fails, the job transitions to `PUBLICATION_FAILED_RETRYABLE`.
   - A durable recovery engine scans for paid orders lacking a live publication and automatically recovers them with exponential backoff.
5. **Snapshot Immutability**:
   - Full JSON snapshot of all fields, design coordinates, couple photo, custom music URL, and template version saved in `publication.snapshotData`.
6. **Safe Refund Policy**:
   - Processing refunds marks payment and order as `REFUNDED` while preserving the publication record and live guest site unless explicit admin revocation is authorized.
