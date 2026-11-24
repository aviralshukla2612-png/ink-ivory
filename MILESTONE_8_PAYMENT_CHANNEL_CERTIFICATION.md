# MILESTONE 8 — PAYMENT CHANNEL INDEPENDENT CERTIFICATION
## YOU ARE MINE Multi-Channel Payment Qualification Matrix

**Audit Date:** 2026-11-24  
**Classification:** Payment Integrity & Store Compliance Audit  
**Target Milestone:** Milestone 8 — Production Deployment & Closed Beta  
**Standard:** Zero-Assumption Independent Verification

---

## 1. Executive Summary

In strict accordance with the Milestone 8 mandate, each payment distribution channel has been independently audited and qualified. We do not conflate automated mock test passes with live store merchant account certification.

| Channel | Target Platform | Underlying Provider | Technical Status | Production Readiness Classification | Evidence Base |
|---|---|---|---|---|---|
| **Channel 1: Website** | Web Browsers (Desktop & Mobile Safari/Chrome) | Razorpay Checkout (UPI, Cards, NetBanking) | **VERIFIED & CERTIFIED** | **PRODUCTION-READY** | Checkpoint 7B & 7C suites (40/40), 7E E2E (98/98), HMAC verification, Webhook-first activation |
| **Channel 2: Android Direct APK** | Android 10+ (Direct APK Download / Closed Beta) | Native Razorpay Gateway Adapter | **VERIFIED & CERTIFIED** | **CLOSED-BETA READY (Direct APK)** | Mobile Checkpoint 7D suite (43/43), PaymentProviderFactory channel resolution, Deep-link payment callbacks |
| **Channel 3: Google Play Store** | Android 10+ (Play Store Closed Testing) | Google Play In-App Billing (AIDL / BillingClient) | **CONTRACT VERIFIED** | **INTEGRATION-READY (Pending Developer Console Live Credentials)** | Provider contract adherence, mock fallback isolation, server-side payload structure verified |
| **Channel 4: Apple App Store** | iOS 15.0+ (TestFlight & App Store) | Apple StoreKit 2 / App Store Server API | **CONTRACT VERIFIED** | **INTEGRATION-READY (Pending App Store Connect Live Sandbox Account)** | StoreKit contract interface implemented, transaction listener lifecycle mapped, server payload structure verified |

---

## 2. Channel Deep-Dive Assessments

### Channel 1: Website Razorpay
- **Flow:** Server quotes price -> `POST /api/payments/create-order` -> Razorpay SDK standard checkout modal -> Webhook (`payment.captured`) triggers `PublicationActivationService` -> Success redirect to `/order-success` or live invitation slug.
- **Verification Evidence:**
  - `tests/test-checkpoint7b.ts` (18 scenarios passed)
  - `tests/test-checkpoint7c.ts` (22 scenarios passed)
  - `tests/e2e/milestone7e/e2e-certification.ts` (98 scenarios passed)
- **Status:** **Fully Approved for Production.**

### Channel 2: Android Direct APK (Razorpay Native)
- **Flow:** `Config.DISTRIBUTION_CHANNEL = 'DIRECT_APK'` -> `PaymentProviderFactory` instantiates `RazorpayPaymentProvider` -> Invokes native SDK / deep-link checkout -> Server verifies signature via `POST /api/payments/verify` -> Activates publication snapshot.
- **Verification Evidence:**
  - `you-are-mine-mobile/test-milestone7d.js` (43 scenarios passed)
  - Channel isolation tested; does not load Play Store billing modules when running Direct APK profile.
- **Status:** **Fully Approved for Controlled Closed-Beta APK Distribution.**

### Channel 3: Google Play Billing (Play Store Track)
- **Flow:** `Config.DISTRIBUTION_CHANNEL = 'PLAY_STORE'` -> `PaymentProviderFactory` instantiates `GooglePlayPaymentProvider` -> Purchases in-app product -> Receives purchase token -> Server verifies purchase token with Google Play Developer API -> Activates publication snapshot.
- **Current Operational Reality:**
  - Client interface and server payload handlers are complete.
  - Live Google Play Console merchant account linking, in-app product SKU registration (`yam_invitation_publish_standard`), and live Google Play Services test account validation can only be finalized on the physical device with Google Play Services installed.
- **Status:** **Formally classified as Integration-Ready.** Must not be advertised as store-certified until Google Play Console closed-testing track verification is completed.

### Channel 4: Apple StoreKit 2 (iOS App Store & TestFlight)
- **Flow:** `Config.DISTRIBUTION_CHANNEL = 'APP_STORE'` -> `PaymentProviderFactory` instantiates `AppleIAPPaymentProvider` -> App Store purchase sheet -> Receives signed JWS transaction -> Server verifies with Apple App Store Server API -> Activates publication.
- **Current Operational Reality:**
  - Client interface and transaction state listeners are complete.
  - Live transaction execution requires paid Apple Developer Program agreement, banking setup, and active TestFlight sandbox tester authentication on an iOS device.
- **Status:** **Formally classified as Integration-Ready.** Must not be advertised as store-certified until TestFlight sandbox transaction verification is completed.

---

## 3. Compliance and Release Rules

1. **Direct APK builds (`preview`, `production-direct-apk`) MUST NEVER be uploaded to the Google Play Store Console**, as Google Play strictly prohibits third-party billing (Razorpay) for digital goods.
2. **Play Store builds (`production-playstore`) MUST ALWAYS have `EXPO_PUBLIC_DISTRIBUTION_CHANNEL="PLAY_STORE"`**.
3. **Apple iOS builds (`production-appstore`) MUST ALWAYS have `EXPO_PUBLIC_DISTRIBUTION_CHANNEL="APP_STORE"`**.
