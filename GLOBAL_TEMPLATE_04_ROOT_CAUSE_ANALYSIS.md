# GLOBAL_TEMPLATE_04_ROOT_CAUSE_ANALYSIS
## Systemic Technical Root Cause Analysis: The Limits of Manual Native Porting

### 1. The Central Architectural Question: Isolated Bug or Systemic Flaw?

When Template 04 displayed Template 01's navy background and Ganesh shloka in `media_1795690361919_523af363.png`, it was initially diagnosed as an asset mapping defect in `RoyalMultiSlidePresentation.jsx`.

However, the complete investigation across all eight templates proves conclusively that:
> **The visual discrepancy is NOT an isolated bug in individual template files. It is a SYSTEMIC ARCHITECTURAL FAILURE of attempting to manually reimplement complex web micro-applications as native React Native component trees.**

---

### 2. The Core Technical Disconnects

#### A. The W3C DOM vs. React Native Yoga Incompatibility
The website templates are built by web creative engineers who utilize the full expressive power of modern browser standards:
- **HTML5 2D / WebGL Canvas**: Used in Template 02 for floating diya water reflections, in Template 04 for interactive gold foil scratch cards, in Template 05 for falling Atchathai rice showers, and in Birthday for confetti physics.
- **CSS 3D Transform Hinge Physics**: `perspective: 1400px`, `transform: rotateY(-105deg)`, `transform-origin: left` to swing open double wooden doors.
- **Dynamic CSS Blend Modes & Masks**: `-webkit-mask-image: linear-gradient(...)`, `mix-blend-mode: screen`, radial gradients with concentric stops.

In contrast, React Native does not run a browser engine. It executes on the **Yoga layout engine**, which is a strict subset of CSS Flexbox implemented in C++:
- Yoga has **no built-in HTML5 Canvas**.
- Yoga has **no CSS blend modes, masks, or SVG symbol definitions (`<symbol>`, `<use>`)**.
- Yoga has **no CSS 3D depth sorting (`transform-style: preserve-3d`)**.
- Yoga cannot execute CSS `@keyframes` that manipulate DOM elements.

#### B. The Maintenance Multiplication Trap
To reproduce the website templates natively in React Native, an engineering team must:
1. Re-code each template from scratch in JSX.
2. Re-implement canvas physics using heavy third-party libraries (e.g. `react-native-skia` or `react-native-reanimated`).
3. Re-bundle and register every Google Font in Expo's font registry.
4. Manually tune pixel dimensions for every screen density.

**The Fatal Flaw**: Every time a marketing manager or frontend developer adjusts a floral border, changes a color token, or fixes a typo in `public/template-02.html` on the website, **the mobile app instantly falls out of visual parity**. Maintaining two completely independent rendering engines for eight templates creates an endless cycle of divergence and regression.

---

### 3. The Customer Trust & Publication Paradox

The most severe consequence of the native reimplementation approach is the **Publication Paradox**:

```text
Customer in Mobile App                       Guest Receiving Link
┌──────────────────────────────┐            ┌──────────────────────────────┐
│       MOBILE PREVIEW         │            │   PUBLISHED INVITATION       │
│  Native React Native View    │            │   Website HTML/CSS Render    │
├──────────────────────────────┤            ├──────────────────────────────┤
│ • Approximated static cards  │  PUBLISH   │ • Full 3D palace doors       │
│ • Missing scratch reveals    │ ─────────► │ • Interactive scratch card   │
│ • Missing Atchathai shower   │            │ • Interactive Varmala        │
│ • Different font rendering   │            │ • Beautiful marigold canvas  │
└──────────────────────────────┘            └──────────────────────────────┘
```

When a customer drafts their invitation on mobile, they expect that what they see on their phone screen is **exact, pixel-for-pixel what their wedding guests will see**. 

If the mobile app displays an approximated native card while the published link serves the rich HTML/CSS experience, the customer believes the mobile app is broken or misconfigured. 

**True visual parity means identical output between preview and publication.**
