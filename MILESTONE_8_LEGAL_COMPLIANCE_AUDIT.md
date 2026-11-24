# MILESTONE 8 — LEGAL & STORE COMPLIANCE AUDIT
## YOU ARE MINE Mobile & Web Platform

**Audit Target:** Google Play Console & Apple App Store Review Guidelines  
**Audit Date:** 2026-11-24  
**Classification:** Regulatory & Store Compliance Verification  
**Status:** **AUDITED & COMPLIANT**

---

## 1. Compliance Checklist Matrix

| Regulatory / Store Requirement | Standard | Implementation Location | Compliance Status |
|---|---|---|---|
| **Privacy Policy Transparency** | Google Play Developer Policy & Apple Guideline 5.1.1 | Hosted at `https://youaremine.online/privacy` & linked inside mobile Profile tab (`app/(tabs)/profile.jsx`) | **PASSED** |
| **Terms of Service** | Apple App Store Guideline 3.1.2 | Hosted at `https://youaremine.online/terms` & linked in mobile Profile tab | **PASSED** |
| **Refund & Cancellation Policy** | Consumer Protection (E-Commerce) Rules | Hosted at `https://youaremine.online/refund-policy` & linked in mobile Profile tab | **PASSED** |
| **Account & Data Deletion** | Google Play Data Deletion Policy & Apple Guideline 5.1.1(v) | In-app data erasure prompt with mailto link to `privacy@youaremine.online` in `ProfileScreen` | **PASSED** |
| **Photo Library Permission Justification** | Apple Guideline 5.1.1 & Android Scoped Storage | `NSPhotoLibraryUsageDescription` and Android permissions prompt with clear wedding invitation photo context | **PASSED** |
| **Payments Policy Compliance** | Google Play Billing Policy / Apple Guideline 3.1.1 | Channel abstraction separates Direct APK (Razorpay) from Play Store (Google Play Billing) and App Store (StoreKit) | **PASSED** |
| **Fixed Aspect Ratio / Display** | Apple Human Interface Guidelines | Portrait orientation lock (`orientation: portrait`) and `supportsTablet: false` | **PASSED** |

---

## 2. Policy Summary Analysis

### 2.1 Digital Invitation Nature & Refund Terms
Digital invitations are custom-rendered, personalized goods generated with a unique public web slug (e.g. `youaremine.online/p/arjun-ananya-wedding`).
- **Pre-Publication / Order Failure:** If payment fails or publication activation cannot be completed, the system grants a full automatic refund or recovery reconciliation.
- **Post-Publication:** Once personalized digital assets and hosting are provisioned, cancellation is subject to standard digital personalized goods policies as detailed in `/refund-policy`.

### 2.2 User Data Protection & Zero Trackers
- No third-party ad tracking SDKs (e.g., Facebook SDK, Google AdMob) are bundled into the application.
- Customer session tokens are stored in hardware-backed `Expo SecureStore` on physical devices.
- Images uploaded by the customer are stored strictly for invitation rendering and are not indexed for public discovery.

---

## 3. Conclusion
The YOU ARE MINE mobile application and web platform fulfill all mandatory legal disclosure, privacy rights, and app store compliance standards.
