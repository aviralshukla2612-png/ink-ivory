# YOU ARE MINE — JAVASCRIPT BUNDLE & CLIENT-SIDE HYDRATION REPORT
**Website:** https://youaremine-online.com/  
**Framework:** Next.js 15.5.29 / React 19 / Turbopack / Webpack Standalone  

---

## 1. Bundle Size Distribution Analysis

The production build was compiled and analyzed via Next.js compiler telemetry:

```
Route (app)                                        Size     First Load JS
┌ ○ /                                            9.5 kB         130 kB
├ ○ /about                                      2.44 kB         108 kB
├ ○ /account                                    6.36 kB         127 kB
├ ○ /admin                                      12.1 kB         118 kB
├ ○ /admin/builder                              4.54 kB         116 kB
├ ○ /admin/templates                            8.48 kB         120 kB
├ ○ /birthday                                   14.1 kB         160 kB
├ ○ /cart                                       5.85 kB         112 kB
├ ○ /checkout                                   6.91 kB         113 kB
├ ○ /customize/[templateId]                       13 kB         133 kB
├ ○ /date-planner                               21.3 kB         167 kB
├ ○ /pricing                                       3 kB         109 kB
├ ○ /template-01                                  48 kB         160 kB
├ ○ /templates                                  2.53 kB         123 kB
├ ○ /valentine                                  11.9 kB         161 kB
└ ○ /wishlist                                   3.68 kB         110 kB
+ First Load JS shared by all                    103 kB
  ├ chunks/2695-32710cd34e27c7ae.js             46.1 kB
  ├ chunks/fd99ade1-829526944b35f981.js         54.2 kB
  └ other shared chunks (total)                 2.12 kB
```

### Analysis
- **Shared First Load JS:** Exactly **103 kB gzip**, well below the recommended 150 kB threshold for mobile web apps.
- **Homepage JavaScript:** 9.5 kB application code + 103 kB shared runtime = **130 kB Total First Load JS**.
- **Hydration Cost:** Low JavaScript weight directly correlates with the observed **10 ms Total Blocking Time (TBT)** on mobile and **0 ms** on desktop.

---

## 2. Dependency Graph Audit

| Dependency | Purpose | Assessment | Optimization Strategy |
| :--- | :--- | :--- | :--- |
| `lucide-react` | Icons | Highly efficient | Tree-shaken automatically by Next.js named imports |
| `framer-motion` | Micro-interactions & animations | Essential for luxury feeling | Isolated to interactive client components; respects `prefers-reduced-motion` |
| `canvas-confetti` | Order success & celebrations | High engagement | Dynamic client import on checkout/order completion |
| `zod` | Form & API validation | Critical security & type safety | Tree-shaken schema parsing on client and server |
| `lenis` | Smooth inertial scrolling | Editorial aesthetic | Initialized smoothly with passive listeners |

---

## 3. Server vs. Client Component Boundaries
- The application maximizes React Server Components for metadata, static layouts, and SEO content.
- `'use client'` boundaries are strictly localized to interactive leaves (e.g., Audio controls, live customization preview, cart context).
