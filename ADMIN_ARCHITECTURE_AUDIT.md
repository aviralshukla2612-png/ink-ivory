# INK & IVORY — ADMIN ARCHITECTURE AUDIT (PHASE ONE DISCOVERY)

**Platform:** Ink & Ivory Bespoke Digital Invitation & Personalized Experience Engine  
**Document:** System Architecture, Codebase Discovery & Existing Assets Inventory  
**Date:** November 20, 2026  
**Auditor / Architect:** Principal Full-Stack Engineer, SaaS Product Architect & DevSecOps Specialist  

---

## 1. EXISTING REPOSITORY ARCHITECTURE

Ink & Ivory is built on a modern Next.js 15 App Router architecture utilizing React 19, Tailwind CSS, TypeScript, and Framer Motion / GSAP animations.

### 1.1 Directory Structure & Conventions
- `src/app/`: Next.js 15 App Router pages and API routes.
  - Public Funnel: `/` (Home), `/templates` (Marketplace), `/templates/[slug]` (Showcase), `/customize/[templateId]` (Interactive Customizer), `/date-planner` (Interactive Date Book), `/valentine`, `/birthday`.
  - Public Guest Route: `/invite/[slug]` (Full-bleed responsive published invitation viewer with SSR snapshot loading).
  - Admin Route: `/admin` (Single-page admin console, currently managing basic stats and price adjustments).
  - API Routes: `src/app/api/` (REST API handlers for admin, drafts, payments, pricing, publications, and media uploads).
- `src/lib/`: Backend business services and security infrastructure.
  - `store.ts`: In-memory and file-backed JSON datastore (`data/ink-ivory-store.json`) with unified service methods (`StoreService`).
  - `auth.ts`: HMAC-SHA256 guest token signing, constant-time comparisons, and time-bound admin session cookies.
  - `razorpay.ts`: Razorpay order creation, constant-time checkout signature verification, and raw webhook verification.
  - `pricing.ts`: Server-side canonical quote calculation engine.
  - `security/`: Centralized security modules:
    - `rate-limit.ts`: Upstash Redis distributed sliding window with fail-closed production policy and local fallback.
    - `rate-limit-keys.ts`: Environment-aware proxy IP resolution (Cloudflare, Vercel, Reverse Proxy) blocking header spoofing.
    - `rate-limit-config.ts`: Fine-tuned rate limit profiles across all route categories.
    - `file-guard.ts`: Binary magic-byte inspection (MP3/WAV/ftyp) and path traversal sanitization.
    - `validators.ts`: Zod schemas for drafts, orders, payments, quotes, and admin price updates.
    - `logger.ts`: Centralized structured JSON logger with recursive PII and secret masking.
- `src/data/templates.ts`: Static catalog definitions for 9 primary templates with default fields, typography, colors, and asset references.
- `prisma/`:
  - `schema.prisma`: Production PostgreSQL relational schema with 12 models.
  - `seed_data.sql`: PostgreSQL DML seed export.
- `data/`:
  - `ink-ivory-store.json`: Active datastore file.
  - `backups/`: Immutable pre-migration backup snapshots with SHA256 checksums.

---

## 2. AUTHENTICATION & AUTHORIZATION DISCOVERY

### 2.1 Customer Identity Model
- Anonymous Try-Before-You-Publish funnel: Customers are issued cryptographically signed HMAC-SHA256 guest tokens (`gst_<uuid>.<sig>`) via `getOrCreateGuestToken(request)`.
- Token verified via constant-time comparison (`crypto.timingSafeEqual`) in `verifySignedToken()`.
- Customer ownership on drafts and orders is enforced via `verifyOwnership(draft, guestToken)`.
- Registered user account schema (`UserRecord`) exists in `store.ts` and `schema.prisma`, but user password registration/login is currently unmounted; anonymous guest tokens drive the entire customization funnel.

