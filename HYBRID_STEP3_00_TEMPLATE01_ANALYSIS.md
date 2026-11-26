# HYBRID STEP 3.00 — TEMPLATE 01 (ROYAL NAVY PALACE) ANALYSIS

## 1. Website Renderer Architecture
- **Location:** `src/app/template-01/page.jsx` & `src/components/template01/`
- **Underlying Technology:** Next.js 15 App Router (`'use client'`), React DOM 19, Framer Motion, Context API (`SliderContext.jsx`).
- **Structure:**
  - `Preloader.jsx` (radial gold shimmer, CSS `@keyframes`)
  - `GrandEntranceGate.jsx` (3D CSS perspective gate opening)
  - `HorizontalSlideDeck.jsx` (Right-to-left touch-carousel horizontal slider)
  - 6 individual slides: Welcome, Save the Date, Events Overview, Family Blessings, Venue Location, Closing Thank You.
- **Messaging Bridge:** Actively listens to `window.addEventListener('message')` for `INK_IVORY_CUSTOM_UPDATE` (line 115).

## 2. Current Mobile Implementation
- **Location:** `you-are-mine-mobile/components/preview/RoyalMultiSlidePresentation.jsx`
- **Underlying Technology:** Pure React Native with `react-native-safe-area-context`, `ScrollView`, and Lucide icons.
- **Divergence:**
  - Lacks the web's subtle CSS mix-blend modes and gold shimmer gradients.
  - Hardcoded slide dimensions sometimes clip on smaller Android displays.
  - Manual recreation creates ongoing drift when the web template is updated.

## 3. WebView Compatibility & Feasibility
- **Feasibility:** HIGH.
- **Packaging Strategy:**
  - Option 1 (Server-hosted): Load `http://localhost:3000/template-01?mode=demo` inside `SharedWebInvitationViewport`.
  - Option 2 (Static Export / HTML Micro-App): Export the pre-rendered React static markup into a self-contained HTML/CSS file (like `template-04.html`) to achieve 100% offline autonomy.
- **Recommended Approach:** Compile a self-contained static HTML build (`template-01.html`) bundled with local fonts and vector assets into `bundledTemplate01Html.js`.
