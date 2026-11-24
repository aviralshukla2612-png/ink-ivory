# YOU ARE MINE — MILESTONE 7E SYSTEM & ARCHITECTURE AUDIT
## Comprehensive Repository, Deployment & Multi-Platform Configuration Audit

**Platform:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Audit Scope:** Website + Android + iOS + Next.js App Router Backend + Centralized Administration  
**Date:** November 2026  
**Status:** Certified Architecture Audit  

---

## 1. Repository Structure & Directory Organization

The repository operates as a unified full-stack monorepo with an integrated pure JavaScript Expo / React Native mobile client and a Next.js 15 App Router backend:

```
├── src/
│   ├── app/                         # Next.js 15 App Router endpoints & web pages
│   │   ├── (auth)/                  # Web customer authentication routes
│   │   ├── admin/                   # Centralized Admin Portal (Customers, Orders, Finance)
│   │   ├── api/                     # Server-side REST endpoints
│   │   │   ├── drafts/              # Draft creation, updates, duplication, deletion
│   │   │   ├── payments/            # Order creation, verification, webhooks, recovery
│   │   │   ├── pricing/quote/       # Authoritative server-side pricing & coupon calculation
│   │   │   ├── publications/        # Active publication queries
│   │   │   └── templates/           # Catalog metadata queries
│   │   └── invite/[slug]/           # Public guest invitation web renderer
│   ├── components/                  # Web React components (Editor, Canvas, Modals)
│   ├── data/                        # Catalog definitions & templatesData
│   └── lib/                         # Shared core backend logic
│       ├── auth/                    # Guest token HMAC & session signing
│       ├── payments/                # Provider abstraction, deduplication, recovery, publication
│       ├── security/                # Structured security logger
│       └── store.ts                 # StoreService abstraction (Prisma / JSON store)
├── you-are-mine-mobile/             # Expo / React Native pure JavaScript mobile app
│   ├── app/                         # Expo Router file-based navigation
│   │   ├── (tabs)/                  # Bottom tab navigator (Home, Explore, Invitations, Music, Profile)
│   │   ├── checkout/                # Checkout routes ([id], success, failure, pending, processing)
│   │   ├── editor/                  # Native invitation canvas editor
│   │   └── preview/                 # Full-screen preview with wax seal envelope animation
│   ├── components/                  # Native components (checkout, editor, preview, invitations)
│   ├── constants/                   # Colors, theme, and distribution config
│   ├── services/                    # Mobile API client, auth, drafts, publications, payments
│   └── store/                       # Zustand client state (auth, editor)
├── prisma/
│   └── schema.prisma                # PostgreSQL schema with ACID transaction & uniqueness constraints
├── data/
│   └── ink-ivory-store.json         # Local persistent JSON data store
└── tests/                           # Multi-checkpoint automated test suites
```

---

## 2. Deployment Architecture

- **Backend Web Server:** Next.js 15 App Router deployed on Node.js / Vercel Edge runtime with HTTPS enforced.
- **API Communication:** JSON over REST with standard HTTP status codes and structured error handling.
- **Mobile Runtime:** Pure JavaScript React Native running on Expo SDK ~58.
- **Web Renderer:** Server-rendered Next.js dynamic route `/invite/[slug]` rendering immutable publication snapshots directly to mobile and desktop web browsers.

---

## 3. Environment Variables & Secret Configuration

Production secrets are securely managed in cloud environment variables (e.g. Vercel / Railway / AWS Secrets Manager).

| Variable Name | Purpose | Sensitivity | Default / Dev Fallback |
| :--- | :--- | :---: | :--- |
| `DATABASE_URL` | PostgreSQL connection string | High | `postgresql://...` |
| `JWT_SECRET` | Guest identity HMAC signing | High | Generated securely |
| `RAZORPAY_KEY_ID` | Razorpay public key identifier | Public | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay cryptographic secret | Critical | Encrypted in vault |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook HMAC SHA-256 secret | Critical | Encrypted in vault |
| `CRON_SECRET` | Recovery worker authorization | Critical | High-entropy secret |
| `NEXT_PUBLIC_APP_URL` | Canonical root domain | Public | `https://youaremine.online` |
| `EXPO_PUBLIC_API_URL` | Mobile backend API endpoint | Public | `https://youaremine.online` |
| `EXPO_PUBLIC_DISTRIBUTION_CHANNEL` | Build-time distribution selector | Public | `PLAY_STORE` / `DIRECT_APK` |

*Note: Zero plaintext secrets are committed to the git repository.*

---

## 4. Database Configuration & ACID Boundaries

