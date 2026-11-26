# GLOBAL_TEMPLATE_02_MOBILE_RENDERER_ANALYSIS
## Deep Technical Analysis of Mobile Renderer Architecture

### 1. Mobile Rendering Pipeline & Routing Hierarchy

The mobile application (`you-are-mine-mobile`) operates on **Expo / React Native (100% JavaScript)**. 

The rendering pipeline flows through two primary screen entry points:
1. **Preview Route**: `app/preview/[id].jsx` (handles live demo viewing and draft preview).
2. **Editor Route**: `app/editor/[id].jsx` (handles customer customization with dual-mode toggle between Template Presentation and Freeform Drag Canvas).

```text
MOBILE CLIENT (app/preview/[id].jsx & app/editor/[id].jsx)
                          │
                          ▼
            TemplateRendererRouter.jsx (Registry)
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
  UdaipurPaperPalaceEngine.jsx   RoyalMultiSlidePresentation.jsx
  (Template 04 Dedicated)        (Monolithic Deck for Tpl 01, 02, 03, 05, etc.)
```

---

### 2. Dissection of the Mobile Renderers

#### A. The Monolithic Legacy Engine: `RoyalMultiSlidePresentation.jsx`
- **Initial Purpose**: Built originally as a 6-slide presentation recreating **Template 01: The Royal Navy Wedding**.
- **The Cloner Bottleneck**:
  - Rather than building dedicated renderers, `RoyalMultiSlidePresentation.jsx` attempted to absorb all templates by adding basic conditional checks (`category.isBirthday`, `category.isValentine`, `category.isTempleWedding`, `category.isLakePalace`).
  - While Slide 1 conditionally swapped the cover image, **Slides 2 through 6 had hardcoded fallbacks to Template 01's navy assets**:
    - `assets/template01/06_save_the_date.png`
    - `assets/template01/07_wedding_events_overview.png`
    - `assets/template01/13_family_blessings.png`
    - `assets/template01/14_venue_location.png`
    - `assets/template01/15_closing_thank_you.png`
  - Typography was hardcoded to gold serif text overlays (`styles.serifHeadingGold`) with Ganesh Sanskrit invocations.
- **Result**: Every wedding template opened in mobile (Templates 02, 03, 04, 05) was forced into Template 01's navy blue aesthetic.

#### B. The Dedicated Native Engine: `UdaipurPaperPalaceEngine.jsx`
- **Purpose**: Implemented in Phase 2 as a dedicated renderer for Template 04.
- **Architectural Value**:
  - Completely detached Template 04 from Template 01's navy assets.
  - Recreated the blush peach palette (`#f4d6cc`), triple concentric paper arches, and `Great Vibes` cursive script.
  - Implemented native 3D perspective double doors using React Native `Animated`.
- **Architectural Limitation**:
  - While `UdaipurPaperPalaceEngine.jsx` successfully resolved Template 04, it required writing **~800 lines of imperative React Native code**.
  - Recreating the website's remaining rich features (the canvas scratch-off reveal cards, the Varmala garland bezier stringing, and the pop-up palace interactive puzzle) would require an additional ~1,500 lines of complex canvas and gesture physics code.
  - Repeating this manual native porting for Templates 02, 03, 05, Birthday, Valentine, and Date Planner would require maintaining over **10,000 lines of duplicate UI code** across mobile.

---

### 3. Systematic Incompatibilities between DOM CSS and React Native Yoga

React Native's layout engine (Yoga) is a pure Flexbox implementation that intentionally omits major portions of the W3C CSS specification. The website templates rely heavily on these omitted features:

| Web Feature Used on Website | Availability in Web Browsers | React Native Yoga Equivalent | Divergence Impact |
| :--- | :--- | :--- | :--- |
| **CSS 3D Perspective (`perspective: 1400px`, `rotateY`)** | Full Hardware Acceleration | Supported via matrix transform, but lacks true depth sorting (`transform-style: preserve-3d`). | Doors can rotate, but layered child elements clip and lose physical paper depth. |
| **HTML5 2D / WebGL Canvas** | Native `<canvas>` with pixel-level blend modes (`destination-out`) | Requires heavy third-party native libraries (`react-native-skia` or `expo-gl`). | Scratch-off card reveals and particle bursts cannot run in standard native views. |
| **CSS Conic & Radial Gradients** | Built-in CSS `conic-gradient()`, `radial-gradient()` | None in core React Native. Requires `expo-linear-gradient` (linear only) or complex SVG paths. | Rich palace shading, aura glows, and temple door textures cannot be styled natively. |
| **CSS Keyframe Physics & Particle Emitters** | Native CSS `@keyframes` with hundreds of concurrent particles (marigold, rice, petals, fireworks) | React Native `Animated` / JS thread bottleneck. Stutters when managing 50+ concurrent animated nodes. | Petal showers and firecracker bursts cause frame drops on low/mid-tier Android devices. |
| **SVG Symbol Libraries (`<symbol>`, `<use>`)** | Native SVG DOM reuse | `react-native-svg` requires static component JSX rewriting; `<use href="#id">` is buggy across platforms. | Complex palace illustrations, bride/groom vectors, and ceremonial symbols must be manually rebuilt. |

---

### 4. Preview vs. Published Output Rendering Divergence

A critical product requirement is that **Draft Preview** and **Published Invitations** must look and behave identically:
- **On the Website**: When an invitation is published, the public invitation URL (e.g. `youaremine.love/invite/[slug]`) renders the exact same template engine that was previewed during drafting.
- **On Mobile**:
  - Currently, when a customer publishes an invitation from the mobile app, the generated web link opens the **website's HTML/CSS renderer** in a browser!
  - Consequently, if mobile renders a native approximation that differs from the website, **the customer sees one design in the mobile app, but their wedding guests see a completely different design on the web link!**
- This divergence creates severe customer distrust and refund requests. Achieving true rendering parity is therefore an existential requirement for the publication business model.
