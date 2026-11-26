# HYBRID STEP 3.04 — REACT DOM IN WEBVIEW COMPATIBILITY REPORT

## 1. Architectural Differences: Standalone HTML vs. Next.js React DOM
- **Templates 02, 03, 04, 05:** Are written in pure vanilla HTML5/CSS3/Canvas WebGL. They require no runtime React or Webpack bundle to execute inside WebView.
- **Templates 01, Birthday, Valentine, Date Planner:** Are authored as React 19 Client Components (`'use client'`) with dependencies on `@/data/*`, `framer-motion`, and React hooks.

## 2. Evaluation of Delivery Paradigms

### Paradigm 1: Local Server URL (`http://localhost:3000/[template]`)
- **Pros:** Zero compilation needed; reuses Next.js page components verbatim.
- **Cons:** Strictly requires active Next.js development server or local Node runtime. Violates offline standalone requirement when app is detached from dev host.

### Paradigm 2: Static HTML Pre-compilation / Static Micro-Apps (Recommended)
- **Mechanism:** Compile the React DOM markup and CSS into self-contained HTML files (similar to `template-04.html`) during build/asset export.
- **Benefits:**
  - 100% offline autonomy.
  - Zero server dependency.
  - Sub-millisecond execution.
  - Seamless integration into `SharedWebInvitationViewport.jsx`.

## 3. Framer Motion & CSS Compatibility Matrix
| Web Feature | Supported in WebView? | Notes |
| :--- | :--- | :--- |
| **`AnimatePresence`** | YES | Supported in mobile WebKit/Blink. |
| **`motion.div` Springs** | YES | Uses CSS transforms & requestAnimationFrame. |
| **CSS `@keyframes`** | YES | Hardware accelerated by GPU. |
| **Canvas 2D Particles** | YES | Full support for confetti and golden dust. |
| **Web Audio API** | YES | Managed via native audio bridge or HTML audio. |
| **CSS Mix-Blend-Mode**| YES | Hardware accelerated in iOS/Android WebViews. |
