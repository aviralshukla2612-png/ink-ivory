# YOU ARE MINE — CHECKPOINT 7C RECOVERY & IDEMPOTENCY
## Architectural Guide to Fault Tolerance, Idempotency & Data Integrity

**Platform:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Module:** Reliability, Recovery & Idempotency Engineering  
**Version:** Checkpoint 7C Technical Reference  

---

## 1. Idempotency Guarantees

In transactional payment engineering, **idempotency** guarantees that identical requests executed multiple times yield the exact same outcome as a single execution, without side effects or duplicate resource allocation.

### 1.1 Webhook Deduplication Layer
- **Persistent Event Store:**  
  Every webhook payload carries a unique event ID (e.g., `evt_razorpay_98273615`). Checkpoint 7C records all processed webhook event IDs in persistent storage (`store.recordWebhookEvent`).
- **Memory + Database Hybrid Caching:**  
  Checks fast in-memory LRU cache first; if a cache miss occurs (e.g., following a worker restart or serverless cold start), queries the persistent database table.
- **Immediate ACK:**  
  Duplicate webhook events are acknowledged with `HTTP 200 OK` and `{ status: 'duplicate_ignored' }`, preventing provider retry storms.

### 1.2 Publication Activation Idempotency
- **Order ID Mapping:**  
  Publications maintain a mandatory `orderId` foreign key. `PublicationActivationService.activate()` checks `store.getPublicationByOrderId(orderId)`.
- **Draft ID Mapping:**  
  If an order ID query is not provided, the draft ID is queried via `store.getPublicationByDraftId(draftId)`.
- **Identical Response Payload:**  
  When an existing publication is detected, the service returns:
  ```json
  {
    "success": true,
    "isIdempotent": true,
    "publication": { ... },
    "slug": "karthik-meenakshi-ceremony-e86c",
    "publicUrl": "https://youaremine.in/invite/karthik-meenakshi-ceremony-e86c"
  }
  ```

---

## 2. Slug Collision Resolution Engine

Public invitation URLs have the form:
`https://youaremine.in/invite/:slug`

### 2.1 Slug Derivation Hierarchy
1. `requestedSlug` provided by customer in draft settings (sanitized to lowercase alphanumeric and hyphens).
2. Couple's names from draft fields (e.g., `"Aarav & Riya"` -> `"aarav-riya"`).
3. Draft title (e.g., `"Royal Palace Wedding"` -> `"royal-palace-wedding"`).
4. Template fallback (e.g., `"invitation"`).

### 2.2 Collision Algorithm
```typescript
let finalSlug = candidateSlug;
const allInvitations = store.getInvitations();

// Check if slug is already used by a different draft
const isTaken = allInvitations.some(inv => inv.slug === finalSlug && inv.draftId !== draft.id);

if (isTaken) {
  // Append 4-character deterministic random cryptographic hex salt
  const salt = crypto.randomBytes(2).toString('hex');
  finalSlug = `${candidateSlug}-${salt}`;
}
```

### 2.3 Slug Stability Across Retries
If the publication already exists for this draft, the engine skips slug derivation entirely and uses the existing `publication.slug`. Retries, subsequent webhooks, and client polls **never** re-salt an established invitation.

---

## 3. Automated Background Recovery Engine

### 3.1 Failure Scenario: The Orphaned Paid Order
Consider the edge case where:
1. Customer pays ₹299 on Razorpay.
2. Razorpay captures the payment and sends a webhook.
3. The server experiences a container termination or network timeout exactly between recording `order.status = 'PAID'` and writing the publication record.
4. The customer is charged, but no public invitation URL exists.

### 3.2 Automated Recovery Mechanism (`PublicationRecoveryService`)
The recovery worker runs periodically (or via operational admin trigger):
1. **Query:** Scans all orders where `status === 'PAID'`.
2. **Correlate:** Queries publications matching `order.id` or `order.draftId`.
3. **Identify:** Filters orders where no publication record exists.
4. **Reconcile:** Invokes `PublicationActivationService.activate({ orderId, actor: 'RECOVERY_WORKER' })`.
5. **Log & Alert:** Emits structured security audit logs for administrative tracking.

```
[PublicationRecoveryService] Running orphaned paid order recovery scan...
[SECURITY][WARN][ORPHANED_PAID_ORDER_DETECTED] {"orderId":"order_99182","draftId":"drf_123"}
[SECURITY][INFO][ORPHANED_ORDER_RECOVERED_SUCCESSFULLY] {"orderId":"order_99182","slug":"aarav-riya-royal-wedding"}
```

---

## 4. Immutable Publication Snapshotting

When an invitation is published, guests visit the public web link to view event schedules, RSVP, and view photos. If the customer subsequently opens their draft in the native editor and makes experimental changes, the live invitation must remain pristine until explicitly republished.

Checkpoint 7C enforces deep snapshot isolation:
- `publication.snapshotData` captures a detached clone of:
  - `fields`: Couple names, ceremony dates, muhurtham times, venue addresses, custom quotes.
  - `music_url`: Background music audio track.
  - `design`: Theme colors, typography selections, layout tokens.
- Mutations to the draft object in `store.data.drafts` do not affect `snapshotData`.
