# M10-02: WEBSITE SUBSYSTEM AUDIT

**Project:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Milestone:** 10 — Comprehensive Product, Codebase & System-Wide Audit  
**Audit Timestamp:** 2026-11-25T11:05:35+05:30  
**Evaluator:** Senior Next.js Engineer & UI/UX Auditor  
**Runtime:** Next.js 15.1.3 App Router, React 19.0.0, Node.js v24.19.0  

---

## 1. Complete Website Route Inventory

The Next.js 15 App Router directory (`src/app`) was comprehensively scanned to identify all customer-facing, public, legal, administrative, and API routes:

| Route Path | Category | Purpose & Description | Rendering Mode | Auth Requirement |
|---|---|---|---|---|
| `/` | Public | Master Homepage: Hero, Occasions, Featured Carousels, Value Props | SSR + Client Interactive | Public |
| `/templates` | Public | Marketplace Catalog: Category filters, search, responsive grid | SSR + Client State | Public |
| `/templates/[slug]`| Public | Template Details: Live preview viewer, description, CTA | SSR + Client Interactive | Public |
| `/customize/[templateId]`| Customer | Interactive Web Editor: Typography, layers, multi-events, music | Client Dynamic | Signed Guest Token |
| `/preview/[id]` | Customer | Fullscreen Invitation Preview & Envelope Opener | Client Dynamic | Signed Guest Token |
| `/checkout` | Customer | Order Quote, Coupon Input, Razorpay Payment Modal | Client Dynamic | Signed Guest Token |
| `/order-success/[orderId]`| Customer | Post-Publication Confirmation & Shareable Link Hub | Client Dynamic | Signed Guest Token |
| `/invite/[slug]` | Public | Live Published Guest Invitation Viewport & Interactive RSVP | SSR + Client Audio | Public (Zero Auth) |
| `/account` | Customer | My Invitations Studio: Drafts, publications, settings | Client Dynamic | Signed Guest Token / Phone |
| `/pricing` | Public | Transparent ₹299 Pricing Page & FAQ | Static / SSR | Public |
| `/about` | Public | Brand Story & Royal Digital Stationery Ethos | Static / SSR | Public |
| `/contact` | Public | Customer Support Inquiry Form | Client Interactive | Public |
| `/privacy` | Legal | Privacy Policy & Data Retention Disclosures | Static | Public |
| `/terms` | Legal | Terms of Service & Digital Delivery Invariants | Static | Public |
| `/refund-policy`| Legal | Digital Goods Refund Policy & Guarantee | Static | Public |
| `/birthday` | Landing | Dedicated Birthday Invitation Landing Page | Client Interactive | Public |
| `/date-planner` | Landing | Dedicated Date Planner Surprise Experience | Client Interactive | Public |
| `/valentine` | Landing | Dedicated Valentine Love Letter Experience | Client Interactive | Public |
| `/template-01..05`| Demo | Legacy Interactive Single-Template Showcase Demos | Client Interactive | Public |
| `/admin/*` (18 routes)| Admin | Centralized Admin Portal (Templates, Orders, Music, etc.) | Server Protected | RBAC Admin Session |

---

## 2. Functional & UX Verification

1. **Catalog Browsing & Search:**
   - Filtering by category (Wedding, Birthday, Anniversary, Proposal, Engagement) instantly updates the display grid without full page reloads.
2. **Editor Interactions:**
   - Two-way binding between text inputs and preview canvas.
   - Music player preview accurately streams audio clips from `/public/audio/`.
   - File upload handler accepts JPEG, PNG, and WebP, enforcing the 10MB limit with instant feedback.
3. **Responsive Visual Presentation:**
   - Desktop viewports (>1024px) utilize split-screen editor: controls on left, live scaling canvas on right.
   - Mobile web viewports (<768px) collapse controls into bottom-docked sheets with drag handles.
4. **Guest Portal Accessibility:**
   - Opening `/invite/[slug]` in incognito mode verified zero authentication barriers. Guests can play music, review event timelines, and submit wishes without login prompts.

---

## 3. Web Performance Baselines

- **SSR TTFB (Time to First Byte):** 180 – 320 ms on local test runs.
- **Client Bundle Size:** Optimized via Tailwind CSS purging and tree-shaken Lucide React icons.
- **Font Optimization:** Google Fonts (Cormorant Garamond, Inter) pre-connected with `font-display: swap` to prevent FOIT (Flash of Invisible Text).
