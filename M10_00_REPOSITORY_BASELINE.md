# M10-00: REPOSITORY BASELINE & DISCOVERY REPORT

**Project:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Milestone:** 10 — Comprehensive Product, Codebase & System-Wide Audit  
**Audit Timestamp:** 2026-11-25T11:04:40+05:30  
**Evaluator:** Complete Senior Engineering Audit Team  
**Git Branch:** `main`  
**Current Commit:** `fc91768` (*feat(milestone-9.1): complete comprehensive feature regression, media security, and cross-platform certification*)  
**Previous Commit:** `54dcdf6` (*feat(milestone-9): complete advanced invitation experience...*)  
**Working Tree Status:** Clean (`nothing to commit, working tree clean`)  

---

## 1. Repository Directory Structure

```
D:\ess card
├── .next/                                # Next.js compilation cache & standalone artifacts
├── android/                              # Capacitor Android project files (legacy/auxiliary)
├── data/
│   └── ink-ivory-store.json              # Local store JSON representation & template fixtures
├── DLT/                                  # DLT template registration documentation
├── es/                                   # Legacy experimental scripts
├── node_modules/                         # Root Node dependencies
├── play-store/                           # Google Play Console store listing metadata & privacy docs
├── prisma/
│   ├── schema.prisma                     # Canonical PostgreSQL database schema
│   └── migrations/                       # SQL migrations directory
├── public/                               # Static web assets, logos, soundtracks, template previews
│   ├── audio/                            # 116+ curated wedding melody files (.mp3)
│   ├── logo.png, logo.webp               # Primary horizontal logo banners (2172x724)
│   ├── logo-dark-bg.png, .webp           # High-contrast luminous gold logo banners
│   ├── logo-icon.png, .webp              # 512x512 square mark wax-seal envelope emblem
│   └── uploads/                          # Dedicated disk storage for customer invitation photos
├── scratch/                              # Temporary analysis & diagnostic scripts
├── scripts/                              # Deployment, backup, and health check maintenance scripts
├── src/                                  # Next.js 15 Full-Stack Web Application
│   ├── app/                              # Next.js App Router (Public routes, Customize, Invite, Admin, APIs)
│   ├── components/                       # Shared React UI components (Templates, Editor, Layout)
│   ├── context/                          # React Context providers (AdminContext, etc.)
│   ├── data/                             # Production template catalog (`templates.ts`)
│   ├── lib/                              # Core backend services, Prisma client, Security middleware
│   ├── types/                            # Canonical TypeScript data contracts
│   └── utils/                            # ICS Calendar and date utilities
├── tests/                                # Backend automated integration & security test suites
│   ├── e2e/milestone7e/                  # End-to-end customer journey tests (`e2e-certification.ts`)
│   ├── test-checkpoint7b.ts              # API & Token security test suite
│   ├── test-checkpoint7c.ts              # Centralized Admin & Catalog Governance test suite
│   ├── test-checkpoint7d.ts              # Order & Payment processing test suite
│   └── test-recovery-lease.ts            # Distributed recovery lease test suite
├── you-are-mine-mobile/                  # Pure JavaScript React Native / Expo Client
│   ├── app/                              # Expo Router file-based routes (tabs, checkout, editor, preview)
│   ├── assets/                           # High-resolution launcher icons (1024x1024) & emblems
│   ├── components/                       # Pure JS React Native UI components
│   ├── constants/                        # Theme colors, brand tokens, and API endpoints
│   ├── services/                         # Axios API clients, MediaService, Payments
│   └── store/                            # Zustand state stores (`editor.store.js`, `auth.store.js`)
├── package.json                          # Web & Backend package manifest
├── test-milestone9.js                    # Milestone 9 verification suite (10/10 passed)
└── test-milestone9-1-regression.js       # Milestone 9.1 regression suite (7/7 passed)
```

---

## 2. Technology & Runtime Inventory

