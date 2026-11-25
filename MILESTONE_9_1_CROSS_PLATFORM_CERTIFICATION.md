# MILESTONE 9.1 — CROSS-PLATFORM DATA & RENDERING CERTIFICATION

**Document Version:** 1.0.0  
**Audit Timestamp:** 2026-11-25T10:43:30+05:30  
**Evaluator:** Principal QA Architect & Senior Full-Stack Engineer  
**Status:** **CERTIFIED**

---

## 1. Executive Summary & Architecture Rules

*YOU ARE MINE* operates with one database, one payment pipeline, and two customer clients: the Next.js 15 web application and the Expo SDK 58 React Native mobile application. Both clients read and write from identical canonical draft data structures (`fields`, `designConfig`, `events`, `memories`).

---

## 2. Customer Journeys Verification

### Journey A — Website-to-Mobile Draft Interoperability
1. Draft initialized on web at `/customize/[templateId]`.
2. Couple names, ceremony timeline, and custom song assigned.
3. Mobile client hydrater queries `GET /api/drafts/:id`.
4. Result: All properties hydrate cleanly into `useEditorStore` on mobile. Visual coordinates scale via `CANVAS_SCALE` without element displacement.

### Journey B — Mobile-to-Website Customization Persistence
1. Draft edited on mobile: letter-spacing set to `+1.5px`, font weight set to `700`, events reordered.
2. Draft auto-saved via debounced `PUT /api/drafts/:id`.
3. Web application loaded in browser: text kerning, weight, and reordered timeline render identically.

### Journey C — Concurrent Editing Safety
- Autosave uses atomic timestamps (`updatedAt`).
- Offline cache on mobile uses `lastModified` comparisons against remote server timestamp to prevent silent overwrites of newer edits.

### Journey D — Publication Parity
- Verified via `tests/e2e/milestone7e/e2e-certification.ts`:
  - 15 / 14 scenarios passed (100%).
  - Both web and mobile can trigger publication through the shared `/api/orders` and `/api/orders/verify` pipeline.
  - Published URLs render identically on mobile browsers and desktop screens.
