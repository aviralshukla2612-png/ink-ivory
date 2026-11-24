# YOU ARE MINE — MOBILE APPLICATION ARCHITECTURE AUDIT & INTEGRATION PLAN (MILESTONE 0)
**Application:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Target Platform:** Mobile (Android & iOS via Expo + React Native in Pure JavaScript)  
**Reference Document & Design Acceptance:** 10-Screen Executive Mobile Design Reference (`media_1795513334797_7b725428.jpg`)  
**Backend:** Existing Next.js 15 + Prisma ORM + PostgreSQL / In-Memory & Redis Fallback Engine  
**Centralized Admin:** Existing Web Admin Console (`/admin`)  

---

## 1. REPOSITORY & BACKEND AUDIT SUMMARY

### 1.1 Architecture & Primary Source of Truth
The existing YOU ARE MINE platform is an enterprise-grade Next.js 15 application supporting both web clients and mobile app clients through centralized REST APIs. 

- **Database Layer (`prisma/schema.prisma`):**
  - `User`: Customer profile (phone, email, role, avatar, registration timestamp).
  - `GuestIdentity` & `GuestSession`: HMAC-signed anonymous customer token (`gst_<uuid>`) enabling instant free customization without upfront login walls.
  - `Template` & `TemplatePrice`: Authoritative catalog of templates, occasions, default fields, design configurations, and price records (stored in paise).
  - `Draft` & `DraftMedia`: Customer draft state, form fields (`names`, `venue`, `date`, `events`), custom audio choices, and uploaded gallery images.
  - `PaymentOrder` & `PaymentTransaction`: Cryptographically verified transaction records (Razorpay `order_xxx` & `pay_xxx`).
  - `Invitation` & `Publication`: Immutable published invitations with public slugs (`/invite/[slug]`), snapshot data, and expiration dates.
  - `AuditEvent`: Security and compliance audit log.

- **Storage Engine (`src/lib/store.ts` & `src/lib/android-store.ts`):**
  - Provides high-performance persistence with PostgreSQL Prisma connectivity, JSON backup, and fallback capability.
  - Manages Android/iOS platform configurations, promotional banners, featured template lists, and release notes via `androidStore`.

- **Security & Authorization (`src/lib/auth.ts`):**
  - Dual identification: Customer can be authenticated via `User` or anonymous `guestToken`.
  - Token transmission: Supports both `Cookie` and `x-guest-token` header (`gst_[a-zA-Z0-9_-]{16,64}` or signed `<raw>.<sig>`).
  - IDOR Prevention: Server strictly validates ownership (`verifyOwnership`) before returning, updating, or publishing drafts.

---

## 2. API INVENTORY & REUSABLE BACKEND ENDPOINTS

| Endpoint | Method | Auth / Header Required | Functionality | Mobile Usability |
| :--- | :--- | :--- | :--- | :--- |
| `/api/app/config` | `GET` | Public | Returns mobile banners, featured template IDs, latest app version, force update flags, and announcement banners. | **Directly Reusable** (Home & Splash) |
| `/api/templates` | `GET` | Public | Returns all active templates with real-time pricing, badges, and cover artwork. | **Directly Reusable** (Explore & Home) |
| `/api/templates/[id]` | `GET` | Public | Returns full template details, default fields, occasion, and pricing. | **Directly Reusable** (Template Details & Editor) |
| `/api/auth/send-otp` | `POST` | Public / Rate-limited | Dispatches real DLT SMS OTP to customer's 10-digit mobile number. | **Directly Reusable** (Login & Registration) |
| `/api/auth/verify-otp` | `POST` | Public / Rate-limited | Verifies OTP code and confirms customer identity. | **Directly Reusable** (Login & Registration) |
| `/api/drafts` | `GET` | `x-guest-token` | Returns all drafts owned by the customer. | **Directly Reusable** (My Invitations Tab) |
| `/api/drafts` | `POST` | `x-guest-token` | Creates a new invitation draft. | **Directly Reusable** (Template Customize Action) |
| `/api/drafts/[id]` | `GET` | `x-guest-token` | Fetches a specific draft for native editing. | **Directly Reusable** (Native Editor Hydration) |
| `/api/drafts/[id]` | `PATCH/PUT` | `x-guest-token` | Autosaves and updates draft fields, layout, audio, and sections. | **Directly Reusable** (Autosave Engine) |
| `/api/drafts/[id]` | `DELETE` | `x-guest-token` | Deletes a customer draft. | **Directly Reusable** (My Invitations Actions) |
| `/api/pricing/quote` | `POST` | Public | Calculates final price in paise with coupon codes. | **Directly Reusable** (Checkout & Publishing) |
| `/api/payments/create-order` | `POST` | `x-guest-token` | Creates backend Razorpay payment order for publishing. | **Directly Reusable** (Publishing Workflow) |
| `/api/payments/verify` | `POST` | `x-guest-token` | Validates HMAC payment signature and activates live invitation. | **Directly Reusable** (Publishing Workflow) |
| `/api/publications` | `GET` | `x-guest-token` | Returns live active customer publications and public links. | **Directly Reusable** (My Invitations - Published Tab) |
| `/api/upload/image` | `POST` | `x-guest-token` | Handles multipart image upload for customer invitations. | **Directly Reusable** (Editor Image Tool) |
| `/api/upload/audio` | `POST` | `x-guest-token` | Uploads customer-provided MP3/M4A soundtrack. | **Directly Reusable** (Custom Music Tool) |
| `/api/user/profile-image` | `POST` | Public / Customer ID | Uploads customer avatar and syncs with centralized admin directory. | **Directly Reusable** (Profile Avatar Upload) |

