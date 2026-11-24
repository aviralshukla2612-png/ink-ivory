# PRODUCTION ENVIRONMENT CONFIGURATION
## YOU ARE MINE Platform Specification

**Document Version:** 1.0.0  
**Target Milestone:** Milestone 8 — Production Deployment & Closed Beta  
**Target Environment:** Production (`NODE_ENV=production`)  
**Canonical Domain:** `https://youaremine.online`  
**Security Standard:** Zero-Trust, Server-Authoritative, Cryptographically Protected Secrets

---

## 1. Overview & Architecture

The **YOU ARE MINE** platform utilizes a unified backend architecture with multi-channel client support:
- **Web Client:** Next.js 15 App Router serving public invitation previews, website checkout, and `/admin` centralized dashboard.
- **Mobile Clients:** Expo SDK 58 React Native app (`you-are-mine-mobile`) running on Android and iOS.
- **Shared API Backend:** Next.js Route Handlers powering customer sessions, draft persistence, server-authoritative pricing, distributed recovery, and atomic publication.
- **Primary Data Store:** PostgreSQL with Prisma ORM (fallback to high-integrity JSON store in constrained environments).
- **Distributed Cache & Rate Limiting:** Upstash Redis via REST API with fallback to in-memory sliding window.

---

## 2. Environment Variables Matrix

| Variable Name | Required | Default / Fallback | Type | Description |
|---|---|---|---|---|
| `NODE_ENV` | **Yes** | `development` | String | Must be set to `production` in live environments. Enforces secure cookies and disables debug mocks. |
| `PORT` | No | `3000` | Integer | HTTP listener port for Node.js process. |
| `NEXT_PUBLIC_APP_URL` | **Yes** | `http://localhost:3000` | URL | Canonical HTTPS domain for customer links, QR codes, and webhooks (`https://youaremine.online`). |
| `DATABASE_URL` | **Yes** | None | Connection String | PostgreSQL connection string (`sslmode=require` mandatory in production). |
| `DIRECT_URL` | No | None | Connection String | Non-pooled connection for Prisma CLI migrations when using PgBouncer. |
| `SESSION_SECRET` | **Yes** | None | Hex String (>= 64 chars) | Cryptographic HMAC secret for guest tokens, customer session signatures, and tamper protection. |
| `ADMIN_SECRET_KEY` | **Yes** | None | Hex String (>= 64 chars) | Master credential authorizing `/api/admin/login` and admin session token issuance. |
| `CRON_SECRET` | **Yes** | None | Hex String (>= 64 chars) | High-entropy secret verified via `crypto.timingSafeEqual` for `/api/payments/recovery`. |
| `TRUSTED_PROXY_TYPE` | No | `auto` | Enum | Values: `cloudflare`, `vercel`, `reverse-proxy`, `auto`, `none`. Prevents client IP spoofing. |
| `TRUSTED_PROXY_SECRET` | No | None | String | Shared header secret if deploying behind NGINX or custom Envoy edge proxy. |
| `ALLOW_UNTRUSTED_FORWARDED_IP` | **Yes** | `false` | Boolean | **STRICTLY `false`** in production. If set to `true`, throws audit failure. |
| `UPSTASH_REDIS_REST_URL` | Recommended | None | HTTPS URL | Distributed Redis endpoint for multi-instance rate limiting and lock orchestration. |
| `UPSTASH_REDIS_REST_TOKEN` | Recommended | None | Bearer Token | Upstash REST API authentication token. |
| `RAZORPAY_KEY_ID` | **Yes** | None | String | Razorpay Live API Key ID (must begin with `rzp_live_`). |
| `RAZORPAY_KEY_SECRET` | **Yes** | None | String | Razorpay Live Key Secret. |
| `RAZORPAY_WEBHOOK_SECRET` | **Yes** | None | String | Razorpay Webhook Signing Secret for HMAC-SHA256 signature verification. |
| `ALLOW_DEV_PAYMENT_MOCK` | **Yes** | `false` | Boolean | **STRICTLY `false`** in production. Prevents mock checkout from activating. |
| `CLOUDINARY_CLOUD_NAME` | Recommended | None | String | Cloudinary cloud identifier for customer image asset uploads. |
| `CLOUDINARY_API_KEY` | Recommended | None | String | Cloudinary REST API key. |
| `CLOUDINARY_API_SECRET` | Recommended | None | String | Cloudinary API secret for server-signed upload URLs. |
| `DLT_SMS_URI` | No | TRAI endpoint | URL | Indian TRAI DLT compliant transactional SMS gateway URL. |
| `DLT_USERNAME` | No | None | String | TRAI DLT gateway account username. |
| `DLT_APIKEY` | No | None | String | TRAI DLT gateway API key. |
| `DLT_SENDER_ID` | No | None | String | Registered 6-character TRAI sender header (`TXXTOO`). |
| `DLT_TEMPLATE_ID` | No | None | String | Approved DLT template identifier for transactional notifications. |
| `DLT_ENTITY_ID` | No | None | String | Registered DLT Principal Entity ID. |
| `DLT_ROUTE` | No | `TRANS` | String | Gateway SMS route (`TRANS` for transactional). |
| `LOG_LEVEL` | No | `info` | Enum | Logging granularity: `error`, `warn`, `info`, `debug`. Recommended: `info`. |
| `SENTRY_DSN` | No | None | DSN URL | Application error and unhandled exception capture endpoint. |

---

## 3. Mobile Client Build-Time Variables (`you-are-mine-mobile`)

The mobile client is packaged with immutable build-time configuration depending on the distribution channel profile:

| Build Variable | Build Profile | Value Example | Impact |
|---|---|---|---|
| `EXPO_PUBLIC_API_URL` | Preview & Production | `https://youaremine.online` | Directs all mobile API traffic to production backend. |
| `EXPO_PUBLIC_DISTRIBUTION_CHANNEL` | Android Direct APK | `DIRECT_APK` | Activates native Razorpay checkout flow directly in APK. |
| `EXPO_PUBLIC_DISTRIBUTION_CHANNEL` | Google Play Store | `PLAY_STORE` | Activates Google Play Billing contract adapter. |
| `EXPO_PUBLIC_DISTRIBUTION_CHANNEL` | iOS App Store | `APP_STORE` | Activates Apple StoreKit 2 contract adapter. |
| `EXPO_PUBLIC_DISTRIBUTION_CHANNEL` | Web Preview | `WEB` | Activates Web Razorpay standard checkout. |

---

## 4. Production Secret Generation & Management Runbook

Run the following commands on a secure administrator workstation to generate high-entropy keys:

```bash
# 1. Generate SESSION_SECRET (64 hex characters / 256 bits)
openssl rand -hex 32

# 2. Generate ADMIN_SECRET_KEY (64 hex characters / 256 bits)
openssl rand -hex 32

# 3. Generate CRON_SECRET (64 hex characters / 256 bits)
openssl rand -hex 32
```

### Secret Injection Rules:
1. **Never commit `.env`, `.env.local`, or `.env.production` to Git.**
2. In Vercel or cloud platform, inject via Environment Variables settings with **Production** scope only.
3. Mark sensitive variables (`SESSION_SECRET`, `ADMIN_SECRET_KEY`, `CRON_SECRET`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`) as **Sensitive / Encrypted** so they are masked from build logs.
4. Schedule secret rotation every 90 days.
