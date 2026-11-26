# HYBRID STEP 3A.01 — NEXT.JS DEPENDENCY EXTRACTION REPORT

## 1. Identified Next.js Dependencies
In the original website implementation (`src/app/template-01/page.jsx`):
- `next/navigation` (`useSearchParams`, router push)
- Next.js dynamic routing and server streaming
- Static image imports with Next.js Image optimization loader (`next/image`)
- React 19 Client Component state bindings

## 2. Extraction & Decoupling Strategy
To run reliably inside the mobile app's WebView without requiring a local Node/Next.js runtime:
1. **Navigation:** Replaced `next/navigation` search params with the native bridge protocol `INK_IVORY_CUSTOM_UPDATE`.
2. **Image Optimization:** Converted local image asset paths directly into Base64 raster data streams embedded in JavaScript memory.
3. **Router Decoupling:** Replaced Next.js App Router context with native touch gesture event listeners (`touchstart`, `touchend`).
4. **Offline Resilience:** The resulting template requires zero server fetches or dynamic CDN lookups.
