# YOU ARE MINE — MILESTONE 8 BASELINE AUDIT
## Comprehensive Repository, Infrastructure, Payment & Native Packaging Baseline

**Platform:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Milestone:** 8 — Production Deployment, Native Build Certification & Closed Beta  
**Baseline Git Commit:** `798beff`  
**Date:** November 2026  
**Status:** Audit Completed & Gaps Identified  

---

## 1. Baseline System & Gap Matrix

| Area | Existing Implementation | Verified Evidence | Missing Requirement | Risk | Classification |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **PostgreSQL** | Prisma ORM with `@unique` on `Publication.orderId` and `draftId` | `prisma/schema.prisma` lines 259–275 | Migration execution scripts and automated point-in-time backup verification | Unverified restoration in production | **PARTIALLY VERIFIED** |
| **Recovery Cron** | `/api/payments/recovery` with constant-time secret check | `src/app/api/payments/recovery/route.ts` | In-memory `isRecoveryRunning` is process-local; lacks database-backed distributed lock | Dual-worker overlapping execution in multi-instance or serverless environments | **PARTIALLY VERIFIED** |
| **Redis** | In-memory LRU sets in `PaymentDeduplicationService` | Code inspection of `deduplication.ts` | Distributed Redis adapter not yet activated | Serverless cold restarts rely on DB checks rather than sub-millisecond cache | **PARTIALLY VERIFIED** |
| **Razorpay (Web)** | Full backend adapter, HMAC verify, webhooks | Passed 20/20 in Checkpoint 7B; passed in 7D | Production live merchant keys and production webhook URL registration | Real live payments pending credential configuration | **PARTIALLY VERIFIED** |
| **Razorpay (Direct APK)** | Native JS adapter `razorpay-payment.provider.js` | Code inspection, mock callbacks passed | Real physical device execution; native binary linked release APK build | Untested on physical Android hardware | **PARTIALLY VERIFIED** |
| **Google Play Billing** | `google-play-payment.provider.js` with SKU mappings | Integration contract passed in Checkpoint 7D | Play Console merchant account linking, real sandbox purchase verification | Pending store developer account credentials | **INTEGRATION-READY (BLOCKED for live)** |
| **Apple StoreKit** | `apple-iap-payment.provider.js` (Guideline 3.1.1) | Integration contract passed in Checkpoint 7D | App Store Connect IAP products, TestFlight sandbox purchase test | Pending Apple Developer account credentials | **INTEGRATION-READY (BLOCKED for live)** |
| **Media Storage** | Local uploads via `/public/uploads` + static CDN URLs | `docker-compose.yml` volumes, `api/upload` | Cloud-hosted S3/Cloudinary bucket configuration with strict file size and MIME validation | Local storage not scalable across stateless containers | **PARTIALLY VERIFIED** |
| **Android Build** | Pure JS Expo setup with `app.json` | Web export bundled 21 routes | `eas.json` build profiles, release keystore, generated APK/AAB | Cannot install on physical test devices without APK/AAB | **NOT CONFIGURED** |
| **iOS Build** | Pure JS Expo setup with `app.json` | Web export bundled 21 routes | `eas.json` iOS profile, provisioning profiles, TestFlight submission | Cannot install on physical iPhones | **NOT CONFIGURED** |
| **Monitoring** | Security event logger (`src/lib/security/logger.ts`) | Structured JSON logs emitted in tests | Centralized exception capture (Sentry), alert triggers for payment failures | Operator blind to production runtime exceptions | **PARTIALLY VERIFIED** |
| **Backups** | `prisma/seed_data.sql` and `ink-ivory-store.json` | File existence in repo | Automated cron database dump and isolated restoration testing script | Catastrophic data loss if host storage fails | **NOT CONFIGURED** |
| **Legal Assets** | `src/app/privacy`, `src/app/terms`, `refund-policy` | Existing Next.js web pages | Mobile app linking, store disclosure checklist, account deletion disclosure | Store rejection during Play/App Store review | **PARTIALLY VERIFIED** |

---

## 2. Gap Identification & Execution Plan

### Gap 1: Distributed Recovery Lease (Phase 1)
- **Problem:** `isRecoveryRunning` is an in-memory boolean. In multi-instance or serverless environments, two nodes executing recovery simultaneously can race.
- **Solution:** Add `RecoveryJobLock` model in Prisma and create an atomic database-backed lease service with heartbeat renewal and expiration handling.

### Gap 2: Production Environment Configuration (Phase 2)
- **Problem:** Production environment variables are spread across examples; secrets must be securely defined without repository leakage.
- **Solution:** Create comprehensive `PRODUCTION_ENVIRONMENT_CONFIGURATION.md` and sanitize all production references.

### Gap 3: Native Build Packaging (Phases 3 & 4)
- **Problem:** `eas.json` is missing; no native APK, AAB, or TestFlight build configurations exist.
- **Solution:** Create `you-are-mine-mobile/eas.json` with separate profiles (`preview` for Direct APK, `production` for Play Store AAB and iOS TestFlight).

### Gap 4: Independent Payment Channel Certification (Phase 5)
- **Problem:** Store payments must not be marked transaction-certified without real sandbox transactions.
- **Solution:** Explicitly classify each provider: Website Razorpay (Sandbox Verified), Direct APK (Native Contract Verified), Play Store & StoreKit (Integration-Ready pending merchant linking).

### Gap 5: Legal & Store Compliance Assets (Phase 6)
- **Problem:** Terms, Privacy, Refund policies exist on web but must be wired into mobile customer profile and store disclosure checklists.
- **Solution:** Update mobile Profile screen to open canonical legal documents and document store privacy declarations.

### Gap 6: Observability, Backups & Disaster Recovery (Phases 7 & 8)
- **Problem:** No automated backup restoration script or centralized error alerting.
- **Solution:** Provide backup verification procedures, disaster recovery runbooks, and error monitoring architectures.

### Gap 7: Closed Beta Onboarding & Release Plan (Phases 9 & 10)
- **Problem:** No formal onboarding guide or tester instructions for closed-beta participants.
- **Solution:** Create `MILESTONE_8_CLOSED_BETA_PLAN.md` and evaluate the 8 Release Gates (G1–G8).