---

## 3. MISSING ENDPOINT ANALYSIS & BACKEND EXTENSIONS

To fulfill the 10 mobile screens faithfully without mocks, the following non-destructive endpoints will be added to the Next.js backend:

1. **`GET /api/music` (Curated Music Discovery):**
   - *Requirement:* Screen 4 & 7 show music selection with 116 curated tracks (Kesariya, Kudmayi, Vachindamma, etc.).
   - *Current Status:* `/api/admin/music` is locked to admin sessions with `MEDIA_MANAGE`.
   - *Resolution:* Add a public customer-facing `GET /api/music` that serves tracks from `src/data/songs.ts` with category filtering (`Wedding`, `Birthday`, `Proposal`, `Valentine`) and keyword search.

2. **`GET /api/orders` (Customer Order History):**
   - *Requirement:* Screen 9 ("My Orders") displays orders (`TKT-188004`, `TKT-190335`, `TKT-224809`) with filter pills (`All`, `Paid`, `Pending`, `Refunded`).
   - *Current Status:* Orders are currently queried in admin via `/api/admin/orders`.
   - *Resolution:* Add a customer-scoped `GET /api/orders` querying orders matching the caller's `x-guest-token` or authenticated `userId`.

3. **`GET /api/user/me` & `PATCH /api/user/me` (Customer Profile & Session):**
   - *Requirement:* Screen 10 ("Profile") displays the customer's photo, name ("Srajan Shukla"), and phone number ("+91 98765 43210").
   - *Current Status:* Verified phone numbers and customer details are stored in `androidStore` / `store.customers`.
   - *Resolution:* Add `GET /api/user/me` and `PATCH /api/user/me` to hydrate and update customer profile metadata.

---

## 4. SHARED TEMPLATE MODEL & NATIVE MOBILE RENDERER

### 4.1 Native Editor Architecture
The web application renders templates using React DOM and CSS. The mobile application must render natively using React Native components (`View`, `Text`, `Image`, `Animated`, `GestureDetector`) without WebViews.

### 4.2 Shared Invitation Content Schema
Both web and mobile share the identical JSON structure stored in `Draft.fields` and `Draft.design`:

```json
{
  "names": "Karthik & Meenakshi",
  "headline": "Wedding Ceremony",
  "eyebrow": "CORDIALLY INVITE YOU TO THEIR",
  "date": "DEC 21 2026",
  "time": "7:30 PM Onwards",
  "venue": "TIRUMANAM TEMPLE",
  "city": "Chennai, Tamil Nadu",
  "message": "Together with our families, we invite you to celebrate our union...",
  "songTitle": "Kesariya (Soulful Flute Cover)",
  "audioSource": "/audio/kesariya-flute.mp3",
  "events": [
    { "name": "Muhurtham", "date": "Dec 21, 2026", "time": "9:00 AM", "venue": "Temple Mandapam" },
    { "name": "Reception", "date": "Dec 21, 2026", "time": "7:00 PM", "venue": "Palace Grounds" }
  ],
  "design": {
    "themeColor": "#4A1725",
    "accentColor": "#D8B77B",
    "textColor": "#FFF9F2",
    "fontFamily": "PlayfairDisplay",
    "archStyle": "temple-gold"
  }
}
```

---

## 5. DESIGN TOKENS & VISUAL SPECIFICATION

Directly extracted from the approved visual reference (`media_1795513334797_7b725428.jpg`):

- **Primary Burgundy:** `#741E32` (Primary action buttons, active tab indicators, hero backgrounds)
- **Deep Burgundy:** `#4A1725` (Splash background, headings, luxury borders)
- **Dark Wine:** `#35131D` (Contrast accents and dark pill backgrounds)
- **Warm Ivory:** `#FFF9F2` (Main screen background, card surfaces)
- **Cream:** `#F8EFE5` (Card highlights and neutral input borders)
- **Soft Blush:** `#F3D8D3` (Category badges, subtle tints)
- **Champagne Gold:** `#D8B77B` (Logo, decorative dividers, stars, premium pills)
- **Muted Gold:** `#B99762` (Secondary icons and subtle borders)
- **Dark Brown Typography:** `#45291F` (Primary titles, labels, card headers)
- **Secondary Text:** `#89756B` (Subtitles, metadata, timestamps)
- **Success Green:** `#2E7D32` (Paid badges, Published status tags)
- **Error / Refunded Red:** `#C62828` (Refunded status badges)

