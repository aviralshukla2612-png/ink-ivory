# M10-10: PAYMENT, FINANCE & PUBLICATION SUBSYSTEM AUDIT

**Project:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Milestone:** 10 — Comprehensive Product, Codebase & System-Wide Audit  
**Audit Timestamp:** 2026-11-25T11:07:33+05:30  
**Evaluator:** Payment Systems Engineer & Financial Integrity Auditor  
**Scope:** Payment Providers, Pricing Quote Engine, Publication Lifecycle & Financial Locks  

---

## 1. Provider Implementation & Certification Status

| Provider Channel | Target Distribution | Implementation File | Verification Status | Operational Notes |
|---|---|---|---|---|
| **Razorpay Web** | Desktop & Mobile Website | `razorpay-payment.provider.js` | **PRODUCTION VERIFIED** | HMAC SHA256 signature verification, webhook deduplication |
| **Razorpay Native/APK**| Android Direct APK Download | `razorpay-payment.provider.js` | **INTEGRATION VERIFIED** | Standard Razorpay SDK bridge for non-Google Play builds |
| **Google Play Billing**| Google Play Store App | `google-play-payment.provider.js` | **BLOCKED BY STORE SETUP**| Provider contract implemented; real IAP blocked by Google Play Console keys |
| **Apple StoreKit** | Apple App Store iOS App | `apple-iap-payment.provider.js` | **BLOCKED BY STORE SETUP**| Provider contract implemented; sandbox IAP blocked by Apple Developer provisioning |

---

## 2. Financial Integrity & Calculation Invariants

1. **Paise-Based Financial Math:**
   - All monetary calculations are performed in integer paise ($1\text{ INR} = 100\text{ paise}$).
   - Standard Template Price: $\text{Paise } 29900 = \text{\rupee } 299$.
   - Coupon `YOUMINE50`: Discount $\text{Paise } 5000 = \text{\rupee } 50$. Final Payable: $\text{Paise } 24900 = \text{\rupee } 249$.
   - Verified via `tests/test-checkpoint7b.ts` Test 17.
2. **Server-Authoritative Quote Engine:**
   - Endpoint: `POST /api/pricing/quote`.
   - Client-side amounts in requests are strictly ignored. The server looks up `TemplatePrice.amountPaise` from PostgreSQL.
3. **Double Verification Mutex Lock:**
   - In `PaymentOrderService`, concurrent verification requests on the same `orderId` acquire an in-memory mutex, preventing duplicate payment recording or double publication.

---

## 3. Publication Activation Pipeline

The publication sequence verified in `tests/e2e/milestone7e/e2e-certification.ts` Journey B operates as follows:
1. Customer requests publication $\rightarrow$ Server retrieves authoritative quote (₹299).
2. Order created with status `CREATED` / `ATTEMPTED`.
3. Customer completes payment $\rightarrow$ Razorpay returns `razorpay_payment_id` and `razorpay_signature`.
4. Backend cryptographically validates HMAC SHA256 signature.
5. In an atomic transaction:
   - Order marked `PAID`.
   - `Publication` record created with unique `orderId` and `draftId`.
   - Permanent immutable `snapshotData` written.
   - Public `Invitation` generated with unique slug (e.g. `/invite/aarav-meera-...`).
6. Draft status updated to `PUBLISHED`.
