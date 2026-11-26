# GLOBAL_TEMPLATE_00_RENDERING_ARCHITECTURE_AUDIT
## Executive Architectural Audit: Global Template Rendering Strategy

### 1. Executive Summary & Problem Statement
The **You Are Mine** bespoke invitation platform operates across two primary client platforms:
1. **Website**: Next.js 15 App Router, React, TypeScript, Tailwind CSS, hosting high-fidelity interactive templates.
2. **Mobile Application**: Expo / React Native, 100% JavaScript, running on iOS and Android.

Despite sharing a single PostgreSQL database, unified customer identity, identical draft schemas, and centralized publication pipelines, the mobile application has suffered from persistent visual divergence from the website. 

When the mobile app attempted to manually recreate individual templates as native React Native component trees (e.g. `RoyalMultiSlidePresentation.jsx` or `UdaipurPaperPalaceEngine.jsx`), it created an untenable architectural maintenance burden:
- Website templates are not static card designs; they are **complex, interactive web micro-applications** featuring HTML5 2D/WebGL Canvas particle physics, CSS 3D perspective hinges (`rotateY(-105deg)`), interactive canvas scratch-off reveals, dynamic SVG symbol libraries, and custom web typography.
- Trying to manually reimplement these 8 distinct, sophisticated web micro-apps in React Native using the Yoga Flexbox engine requires writing thousands of lines of fragile imperative animation code per template, resulting in simplified approximations rather than true visual parity.
- Furthermore, every visual enhancement or bug fix applied to a website template immediately creates a regression in the mobile clone.

This audit evaluates the fundamental rendering architectures across both platforms, provides a complete 8-template parity matrix, objectively compares four strategic rendering options (including the **Hybrid Architecture**), and provides a comprehensive migration and risk mitigation roadmap.

---

### 2. Architecture Comparison at a Glance

```text
┌────────────────────────────────────────────────────────────────────────┐
│               UNIFIED BACKEND & DATA CONTRACT (SINGLE SOURCE)          │
│   PostgreSQL • Supabase • Drafts API • Publication Engine • Razorpay   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌──────────────────────────────┐          ┌──────────────────────────────┐
│       WEBSITE PLATFORM       │          │      MOBILE APP (EXPO)       │
│      Next.js 15 App Router   │          │     React Native (Pure JS)   │
├──────────────────────────────┤          ├──────────────────────────────┤
│ • Canonical Template HTML/JS │          │ • Native Navigation & Auth   │
│ • Fullscreen Iframe Hosts    │          │ • Native Editor BottomSheets │
│ • Web Audio & Canvas Systems │          │ • Current: Fragile Native    │
│ • CSS 3D & Web Fonts (CDN)   │          │   Clones (Yoga Flexbox)      │
│ • 100% Visual Golden Ref     │          │ • Target: Hybrid Controlled  │
│                              │          │   WebView Viewport Container │
└──────────────────────────────┘          └──────────────────────────────┘
```

---

### 3. Key Findings of the Architectural Audit
1. **Website Architectural Heterogeneity**:
   The website does not use a single unified React template renderer. It uses a **tri-model architecture**:
   - `template-01`: Native Next.js React component deck.
   - `template-02`, `03`, `04`, `05`: Standalone handcrafted HTML5/CSS3/Canvas micro-applications served statically from `public/*.html` and hosted inside Next.js iframes with live `postMessage` synchronization.
   - `birthday`, `valentine`, `date-planner`: Next.js React components using Framer Motion and Web APIs.
2. **The Mobile Monolithic Cloner Trap**:
   Mobile initially attempted to force all 8 templates into a single 6-slide deck (`RoyalMultiSlidePresentation.jsx`) designed for Template 01, causing Template 04 to display Template 01's navy background and Ganesh shloka.
3. **The Limits of Manual Native Porting**:
   While creating dedicated native engines (like `UdaipurPaperPalaceEngine.jsx`) isolates Template 04 from Template 01, continuing this path for Templates 02, 03, 05, Birthday, Valentine, and Date Planner would require maintaining ~10,000 lines of duplicate UI code, separate font pipelines, and emulated physics engines.
4. **The Power of the Hybrid Architecture (Option D)**:
   By embedding the canonical website templates inside a controlled, offline-cached native WebView container while retaining React Native for navigation, draft storage, authentication, and editor toolbars, the platform achieves **100% exact visual parity immediately across all 8 templates with zero ongoing design duplication**.

---

### 4. Structure of Deliverables
- **GLOBAL_TEMPLATE_01**: Complete analysis of all 8 website template engines, technologies, and data interfaces.
- **GLOBAL_TEMPLATE_02**: Complete analysis of the mobile rendering pipeline, layout engines, and asset bindings.
- **GLOBAL_TEMPLATE_03**: Full 8-template parity matrix across 12 architectural dimensions.
- **GLOBAL_TEMPLATE_04**: In-depth root cause analysis explaining the fundamental limits of Yoga Flexbox vs. DOM CSS.
- **GLOBAL_TEMPLATE_05**: Comprehensive strategic comparison of Options A, B, C, and D.
- **GLOBAL_TEMPLATE_06**: Recommended Target Architecture specification (The Hybrid Adapter Model).
- **GLOBAL_TEMPLATE_07**: Migration plan, offline asset strategy, and risk mitigation.
- **GLOBAL_TEMPLATE_08**: Testing, automated regression suites, and acceptance criteria.
