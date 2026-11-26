# TEMPLATE_PARITY_03_ROOT_CAUSE_ANALYSIS
## Deep Technical Root Cause Analysis of Rendering & Architectural Divergences

### 1. Executive Summary
The visual divergence between the website and mobile invitation templates is **not a collection of superficial styling oversights**, but the direct consequence of fundamental architectural, typographical, and layout engine differences between the web and mobile implementations.

This document identifies the six fundamental root causes and explains the technical mechanisms behind each divergence.

---

### 2. Root Cause 1: The Architectural Dichotomy (Iframe Micro-Apps vs. Monolithic Slide Deck)

#### Website Mechanism:
- On the website, templates 02, 03, 04, and 05 are not rendered by React. They are **standalone, self-contained HTML5/CSS3/Canvas micro-applications** loaded inside full-screen `<iframe>` elements.
- Each HTML file (`template-02.html` through `template-05.html`) contains hundreds of lines of dedicated CSS, custom DOM animations, WebGL/2D canvas particle systems, and Google Fonts loaded via `<link>` tags.
- For example, `template-04.html` (424 KB) contains an entire bespoke 3D paper-palace physics and rendering engine built specifically for Tara & Kabir.

#### Mobile Mechanism:
- The mobile app (`you-are-mine-mobile`) was designed as a pure React Native application with a single slide-deck component: `RoyalMultiSlidePresentation.jsx`.
- When the mobile app loads any template (e.g. `preview/tpl-wedding-paper-palace-04`), it passes the template data into `RoyalMultiSlidePresentation.jsx`.
- Because `RoyalMultiSlidePresentation.jsx` was originally designed around Template 01 (Royal Navy), it attempts to force every wedding template into Template 01's layout structure, using Template 01's static assets (`04_welcome_intro.png`, `06_save_the_date.png`, etc.) whenever a template does not provide an override for slides 2 through 6.

#### Impact:
- Template 04 displays Template 01's navy background, Ganesh shloka, and gold serif typography instead of the peach-rose paper craft palace.

---

### 3. Root Cause 2: Typography Subsystem & Font Loading Disparities

#### Website Mechanism:
- The website leverages Google Fonts CDN directly inside `<head>`:
  - `template-04.html` loads:
    - `Great Vibes` (cursive calligraphy)
    - `Cormorant Garamond` (classic royal serif)
    - `Baloo 2` (modern Indian headline sans)
  - `template-03.html` loads:
    - `Noto Serif Tamil`
    - `Cinzel Decorative`
  - `template-05.html` loads:
    - `Pinyon Script`
    - `Jost`

#### Mobile Mechanism:
- In React Native, web fonts cannot be referenced via CSS `@import` or `<link>`. They must be explicitly downloaded, bundled into the app binary or loaded asynchronously via `expo-font`, and mapped to explicit family names in React Native styles.
- In `you-are-mine-mobile`, `app/_layout.jsx` only loaded basic standard fonts. Cursive fonts like `Great Vibes` or `Pinyon Script` were never loaded.
- As a fallback, `RoyalMultiSlidePresentation.jsx` relied on `'serif'`, which resolves on Android/iOS to system serif (Roboto Serif or Times New Roman).

#### Impact:
- Mobile headings look blocky, rigid, and lack the signature handwritten elegance of the website templates.

---

### 4. Root Cause 3: Layout Engine Divergence (CSS 3D / CSS Grid vs. Yoga Flexbox)

#### Website Mechanism:
- Website templates rely heavily on CSS features not natively supported by React Native's Yoga layout engine:
  1. **CSS 3D Perspective**:
     - `perspective: 900px`
     - `transform-origin: left`
     - `transform: rotateY(-115deg)`
     This allows double doors to swing outward into 3D space with realistic foreshortening.
  2. **Concentric CSS Borders & Shadows**:
     - Nested `border-radius: 999px 999px 0 0` with offset box shadows creating physical paper layer depth.
  3. **CSS Grid**:
     - `display: grid; grid-template-columns: repeat(3, 1fr)` for palace paper boards.

#### Mobile Mechanism:
- React Native's Yoga engine only supports Flexbox (subset of CSS Flexbox) and absolute positioning.
- 3D transforms (`rotateY`) require matrix perspective calculations (`transform: [{ perspective: 1000 }, { rotateY: '...' }]`) and proper anchor points.
- Mobile `GrandEntranceGate.jsx` only implemented simple 2D sliding gates (`transform: [{ translateX }]`).

#### Impact:
- Mobile doors slide flatly horizontally off-screen rather than swinging open like authentic 3D palace doors.

---

### 5. Root Cause 4: Asset Resolution & Fallback Hierarchy

#### Website Mechanism:
- All static assets reside in `public/` and are addressed via absolute web paths (`/images/templates/...`, `/audio/...`).
- SVG vector graphics are embedded directly as inline `<svg>` elements with crisp mathematical scaling.

#### Mobile Mechanism:
- Mobile relies on Metro bundler `require('../../assets/...')`.
- In `RoyalMultiSlidePresentation.jsx` (lines 261-318):
  - `slide1Bg` had basic branching for showcase images (`arjun-sia.jpg`, `thirumanam.jpg`, `udaipur-palace.jpg`).
  - **However, `slide2Bg`, `slide3Bg`, `slide4Bg`, `slide5Bg`, and `slide6Bg` completely lacked branching for `isLakePalace` and `isUdaipurPalace`!**
  - They unconditionally defaulted to `assets/template01/*.png`!

#### Impact:
- The moment a user swipes past Slide 1 in Template 02 or Template 04, the entire theme instantly collapses back into Template 01's navy blue cards.

---

### 6. Root Cause 5: Interactive Ceremony Gaps

#### Website Mechanism:
- Each website template features a signature gamified interaction:
  - Template 02: Canvas marigold petal shower and floating water diyas.
  - Template 04: Gold scratch-off reveal cards and interactive Varmala garland stringing.
  - Template 05: Wax seal fracture and yellow Atchathai rice shower.
  - Birthday: Interactive birthday cake candle blowing (audio/touch) and confetti burst.
  - Valentine: Evasive proposal "No" button and blooming "Yes" celebration.

#### Mobile Mechanism:
- Mobile preview was implemented as a passive viewing experience. None of these interactive layers were implemented in `RoyalMultiSlidePresentation.jsx`.

#### Impact:
- Mobile users receive a static, flat card deck instead of the lively, interactive experience celebrated on the website.

---

### 7. Root Cause 6: Music Service & Audio Hookup Fragility

#### Website Mechanism:
- Audio elements in `template-0X.html` listen for user gesture (`click`, `touchstart`) and immediately resume playback with automatic looping.

#### Mobile Mechanism:
- Mobile uses `expo-av` via `MusicService`.
- Previously, missing method aliases (`stop()`, `pause()`) caused unhandled promise rejections that crashed the presentation screen (`_servicesMusicService.MusicService.stop is not a function`), preventing the preview from rendering at all.
- While the method crashes were repaired in the previous turn, the dynamic mapping between `template.defaultFields.audioSource` and native asset/remote stream resolution requires robust caching and fallback.
