# YOU ARE MINE — CHECKPOINT 7D PRE-IMPLEMENTATION AUDIT
## Checkout Flow, API Contracts & State Transitions

**Platform:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Module:** Mobile Checkout Flow & State Integration Audit  
**Date:** November 2026  

---

## 1. Audit Questions & Technical Answers

### 1. How does the customer enter checkout?
- **Entry Points:**
  - **Invitation Preview Screen (`app/preview/[id].jsx`):** Sticky bottom toolbar contains the primary "Publish" button.
  - **Native Editor Screen (`app/editor/[id].jsx`):** Top navigation bar contains a "Publish" icon/button for ready drafts.
  - **My Invitations Screen (`app/(tabs)/my-invitations.jsx`):** Draft cards show a "Publish" call-to-action alongside "Edit" and "Preview".
- **Navigation Action:**  
  Pressing "Publish" routes to `/checkout/${draftId}` (or opens the native `PublicationCheckoutSheet`), passing the active `draftId`.

### 2. How is draft identity preserved throughout the checkout flow?
- The `draftId` is passed as a mandatory path parameter: `/checkout/[id]`.
- The checkout screen initializes by querying `GET /api/drafts/${draftId}` with the customer's `x-guest-token` or session auth.
- If the draft does not belong to the current customer or cannot be found, checkout immediately aborts and displays an unauthorized notice.
- The `draftId` is bound into the `POST /api/pricing/quote` and `POST /api/payments/create-order` requests.

### 3. How is the authoritative price calculated?
- **Never calculated on the mobile client.**
- The checkout screen calls `POST /api/pricing/quote`:
  ```json
  {
    "draftId": "drf_12345",
    "couponCode": "YOUMINE50"
  }
  ```
- The backend responds with authoritative price numbers:
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

### 4. How are coupons validated?
- The customer enters a coupon code in `CouponInput.jsx`.
- Pressing "Apply" triggers a quote query to `POST /api/pricing/quote`.
- If invalid or expired, the backend returns `{ success: false, error: "Coupon expired" }`. The UI highlights the error in soft burgundy, and the quote reverts to standard pricing.
- Known backend codes verified during Checkpoint 7B: `YOUMINE50` (₹50 discount), `LOVE2026` (10% discount).

### 5. How are payment orders created?
- The customer taps "Publish & Pay ₹249" in `CheckoutFooter.jsx`.
- The CTA enters a disabled loading state to prevent double taps.
- The client dispatches `POST /api/payments/create-order`:
  ```json
  {
    "draftId": "drf_12345",
    "couponCode": "YOUMINE50",
    "provider": "razorpay" // or "google_play" / "apple_iap"
  }
  ```
- The backend checks for existing active pending orders for this draft. If one exists, it returns it; otherwise, it creates an `OrderStatus: ATTEMPTED` order and returns `orderId`, `amount`, and `key`.

### 6. How is the native payment flow launched?
- The `PaymentService` delegates to `PaymentProviderFactory.getProvider(distributionChannel)`:
  - If **Web / Razorpay Web**: Opens Razorpay Checkout modal with order ID and key.
  - If **Android Direct / Razorpay Native**: Invokes `RazorpayCheckout.open(options)`.
  - If **Android Play Billing**: Launches `GooglePlayBilling.launchBillingFlow({ sku })`.
  - If **iOS StoreKit**: Launches `StoreKit.requestPurchase({ productId })`.
  - If **Unconfigured / Expo Go**: Dispatches graceful notice directing to web checkout.

### 7. How does backend verification work?
- Upon receiving a successful callback from the native payment SDK:
  - Client sends transaction payload to `POST /api/payments/verify`:
    ```json
    {
      "orderId": "order_xxx",
      "paymentId": "pay_yyy",
      "signature": "sha256_sig",
      "provider": "razorpay"
    }
    ```
  - Backend verifies cryptographic signature or server receipt.
  - Backend updates order to `PAID`.
  - Backend invokes `PublicationActivationService.activate({ orderId })`.
  - Backend returns `{ success: true, isIdempotent: false, slug: "...", publicUrl: "..." }`.

### 8. How is the published invitation returned to the customer?
- The checkout flow navigates to `PublicationSuccessScreen.jsx`:
  - Plays subtle champagne-gold celebration animation.
  - Displays invitation title, cover thumbnail, and assigned public slug.
  - Offers "Copy Link" (`expo-clipboard`), "Native Share" (`expo-sharing` / React Native `Share`), and "View Live Invitation" (`expo-linking`).
  - Offers "Go to My Invitations" button which invalidates TanStack queries so the newly published invitation displays with its active green badge and public link.

### 9. How is an interrupted checkout recovered?
- **Pending Order Tracking:**  
  When an order is created, its reference (`orderId`, `draftId`, `createdAt`) is cached in `AsyncStorage` / `SecureStore` as `active_checkout_pending`.
- **App Launch / Checkout Re-Entry Recovery:**  
  On app start or when reopening `/checkout/[id]`, the app checks for `active_checkout_pending`:
  - If exists, queries `GET /api/orders/${orderId}`.
  - If `status === 'PAID'`, automatically queries `GET /api/publications?orderId=${orderId}` and routes directly to `PublicationSuccessScreen`.
  - If `status === 'ATTEMPTED'`, allows resuming without creating redundant orders.
  - If older than 30 minutes or `FAILED`, clears the cache.

### 10. Which provider integrations are currently configured?
- **Backend Providers (Checkpoints 7B & 7C):**
  - Razorpay: Fully configured with HMAC SHA-256 signature verification and webhooks.
  - Apple IAP & Google Play: Abstract provider interfaces implemented with receipt validation contracts.
- **Mobile Runtime (Expo / React Native Pure JS):**
  - Architecture prepared with `PaymentProviderFactory` supporting Razorpay, Google Play, and StoreKit.
  - Expo Go / Dev runtime gracefully displays the unconfigured notice when native native-link binary modules are not compiled into the current bundle.
