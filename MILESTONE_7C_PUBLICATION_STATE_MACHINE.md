# YOU ARE MINE — CHECKPOINT 7C PUBLICATION STATE MACHINE
## Formal Transactional Lifecycle & Concurrency Model

**Platform:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Module:** Publication Activation & Lifecycle Engine  
**Version:** Checkpoint 7C Production Specification  

---

## 1. System State Machine Overview

The payment-to-publication workflow orchestrates transitions across three interrelated domain entities:
1. **Order Record (`OrderStatus`)**
2. **Draft Record (`DraftStatus`)**
3. **Publication Record (`PublicationStatus`)**

```
+----------------------------------------------------------------------------------------------------+
|                                    ORDER & DRAFT LIFECYCLE                                         |
+----------------------------------------------------------------------------------------------------+
                                      [ Customer Customizes Draft ]
                                                   |
                                                   v
                                     Draft: DRAFT (Editable)
                                                   |
                                   POST /api/payments/create-order
                                                   |
                                                   v
                                     Order: ATTEMPTED
                                     Draft: PAYMENT_PENDING
                                                   |
                   +-------------------------------+-------------------------------+
                   |                                                               |
            [ Payment Captured ]                                         [ Payment Failed / Dismissed ]
                   |                                                               |
                   v                                                               v
              Order: PAID                                                    Order: FAILED
                   |                                                         Draft: DRAFT (Recoverable)
                   |
         +---------+---------+
         |                   |
    [ Webhook First ]   [ Verify First ]
         |                   |
         +---------+---------+
                   |
                   v
       [ Acquire Mutex Lock ]
                   |
         [ Idempotency Check ]
        (Does pub already exist?)
         /               \
       YES                NO
       /                   \
 [ Return Existing ]   [ Generate Unique Slug ]
                       [ Capture Snapshot ]
                       [ Create PublicationRecord: ACTIVE ]
                       [ Create InvitationRecord ]
                       [ Update Draft: PUBLISHED ]
                               \
                                v
                       [ Release Mutex Lock ]
                                |
                                v
                       Return HTTP 200
```

---

## 2. Entity State Transition Matrices

### 2.1 Order State Transitions
| Current State | Event Trigger | Next State | Allowed? | Idempotent Handling |
| :--- | :--- | :--- | :---: | :--- |
| `CREATED` | User proceeds to checkout | `ATTEMPTED` | Yes | Existing active order returned |
| `ATTEMPTED` | Provider capture (`payment.captured` / verify) | `PAID` | Yes | Triggers publication engine |
| `ATTEMPTED` | Provider failure / timeout | `FAILED` | Yes | Draft restored to `DRAFT` |
| `PAID` | Duplicate webhook / verify request | `PAID` | Yes | **Idempotent No-Op** (Existing pub returned) |
| `PAID` | Admin refund issued | `REFUNDED` | Yes | Public invitation remains preserved |
| `FAILED` | Retry checkout attempt | `ATTEMPTED` | Yes | New provider order ID generated |
| `REFUNDED` | Any verify / capture event | `REFUNDED` | **No** | Rejected: order already refunded |

### 2.2 Draft State Transitions
| Current State | Event Trigger | Next State | Notes |
| :--- | :--- | :--- | :--- |
| `DRAFT` | User opens checkout | `PAYMENT_PENDING` | Locks draft from contradictory editing |
| `PAYMENT_PENDING` | Order payment succeeds | `PUBLISHED` | Marks draft as published |
| `PAYMENT_PENDING` | Checkout abandoned / cancelled | `DRAFT` | Restores editability without data loss |
| `PUBLISHED` | Order re-verification | `PUBLISHED` | Idempotent no-op |
| `PUBLISHED` | User edits draft in editor | `PUBLISHED` | Draft edits saved; live publication unaffected |

### 2.3 Publication State Transitions
| Current State | Event Trigger | Next State | Notes |
| :--- | :--- | :--- | :--- |
| *None* | `PublicationActivationService.activate()` | `ACTIVE` | Created atomically with immutable snapshot |
| `ACTIVE` | Duplicate webhook / verify calls | `ACTIVE` | Re-returns identical publication record |
| `ACTIVE` | Admin suspension (`/admin/publications`) | `SUSPENDED` | Public URL displays graceful notice |
| `ACTIVE` | Retention expiration (e.g. 1 year post-event) | `EXPIRED` | Archived safely |

---

## 3. Concurrency & Race Condition Resolution

### 3.1 The Webhook vs. Client Verification Race
In production mobile apps, Razorpay/Apple/Google payments emit a webhook from provider servers while the mobile app's native checkout SDK returns a payment response to the client. Both trigger backend publication activation:

```
Provider Webhook ───────► POST /api/payments/webhook ──┐
                                                        ├─► PublicationActivationService
Mobile App Verify ──────► POST /api/payments/verify  ──┘
```

**Resolution Protocol:**
1. **Per-Order Mutex Lock:**  
   `PaymentDeduplicationService.acquireOrderLock(orderId)` uses an in-memory atomic set.
   - Whichever request acquires the lock first executes the database write.
   - The second concurrent request fails to acquire the lock and waits up to 2,000ms with polling retries.
2. **Double-Check Idempotency Guard:**  
   Immediately upon lock acquisition, `store.getPublicationByOrderId(orderId)` is evaluated. If a publication already exists, it is immediately returned without recreating records.
3. **Database Slug Stability:**  
   Because the first request completed the database record, the second request reads the assigned slug directly from the store, guaranteeing identical URLs in both responses.
