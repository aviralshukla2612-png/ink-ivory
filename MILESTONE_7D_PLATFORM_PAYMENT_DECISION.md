# YOU ARE MINE — CHECKPOINT 7D PLATFORM PAYMENT DECISION
## Platform-Compliant Payment Strategy & Store Policy Matrix

**Platform:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Module:** Checkpoint 7D — Platform Payment Strategy & Store Compliance  
**Date:** November 2026  
**Status:** Approved Architectural Decision  

---

## 1. Executive Policy Framework

Digital invitation publications grant access to cloud-hosted celebration websites, music streaming, animated envelopes, and digital RSVP management. Under official app store policies, digital features unlocked inside mobile applications are governed by strict developer guidelines:

1. **Apple App Store (Guideline 3.1.1 & 3.1.3b):**
   - **Guideline 3.1.1 (In-App Purchase):** If an app unlocks features or functionality within the app (such as publishing digital invitation websites or digital personalization), it must use In-App Purchase (StoreKit).
   - **Guideline 3.1.3(b) (Multiplatform Services):** Apps that operate across multiple platforms may allow users to access digital content, subscriptions, or features acquired outside the app on other platforms (e.g. web), provided those items are also made available as in-app purchases within the app.
   - **Policy Decision:** iOS client MUST use StoreKit (Apple In-App Purchase) as the default native checkout architecture. Under no circumstances may an iOS client route users to Razorpay or external web checkout to bypass In-App Purchase.

2. **Google Play Store in India (User Choice Billing / Alternative Billing):**
   - **Google Play Billing Policy:** Google Play's billing system is required for in-app purchases of digital goods and services.
   - **Alternative Billing / User Choice Billing in India:** Eligible developers in India may offer an alternative billing system alongside Google Play's billing system for users in India.
   - **Key Requirements:**
     - Program enrollment in Google Play Console.
     - Integration of the official Alternative Billing APIs / User Choice Billing interface.
     - Service fee reduction of 4% (e.g. 15% -> 11% or 30% -> 26%), with reporting of alternative billing transactions to Google within 24 hours.
     - Proper user disclosures, consumer protection, and customer service obligations.
   - **Policy Decision:** Android Play Store build MUST support Google Play Billing with optional User Choice Billing alongside it. A direct APK build may utilize the native Razorpay SDK.

3. **Web Platform:**
   - Standard Razorpay payment gateway integration (`PublishModal.tsx`) with cards, UPI, net banking, and wallets.

---

## 2. Multi-Channel Distribution Matrix

| Distribution Channel | Target OS | Primary Payment Provider | Fallback / Alternative | Compliance Basis |
| :--- | :--- | :--- | :--- | :--- |
| **Website** | Web / Browsers | **Razorpay Web Modal** | None | Standard eCommerce gateway |
| **Android Direct APK** | Android (Sideload / Web) | **Razorpay Native SDK** | UPI Intent / Web fallback | Direct distribution outside Google Play |
| **Android Google Play** | Android (Play Store) | **Google Play Billing** | Enrolled Alternative Billing (India User Choice) | Google Play Payments Policy (India) |
| **iOS App Store** | iOS | **StoreKit / Apple IAP** | None (Guideline 3.1.1 strictly enforced) | Apple App Review Guidelines 3.1.1 |

---

## 3. Product Identifier Mapping

To reconcile server-authoritative pricing (paise / INR) with store-managed digital products, standard product SKUs are mapped across platforms:

| Invitation Tier | Base Price | Product SKU / Identifier | StoreKit Product ID (iOS) | Google Play Product ID (Android) |
| :--- | :--- | :--- | :--- | :--- |
| **Signature Invitation** | ₹299 (29,900 paise) | `tier_signature_publication` | `in.youaremine.invitation.signature` | `in.youaremine.invitation.signature` |
| **Royal Heritage** | ₹449 (44,900 paise) | `tier_royal_publication` | `in.youaremine.invitation.royal` | `in.youaremine.invitation.royal` |
| **Palace Luxury** | ₹599 (59,900 paise) | `tier_luxury_publication` | `in.youaremine.invitation.luxury` | `in.youaremine.invitation.luxury` |

---

## 4. Provider Architecture & Unconfigured Safety Fallback

### 4.1 Strict Verification Before Activation
A provider implementation is activated **only** when its runtime environment, platform credentials, and store configurations are present. If an unconfigured provider is selected (or when running in Expo Go without native billing capabilities):
1. The app displays an elegant **Provider Notice**:  
   *"Native In-App Purchase configuration is currently being provisioned for your platform. Please open your invitation draft on the web at youaremine.online or contact concierge support."*
2. Under **no circumstances** does the mobile client simulate fake payment success or unlock a publication without backend cryptographic receipt verification.

### 4.2 Backend Provider Verification Contract
Regardless of channel, the mobile client sends the signed transaction receipt/token to `POST /api/payments/verify`:
- **Razorpay:** `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature` (HMAC SHA-256).
- **Google Play:** `purchaseToken`, `productId`, `orderId`, `packageName`.
- **Apple StoreKit:** `transactionReceipt` (or App Store Server API JWS signed transaction).