- **Database Engine:** PostgreSQL via Prisma ORM (`prisma/schema.prisma`).
- **Concurrency & Idempotency Constraints:**
  - `Publication.orderId`: `@unique` (Prevents duplicate publications from same order).
  - `Publication.draftId`: `@unique` (Prevents multiple active publications per draft).
  - `Invitation.slug`: `@unique` (Guarantees globally collision-free guest links).
  - `PaymentOrder.orderId`: `@unique` (Guarantees provider order uniqueness).
  - `PaymentTransaction.paymentId`: `@unique` (Guarantees transaction deduplication).

---

## 5. Redis & In-Memory Caching Architecture

- **Primary Caching:** In-memory LRU sets in `PaymentDeduplicationService` for millisecond mutex locks (`acquireOrderLock`).
- **Persistent Fallback:** Every lock release and processed event is committed to the database store (`store.data.webhookEvents`), ensuring protection survives server restarts or multi-instance deployments.
- **Production Redis Adapter:** Redis/Upstash ready via environment variable for distributed Redis locking when horizontal replica count exceeds 10 instances.

---

## 6. Payment Provider Configuration

| Provider | Supported Distribution | Backend Implementation | Mobile Client Adapter |
| :--- | :--- | :--- | :--- |
| **Razorpay Gateway** | Website & Android Direct APK | `RazorpayProvider` (HMAC SHA-256) | `razorpay-payment.provider.js` |
| **Google Play Billing** | Android Google Play Store | `GooglePlayBillingProvider` | `google-play-payment.provider.js` |
| **Apple In-App Purchase** | iOS App Store (Guideline 3.1.1) | `AppleIAPProvider` | `apple-iap-payment.provider.js` |

---

## 7. Webhook Configuration

- **Route:** `POST /api/payments/webhook`
- **Security:** Verifies `x-razorpay-signature` against raw request body using HMAC SHA-256.
- **Deduplication:** Records `event.id` in persistent `WebhookEventRecord` store. Duplicate deliveries return immediate HTTP 200 `{ status: "duplicate_ignored" }`.
- **Publication Trigger:** On `payment.captured`, invokes `PublicationActivationService.activate()` atomically.

---

## 8. Cron & Operational Recovery Scheduling

- **Route:** `POST /api/payments/recovery`
- **Security:** Authenticates dedicated `CRON_SECRET` using timing-safe comparison (`crypto.timingSafeEqual`).
- **Overlapping Execution Guard:** Internal mutex flag `isRecoveryRunning` rejects overlapping executions with HTTP 429.
- **Rate Limit:** Enforces minimum 10-second interval between executions.
- **Batch Boundary:** Scans up to 50 orphaned paid orders per run.

---

## 9. Media & Audio Storage Configuration

- **Supported Formats:** JPEG, PNG, WEBP for photography; MP3, M4A, AAC for celebration audio.
- **Size Limits:** Max image upload 10MB; max audio upload 25MB.
- **Serving:** Served through optimized CDN (`cdn.youaremine.online` / Next.js static asset optimization).
- **Public Invitation Isolation:** Immutable snapshot preserves static media URLs even if original working draft deletes the uploaded asset.

---

## 10. Domain & Public URL Configuration

- **Production Domain:** `https://youaremine.online`
- **Public Invitation URL Format:** `https://youaremine.online/invite/:slug`
- **Mobile Deep Link Scheme:** `youaremine://` (Configured in `app.json`).

---

## 11. Mobile Build Configuration

- **Framework:** Expo SDK ~58, React Native 0.88.
- **Language:** 100% Pure JavaScript (`.js` / `.jsx`).
- **Package Identifiers:**
  - Android: `com.youaremine.app`
  - iOS: `com.youaremine.app`
- **Orientation:** Portrait locked.
- **Theme Color:** Burgundy Silk (`#4A1725`).

---

## 12. Store Distribution Configuration

- **Build-Time Selector (`Config.DISTRIBUTION_CHANNEL`):**
  - `PLAY_STORE`: Enforces Google Play Billing with optional India User Choice Billing.
  - `DIRECT_APK`: Enforces Razorpay Native SDK.
  - `APP_STORE`: Enforces Apple StoreKit / In-App Purchase.
  - `WEB`: Enforces Razorpay Web Modal.
- **Tamper Resistance:** Hardcoded as an immutable build-time constant unmodifiable by client requests.

---

## 13. Known Operational Dependencies

1. External Razorpay API connectivity for live order creation and refunds.
2. Google Play Developer API service account credentials for production Play Store verification.
3. App Store Connect Shared Secret / Private Key for Apple StoreKit JWS verification.
4. Continuous HTTPS certificates on production domains.

---

## 14. Defect Tracking & Status

- **P0 Defects:** 0 (Zero critical data loss, IDOR, or payment vulnerabilities).
- **P1 Defects:** 0 (Zero payment recovery or broken publication defects).
- **P2 / P3 Polish Items:** Logged in [MILESTONE_7E_DEFECT_REGISTER.md](file:///d:/ess%20card/MILESTONE_7E_DEFECT_REGISTER.md) (minor cosmetic asset caching and simulator-only notices).