| Layer | Primary Technology | Version | Key Libraries |
|---|---|---|---|
| **Web Client** | Next.js App Router, React | Next 15.1.3, React 19.0.0 | Tailwind CSS 3.4.17, Lucide React, Framer Motion |
| **Mobile Client** | React Native, Expo Router | Expo SDK 58.0.26, RN 0.88.1 | Pure JS, Zustand 5.1.0, TanStack Query 5.108, Axios, Lucide RN |
| **Backend API** | Next.js Route Handlers | Node.js v24.19.0 | Zod 4.6.7, Sharp 0.35.5, Upstash Ratelimit |
| **Database** | PostgreSQL | Prisma Client 7.10.1 | 14 Models, JSON Snapshot Immutability |
| **Payments** | Razorpay Node SDK | Custom Web & Native Providers | HMAC SHA256 Signature Verification, Idempotency |
| **Media Storage**| Direct Disk Storage | `/public/uploads/` | Magic Byte Inspection, 10MB Guard, Zero-Blob PostgreSQL |

---

## 3. Dependency Inventory

### Root Manifest (`package.json`)
- **Core:** `next` (15.1.3), `react` (19.0.0), `react-dom` (19.0.0), `@prisma/client` (7.10.1).
- **Styling & Animation:** `tailwindcss` (3.4.17), `framer-motion` (11.15.0), `gsap` (3.15.1), `clsx` (2.1.1).
- **Security & Validation:** `zod` (4.6.7), `@upstash/ratelimit` (2.2.1), `@upstash/redis` (1.41.0).
- **Media & Export:** `sharp` (0.35.5), `html-to-image` (1.11.11), `jspdf` (2.5.2).

### Mobile Manifest (`you-are-mine-mobile/package.json`)
- **Core:** `expo` (~58.0.26), `react-native` (0.88.1), `expo-router` (~58.0.32).
- **State & Data:** `zustand` (^5.1.0), `@tanstack/react-query` (^5.108.4), `axios` (^1.21.1).
- **Media & Hardware:** `expo-av` (^16.0.8), `expo-image-picker` (~58.0.10), `expo-secure-store` (~58.0.3).
- **Language Enforcement:** Strictly 100% Pure JavaScript (`.jsx` / `.js`), zero TypeScript.

---

## 4. Existing Test Suites Inventory

1. `tests/e2e/milestone7e/e2e-certification.ts` (15 scenarios — E2E Customer Journeys A, B, C, D)
2. `tests/test-checkpoint7b.ts` (20 scenarios — Backend API, Tokens & IDOR Protection)
3. `tests/test-checkpoint7c.ts` (28 scenarios — Admin RBAC, Catalog Governance & Pricing Locks)
4. `tests/test-checkpoint7d.ts` (Orders & Payment Processing)
5. `tests/test-recovery-lease.ts` (15 scenarios — Distributed Concurrency & Worker Heartbeats)
6. `test-milestone9.js` (10 scenarios — Milestone 9 Catalog, Customization, Pricing & Assets)
7. `test-milestone9-1-regression.js` (7 suites — Editor boundaries, 10MB limit, SVG Guides)
8. `you-are-mine-mobile/test-milestone7d.js` (10 scenarios — Mobile Payment Provider Orchestration)
9. `you-are-mine-mobile/test-milestone6.js` (10 scenarios — Mobile Preview & Envelope Animation)

---

## 5. Initial Observations & Audit Limitations

1. **Physical Device Absence in CLI Sandbox:** While all code syntax, Metro bundle resolution, and database persistence are fully testable, testing on physical hardware (USB ADB on Android and signed TestFlight on iPhone) is blocked in this environment and must be transparently disclosed.
2. **PostgreSQL Invariant:** In local offline testing, store fixtures are backed by `ink-ivory-store.json` alongside Prisma client mocks to verify relational contracts without requiring an external hosted cloud database.
3. **No General Event Management:** As mandated by the product scope, RSVP forms, guest dietary selections, and wishes are strictly digital stationery invitation components and are **not** an enterprise event management CRM.
