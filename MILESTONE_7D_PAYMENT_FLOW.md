# YOU ARE MINE — CHECKPOINT 7D PAYMENT FLOW
## End-to-End Customer Checkout, Verification & Publication Workflow

**Platform:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Module:** Customer Checkout Flow & State Lifecycle  
**Version:** Checkpoint 7D Production Specification  

---

## 1. Complete Customer Journey Sequence

```
[ Customer in Preview Screen / My Invitations Hub ]
                     │
                     ▼ (Taps "Publish" / "Publish & Get Live Link")
      Route to /checkout/:draftId
                     │
                     ▼
       Fetch Authoritative Quote
       POST /api/pricing/quote { draftId }
                     │
                     ├──────────────────────────────┐
                     ▼ (Optional)                   ▼
             Customer Applies Coupon        Selects Payment Method
             POST /api/pricing/quote        (Razorpay / Play Store / StoreKit)
             { draftId, couponCode }                │
                     │                              │
                     └──────────────┬───────────────┘
                                    ▼
                     Taps "Publish & Pay ₹249"
                                    │
                                    ▼ (Double-tap Debounce & Lock)
                  Create / Reuse Payment Order
                  POST /api/payments/create-order
                  { draftId, couponCode, provider }
                                    │
                                    ▼ (Caches orderId to SecureStore)
                     Launch Native Payment SDK
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
[ Customer Cancels ]                                  [ Payment Captured ]
         │                                                     │
   Silent Reset                                                ▼
(No orphan order)                               Route to /checkout/processing
                                                               │
                                                               ▼
                                               Verify Payment with Backend
                                               POST /api/payments/verify
                                               { orderId, paymentId, signature }
                                                               │
                                                               ▼
                                              Atomic Publication Engine
                                              PublicationActivationService.activate()
                                                               │
                                              ┌────────────────┴────────────────┐
                                              ▼                                 ▼
                                       [ HTTP 200 OK ]                   [ Network Timeout ]
                                              │                                 │
                                              ▼                                 ▼
                                  Route to /checkout/success        Route to /checkout/pending
                                  - Copy Link                       - Order Reference
                                  - Native Share                    - Check Status Action
                                  - View Live Invitation            - Reconciles via /api/orders
                                  - Invalidate Query Cache
```

---

## 2. API Contracts Utilized

### 2.1 Authoritative Pricing Quote
- **Endpoint:** `POST /api/pricing/quote`
- **Request:**
  ```json
  {
    "draftId": "drf_test_01",
    "couponCode": "YOUMINE50"
  }
  ```
- **Response (HTTP 200):**
  ```json
  {
    "success": true,
    "quote": {
      "basePricePaise": 29900,
      "discountPaise": 5000,
      "finalPricePaise": 24900,
      "currency": "INR",
      "formattedBase": "₹299",
      "formattedDiscount": "₹50",
      "formattedFinal": "₹249",
      "couponApplied": "YOUMINE50"
    }
  }
  ```

### 2.2 Payment Order Creation
- **Endpoint:** `POST /api/payments/create-order`
- **Request:**
  ```json
  {
    "draftId": "drf_test_01",
    "couponCode": "YOUMINE50",
    "provider": "razorpay"
  }
  ```
- **Response (HTTP 200):**
  ```json
  {
    "orderId": "order_7820117b5d1f77c4",
    "amount": 24900,
    "currency": "INR",
    "key": "rzp_test_MOCK_KEY_ID"
  }
  ```

### 2.3 Payment Verification & Atomic Publication
- **Endpoint:** `POST /api/payments/verify`
- **Request:**
  ```json
  {
    "orderId": "order_7820117b5d1f77c4",
    "paymentId": "pay_982736152",
    "signature": "f29b8c01d4a8e2...",
    "provider": "razorpay"
  }
  ```
- **Response (HTTP 200):**
  ```json
  {
    "success": true,
    "isIdempotent": false,
    "slug": "karthik-meenakshi-wedding",
    "invitationUrl": "https://youaremine.online/invite/karthik-meenakshi-wedding",
    "publication": {
      "id": "pub_591cf686",
      "status": "ACTIVE",
      "publishedAt": "2026-11-24T18:00:00.000Z"
    }
  }
  ```
