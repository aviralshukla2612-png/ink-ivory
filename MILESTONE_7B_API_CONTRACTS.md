# YOU ARE MINE — MILESTONE 7B API CONTRACTS

---

### 1. `POST /api/pricing/quote`
Calculates authoritative pricing on the server.

- **Headers:** `Content-Type: application/json`, `x-guest-token?: string`
- **Request Body:**
  ```json
  {
    "templateId": "tpl-south-indian-temple-03",
    "couponCode": "YOUMINE50"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "quote": {
      "templateId": "tpl-south-indian-temple-03",
      "templateTitle": "Karthik & Meenakshi — Thirumanam South Indian Temple",
      "currency": "INR",
      "baseAmountPaise": 29900,
      "discountPaise": 5000,
      "finalAmountPaise": 24900,
      "baseAmountRupees": 299,
      "finalAmountRupees": 249,
      "couponCode": "YOUMINE50",
      "couponApplied": true,
      "features": [
        "Your Custom Shareable Link",
        "Instant 1-Click WhatsApp sharing",
        "Live & Active for 1 Full Year",
        "Background music & opening animations included"
      ]
    }
  }
  ```

---

### 2. `POST /api/payments/create-order`
Creates an authoritative payment order and gateway transaction.

- **Headers:** `Content-Type: application/json`, `x-guest-token: string`
- **Request Body:**
  ```json
  {
    "draftId": "drf_aa02ac14f02f",
    "couponCode": "LOVE2026",
    "provider": "razorpay",
    "customerPhone": "+919876543210",
    "customerName": "Aarav & Riya"
  }
  ```
- **Security Validations:**
  1. `guestToken` verified against `draft.guestToken` (IDOR defense).
  2. Draft status must not be `PUBLISHED`.
  3. Authoritative server price recalculated; client amounts ignored.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "orderId": "order_Oq3wQ9A1bCdEf",
    "amount": 23920,
    "currency": "INR",
    "keyId": "rzp_live_U2OCXy6deORpA9",
    "draftId": "drf_aa02ac14f02f",
    "isLiveRazorpayOrder": true,
    "provider": "razorpay",
    "quote": { ... }
  }
  ```
- **Error Responses:**
  - `400`: `{ "success": false, "error": "This draft has already been published." }`
  - `403`: `{ "success": false, "error": "Unauthorized access: You do not own this draft" }`
  - `404`: `{ "success": false, "error": "Draft not found" }`

---

### 3. `POST /api/payments/verify`
Cryptographically verifies payment and activates publication.

- **Headers:** `Content-Type: application/json`, `x-guest-token: string`
- **Request Body:**
  ```json
  {
    "orderId": "order_Oq3wQ9A1bCdEf",
    "paymentId": "pay_Oq3xYz123456",
    "signature": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "draftId": "drf_aa02ac14f02f",
    "provider": "razorpay",
    "requestedSlug": "aarav-riya-celebration"
  }
  ```
- **Security Validations:**
  1. Concurrency lock acquired on `orderId`.
  2. Order draft must match `draftId`.
  3. Ownership verification (`verifyOwnership`).
  4. Cryptographic HMAC-SHA256 signature verification.
  5. Idempotency guard: If already `PAID`, returns publication without re-charging.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Payment verified and invitation published!",
    "slug": "aarav-riya-celebration",
    "invitationUrl": "https://youaremine.online/invite/aarav-riya-celebration",
    "publicationId": "pub_e419b4ef",
    "draftId": "drf_aa02ac14f02f"
  }
  ```
- **Error Responses:**
  - `400`: `{ "success": false, "error": "Invalid payment signature. Verification rejected." }`
  - `403`: `{ "success": false, "error": "Security violation: Order does not match draft." }`

---

### 4. `POST /api/payments/webhook`
Asynchronous payment gateway callback.

- **Headers:** `Content-Type: application/json`, `x-razorpay-signature: string`
- **Request Body:** Raw gateway event payload
- **Security Validations:**
  1. Signature validated via `provider.verifyWebhook`.
  2. Event ID checked for deduplication (`isEventProcessed`).
  3. Mutex lock acquired on `order_id`.
  4. Audit log written to `store.logAudit`.
- **Response (200 OK):**
  ```json
  { "status": "ok", "eventId": "evt_rzp_17955133" }
  ```
  *(Or if duplicate: `{ "status": "ok", "duplicate": true }`)*