---

## 6. PROJECT DIRECTORY STRUCTURE (`you-are-mine-mobile`)

To be created cleanly with Expo + React Native in Pure JavaScript (`.js` / `.jsx`):

```
you-are-mine-mobile/
├── app/
│   ├── _layout.jsx             # Root layout with fonts, TanStack Query, and AuthProvider
│   ├── index.jsx               # Screen 1: Splash Screen
│   ├── onboarding.jsx          # Screen 2: Visual Onboarding Carousel
│   ├── (tabs)/
│   │   ├── _layout.jsx         # Custom Bottom Tab Bar (5 tabs)
│   │   ├── home.jsx            # Screen 3: Home Landing
│   │   ├── explore.jsx         # Screen 4: Explore Templates Marketplace
│   │   ├── invitations.jsx     # Screen 8: My Invitations (Drafts & Published)
│   │   ├── music.jsx           # Music Discovery & Audio Player
│   │   └── profile.jsx         # Screen 10: Customer Profile & Settings
│   ├── template/
│   │   └── [id].jsx            # Screen 5: Template Details Screen
│   ├── editor/
│   │   └── [id].jsx            # Screen 6: Native Invitation Canvas & Toolbars
│   ├── preview/
│   │   └── [id].jsx            # Screen 7: Invitation Live Preview & Publish Action
│   └── orders/
│       └── index.jsx           # Screen 9: My Orders Screen
├── components/
│   ├── common/                 # Button, Card, Header, Badge, SearchInput
│   ├── home/                   # HeroBanner, OccasionCircles, FeaturedSection
│   ├── templates/              # TemplateCard, CategoryFilterBar
│   ├── editor/                 # CanvasRenderer, TextToolbar, MusicToolbar, StyleToolbar
│   └── invitations/            # InvitationCard, OrderCard
├── services/
│   ├── api.js                  # Axios client with base URL & x-guest-token interceptor
│   ├── auth.service.js         # OTP authentication & session storage
│   ├── templates.service.js    # Catalog, categories & template details
│   ├── drafts.service.js       # Draft CRUD & autosave
│   ├── music.service.js        # Soundtrack library & preview playback
│   └── orders.service.js       # Customer orders & payment verification
├── store/
│   ├── auth.store.js           # Zustand store for user identity & guestToken
│   └── editor.store.js         # Zustand store for active draft, canvas undo/redo
├── theme/
│   └── colors.js               # Approved color tokens
└── package.json
```

---

## 7. RISK REGISTER & MITIGATION STRATEGY

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **WebView vs Native Editor** | High | The native editor will render using pure React Native components (`View`, `Text`, `Image`) with gesture bindings, completely avoiding WebViews as required. |
| **TypeScript Conflict** | High | The user specified JavaScript only. No `.ts` or `.tsx` files will be introduced inside `you-are-mine-mobile`. |
| **API Secret Leakage** | High | No database credentials or Razorpay secrets will be placed in the client app. All transactions are securely orchestrated via backend API routes. |
| **IDOR / Session Hijack** | High | All customer draft and order endpoints enforce `verifyOwnership` against cryptographically signed `guestToken` or `userId`. |
| **Offline Data Loss** | Medium | Autosave engine with debounced sync (1500ms) and local state persistence using `@react-native-async-storage/async-storage` ensures drafts survive app restarts. |

---

## 8. MILESTONE EXECUTION ROADMAP

- **Milestone 0 (Current):** Repository & backend audit, shared schema validation, implementation plan [COMPLETED].
- **Milestone 1:** Initialize Expo project `you-are-mine-mobile` in JavaScript with Expo Router, design tokens, and fonts.
- **Milestone 2:** Implement Splash Screen (Screen 1), Onboarding Carousel (Screen 2), and Authentication (OTP flow).
- **Milestone 3:** Implement Home (Screen 3), Explore Templates (Screen 4), and Template Details (Screen 5).
- **Milestone 4 & 5:** Build Native Invitation Editor (Screen 6) with canvas, real-time text/image/music tools, and autosave.
- **Milestone 6:** Implement Invitation Preview (Screen 7) and My Invitations (Screen 8).
- **Milestone 7 & 8:** Implement My Orders (Screen 9), Profile (Screen 10), and backend order synchronization.
- **Milestone 9 & 10:** Integration verification, backend automated checks, and release readiness.