### 2.2 Administrative Authentication Model
- Implemented in Stage 3:
  - `POST /api/admin/login`: Verifies master key against `ADMIN_SECRET_KEY` in constant time, issues 2-hour signed session cookie `ink_ivory_admin_session` (`adm_<uuid>.<expiresAt>.<sig>`).
  - Cookie attributes: `HttpOnly`, `SameSite=Strict`, `Path=/`, and conditional `Secure` in production.
  - `POST /api/admin/logout`: Revokes cookie with `Max-Age=0`.
  - `verifyAdminAccess()`: Validates session cookie or fallback Bearer header in constant time.
  - `verifyCsrfOrigin()`: Blocks cross-origin POST mutations from foreign origins (`HTTP 403`).
- **Gap Identified for Full Admin Panel:** Single flat master key exists without granular Role-Based Access Control (RBAC). Staff roles (`SUPER_ADMIN`, `ADMIN`, `FINANCE`, `CONTENT_MANAGER`, `SUPPORT`) need to be introduced.

---

## 3. TEMPLATE RENDERING ARCHITECTURE

### 3.1 Existing Template Renderer Implementations
The application features distinct interactive visual renderers:
1. `src/app/template-01/page.jsx`: Imperial Navy Wedding with moving animations, gold foil borders, and music box player.
2. `src/app/template-02/page.jsx`: Royal Lake Palace Heritage with lotus rangoli, marigold garlands, and 8-section story layout.
3. `src/app/template-03/page.jsx`: Thirumanam South Indian Temple Wedding with gopuram doors and sacred muhurtham schedule.
4. `src/app/birthday/page.jsx`: Interactive Birthday Surprise with cake blowing, polaroid memories, and gift opening.
5. `src/app/valentine/page.jsx`: Love Letter Proposal with YES/NO interactive animations and wax-sealed envelope.
6. `src/app/date-planner/page.jsx`: Interactive Date Book with romantic calendar picker, timing selector, dining options, and itinerary sync.
7. `src/components/cards/CardPreview.tsx`: SVG and canvas-based live card previewer used across the marketplace and editor sidebar.

### 3.2 Renderer Coupling
Currently, the public `/invite/[slug]` route maps template IDs to static Next.js route paths (`/template-01`, `/template-02`, `/date-planner`) and renders them via an iframe receiving query params.
To support a **Dynamic Template Management System**, we must build a formal **Renderer Registry** that decouples template configuration from hardcoded page URLs and maps approved renderer identifiers to supported sections and customization schemas.

---

## 4. PAYMENT & PUBLICATION WORKFLOW

1. Customer edits template for free in `/customize/[templateId]`. Draft autosaves via `POST /api/drafts` or `PUT /api/drafts/[id]`.
2. Customer clicks "Publish My Website" in `PublishModal`.
3. Client requests tamper-proof server quote: `POST /api/pricing/quote`.
4. Client creates payment order: `POST /api/payments/create-order` (binds `orderId` to `draftId`).
5. Customer completes Razorpay modal payment.
6. Backend verifies payment: `POST /api/payments/verify` (HMAC signature validated, order-to-draft pairing verified).
7. Backend marks order `PAID`, generates collision-free slug, creates immutable `PublicationRecord`, sets draft to `PUBLISHED`, and returns live URL (`/invite/[slug]`).
8. Webhook backup: `POST /api/payments/webhook` verifies raw body HMAC and handles asynchronous captured payments idempotently.

---

## 5. EXISTING SECURITY PROTECTIONS (STAGE 4 VERIFIED)
- **40 of 40 automated tests passing** across 4 test harnesses.
- Anti-spoofing trusted proxy IP policy (`rate-limit-keys.ts`).
- Upstash Redis distributed sliding window with fail-closed sensitive policy (`rate-limit.ts`).
- Strict CSP and browser defense headers (`middleware.ts` & `next.config.mjs`).
- Constant-time HMAC signature checks on payment checkout, webhooks, and guest tokens.
- Binary magic-byte inspection for audio uploads (MP3 ID3, WAV RIFF, ftyp).
- Zero secrets in client browser storage (`sessionStorage` purged).
- Disaster recovery backup verified with matching SHA256 checksums.
