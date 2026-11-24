# MILESTONE 8 — NATIVE iOS BUILD & TESTFLIGHT CERTIFICATION
## YOU ARE MINE Mobile Application

**Target OS:** iOS 15.0+  
**Bundle Identifier:** `com.youaremine.app`  
**Framework:** Expo SDK ~58 / React Native 0.88.1 (100% Pure JavaScript)  
**Document Classification:** Native Release Certification  
**Certification Status:** **AUDITED & TESTFLIGHT PIPELINE CONFIGURED**

---

## 1. Distribution Profile & StoreKit 2 Architecture

The iOS build is specifically configured for Apple App Store & TestFlight distribution:

- **Build Profile:** `production-appstore` in `eas.json`
- **Artifact:** iOS App Archive (`.ipa`)
- **Distribution Channel:** `APP_STORE`
- **Payment Provider:** Apple StoreKit 2 contract adapter (`src/services/payments/AppleStoreKitProvider.js`)
- **Build Command:**
  ```bash
  cd you-are-mine-mobile
  eas build --platform ios --profile production-appstore
  ```

---

## 2. StoreKit Independent Qualification Disclosure

> [!IMPORTANT]
> **Independent Payment Channel Qualification Notice:**
> The mobile client's `AppleStoreKitProvider` implements the contract interface, handles product queries, transaction listener lifecycle, and server verification endpoints.
> 
> However, **live Apple In-App Purchases require active App Store Connect in-app product registration, Apple Paid Apps agreement execution, and Sandbox Apple ID verification on a physical iPhone.**
> 
> Therefore, this milestone certifies the **build configuration, native code contract, and TestFlight submission readiness**, while formally classifying Apple StoreKit as **Integration-Ready (Pending Live App Store Connect Credentials)**.

---

## 3. Apple App Store Guidelines & Permissions (Info.plist)

Configured via `app.json`:
- `NSPhotoLibraryUsageDescription`:  
  *"The app accesses your photos to add custom photographs to your wedding invitation."*
- `ITSAppUsesNonExemptEncryption`: `false` (Application uses standard HTTPS / TLS encryption exempt from export compliance).
- **Tablet Support:** Disabled (`supportsTablet: false`) to guarantee fixed aspect ratio portrait rendering matching the approved wedding invitation aesthetic.

---

## 4. TestFlight Closed-Beta Submission Checklist

1. **Apple Developer Account:** Active Apple Developer Program enrollment.
2. **App Store Connect Record:**
   - App Name: `YOU ARE MINE`
   - Primary Category: `Lifestyle`
   - Secondary Category: `Graphics & Design`
   - Privacy Policy URL: `https://youaremine.online/privacy`
3. **EAS Submit Configuration:** Configured in `eas.json` with `appleId` and `ascAppId`.
4. **Internal Testing Group:** 10 testers on iOS 16, 17, and 18 devices.
5. **TestFlight Feedback Email:** `beta-feedback@youaremine.online`.
