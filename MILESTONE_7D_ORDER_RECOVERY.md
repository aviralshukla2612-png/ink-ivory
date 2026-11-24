# YOU ARE MINE — CHECKPOINT 7D ORDER RECOVERY
## Client-Side Interruption Recovery & Operational Background Sync

**Platform:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Module:** Payment Reconciliation & Fault Recovery  
**Version:** Checkpoint 7D Production Specification  

---

## 1. Client Interruption Recovery Matrix

| Interruption Event | System State | Client Recovery Behavior | Result |
| :--- | :--- | :--- | :--- |
| **App Killed During Payment** | Order remains `ATTEMPTED` in backend; `yam_active_checkout_pending` saved in SecureStore | On app restart, app reads pending checkout. Queries `GET /api/orders/:id`. If uncaptured, allows customer to resume checkout without duplicate billing. | Zero duplicate charge; safe resumption |
| **Customer Switches Apps for UPI** | Order in `ATTEMPTED`; payment captured by UPI provider via background webhook | When customer switches back, client dispatches verification or checks `GET /api/orders/:id`. Webhook-first engine already established publication. Client receives idempotent HTTP 200. | Instant navigation to Success Screen |
| **Network Drops After Payment** | Order captured and marked `PAID`; verification POST fails with network error | App routes to `PaymentPendingScreen`. Customer taps "Check Payment Status" when connection returns. Queries `recoverPendingOrder()`. | Navigates to live invitation once connection restores |
| **Catastrophic Process Crash** | Payment captured by provider, but server dies before creating publication | Operational Cron `POST /api/payments/recovery` scans orders where `status === 'PAID'` lacking publications and completes activation automatically. | Invitation activated within 5 minutes |

---

## 2. SecureStore Pending Order Storage

When an order is created, the minimum necessary reference is saved:
```javascript
await SecureStore.setItemAsync(
  'yam_active_checkout_pending',
  JSON.stringify({
    orderId: 'order_xxx',
    draftId: 'drf_yyy',
    amount: 24900,
    currency: 'INR',
    provider: 'razorpay',
    createdAt: new Date().toISOString()
  })
);
```

### Safety Rules:
1. **Never store payment secrets or private keys.**
2. **Clear reference immediately upon confirmed publication (`PaymentService.clearPendingCheckout()`).**
3. **If pending checkout is older than 30 minutes, treat as expired and allow fresh checkout initiation.**

---

## 3. Operational Cron Recovery Endpoint

- **Endpoint:** `POST /api/payments/recovery` (also accepts `GET` for simple monitoring pings).
- **Security:** Requires `Authorization: Bearer <CRON_SECRET>` or `x-cron-secret: <CRON_SECRET>` header.
- **Frequency:** Configured to run every 5 minutes.
- **Response:**
  ```json
  {
    "success": true,
    "timestamp": "2026-11-24T18:00:00.000Z",
    "recoveredOrdersCount": 1,
    "orphanedFound": 1,
    "status": "RECOVERY_SCAN_COMPLETED"
  }
  ```
