# TEMPLATE_PARITY_00_ARCHITECTURE_AUDIT
## Visual & Architectural Audit: Website (Next.js 15) vs. Mobile (Expo / React Native)

### 1. Executive Summary & Objective
This audit provides an exhaustive architectural inspection of the template rendering engines across the **You Are Mine** web platform (`Next.js 15 App Router`) and mobile client (`Expo / React Native`).
The user has reported major visual discrepancies where mobile template previews diverge drastically from their website counterparts—most notably evidenced in `preview/tpl-wedding-paper-palace-04?mode=demo`, where mobile forced the Udaipur Blush Paper-Palace template into Template 01's imperial navy arch background, Ganesh shloka, and rigid gold-serif layout.

This audit details the root structural divergences, the dual rendering pipelines, typography engines, layout systems, asset distribution, animation paradigms, and audio subsystems across all 8 supported celebration templates.

---

### 2. Architectural Comparison Matrix

| Architectural Dimension | Website (`src/` Next.js 15) | Mobile (`you-are-mine-mobile/` Expo React Native) | Parity Status |
| :--- | :--- | :--- | :--- |
| **Language & Typing** | TypeScript (`.ts`, `.tsx`), Strict Typing | Pure JavaScript (`.js`, `.jsx`), 0 TypeScript | Preserved (Strict Constraint) |
| **Rendering Strategy** | **Heterogeneous Tri-Model Architecture**: React components (`tpl-01`, `birthday`, `valentine`, `date-planner`) + Fullscreen sandboxed HTML5/CSS3/Canvas micro-apps (`tpl-02`, `tpl-03`, `tpl-04`, `tpl-05`). | **Monolithic Single-Engine Model**: Single 6-slide deck (`RoyalMultiSlidePresentation.jsx`) backed by static local PNG arch assets. | **CRITICAL MISMATCH** |
| **Layout Subsystem** | CSS Flexbox, CSS Grid, 3D CSS Perspectives (`perspective: 900px`, `transform-style: preserve-3d`), Fixed Viewports. | Yoga Engine (Pure Flexbox), Absolute Position overlays, No native CSS Grid, 2D/3D affine matrix transformations. | High Divergence |
| **Typography System** | Dynamic Google Fonts CDN: *Great Vibes*, *Cormorant Garamond*, *Baloo 2*, *Karla*, *Playfair Display*, *Noto Serif Tamil*, *Jost*, *Pinyon Script*. | System fallback font strings (`'serif'`, `'Georgia'`), lacking loaded web fonts. Missing cursive scripts. | Critical Divergence |
| **Asset Pipeline** | WebP/SVG/JPG served from Next.js `/public/images/`, vector SVG inline paths, inline base64 canvas assets. | Bundled static assets via Metro `require('../../assets/...')` falling back to navy arch images (`04_welcome_intro.png`, etc.). | High Divergence |
| **Animation Subsystem** | CSS `@keyframes`, 3D door rotations (`rotateY(-105deg)`), Canvas particles (marigold, atchathai, confetti), Framer Motion. | React Native `Animated` / hardcoded opacity transitions, lacking multi-layered physics or 3D door hinges. | High Divergence |
| **Audio Playback** | HTML5 `<audio>` element with Web Audio API auto-resume on first gesture, crossfade, and per-template audio triggers. | `MusicService` (`expo-av`), singleton player with playback tracking. (Recently fixed missing `.stop()` / `.pause()` crashes). | Reconciled at service level, needs per-template hookup. |

---

### 3. Deep Dive: Website Rendering Architecture

The website features **three distinct architectural paradigms**:

#### Paradigm 1: Native Next.js React Multi-Section (`template-01`)
- **Route**: `src/app/template-01/page.tsx`
- **Component Hierarchy**:
  ```text
  src/app/template-01/
  └── PresentationContainer.tsx
      ├── IntroGateway (Curtain / Arch reveal)
      ├── WelcomeSection (Imperial navy & gold foil border)
      ├── SaveTheDateSection
      ├── EventsOverviewSection (Haldi, Mehendi, Sangeet, Wedding, Reception)
      ├── FamilyBlessingsSection
      ├── VenueLocationSection (Google Maps integration)
      ├── RSVPSection (Interactive form with guest counter)
      └── AudioFloatingController
  ```
- **Design Tokens**: `#121E35` (Imperial Navy), `#D7B875` (Luminous Royal Gold), `#EDE2CF` (Champagne Cream).
- **Fonts**: `Cormorant Garamond`, `Cinzel`, `Playfair Display`.

#### Paradigm 2: Standalone Sandboxed HTML5/CSS3/Canvas Micro-Applications (`template-02`, `03`, `04`, `05`)
- Next.js acts as an iframe host via `src/app/template-0X/page.jsx`.
- Each template is a handcrafted 50 KB – 424 KB single-page interactive application in `public/template-0X.html`:
  - **Template 02 (`public/template-02.html`) — Arjun & Sia Royal Lake Palace**:
    - Dark Forest Green (`#22332a`) and Marigold Gold (`#d9a441`).
    - Sliding dual entrance doors with brass knocker rings.
    - Canvas-driven floating marigold petals & diya water reflections.
    - 8 thematic chapters: Welcome, Save The Date, Love Story, Sacred Muhurtham, Sangeet, Gallery, Venue Map, RSVP.
    - Fonts: `Playfair Display`, `Cormorant Garamond`, `Karla`.
  - **Template 03 (`public/template-03.html`) — Thirumanam South Indian Temple**:
    - Temple Emerald Silk (`#06201a`), Crimson (`#6a0d20`), Luminous Brass (`#d9a521`).
    - Gopuram gate arch doors with brass bell ringing animation.
    - Tamil shlokas and Kolam floor rangoli canvas overlays.
    - 8 sections with authentic Nadaswaram and Mast Magan soundtrack.
    - Fonts: `Cinzel Decorative`, `Noto Serif Tamil`, `Cormorant Garamond`.
  - **Template 04 (`public/template-04.html`) — Tara & Kabir Grand Udaipur Palace**:
    - Soft Blush Peach & Rose Paper (`#f4d6cc`, `#fff6ea`, `#a24a6a`).
    - 3D rotating double doors (`transform: rotateY(-105deg)`).
    - Pop-up paper craft palace layers (`.board`, `.slot`).
    - Interactive scratch-off cards revealing venue secrets.
    - Interactive Varmala Garland stringing ceremony.
    - Fonts: `Great Vibes` (cursive handwritten script), `Baloo 2`, `Cormorant Garamond`.
  - **Template 05 (`public/template-05.html`) — Arun & Meenakshi Traditional South Indian**:
    - Raw Silk Cream (`#faf5e8`), Temple Maroon (`#6b1030`), Sacred Green (`#0e4a30`).
    - Wax seal gate opening animation.
    - Interactive Atchathai (sacred yellow turmeric rice) shower.
    - 7 ceremonial chapters with traditional Nadaswaram audio.
    - Fonts: `Pinyon Script`, `Jost`, `Cormorant Garamond`, `Noto Sans Tamil`.

#### Paradigm 3: Interactive Framer Motion React Celebrations (`birthday`, `valentine`, `date-planner`)
- **Route**: `src/app/birthday/page.jsx`, `src/app/valentine/page.jsx`, `src/app/date-planner/page.jsx`
- **Features**:
  - `birthday`: Peach Cream (`#FFF3EE`), interactive 3D birthday cake with blowable candles, confetti cannons, polaroid carousel, music player (`Happy Birthday Jazz`).
  - `valentine`: Blush Pink (`#FFF4F0`), animated wax-sealed love letter unfold, interactive "Will You Be My Valentine?" proposal with evasive NO button and fireworks YES button, falling rose petals.
  - `date-planner`: Step-by-step romantic date itinerary creator with mood selection, time capsule, and invitation card generator.

---

### 4. Deep Dive: Mobile Rendering Architecture

The mobile application (`you-are-mine-mobile`) uses a radically different layout hierarchy:

```text
you-are-mine-mobile/
├── app/
│   ├── preview/[id].jsx          <-- Loads invitation preview
│   ├── editor/[id].jsx           <-- Editor screen (canvas vs slide deck)
│   └── template/[id].jsx         <-- Template details & live demo entry
└── components/
    ├── preview/
    │   ├── GrandEntranceGate.jsx              <-- Royal sliding double gates
    │   ├── RoyalMultiSlidePresentation.jsx   <-- Monolithic 6-slide presentation
    │   ├── EnvelopeAnimation.jsx             <-- Wax seal envelope animation
    │   ├── CeremonyTimelineSection.jsx       <-- Itinerary component
    │   ├── RSVPPreviewSection.jsx            <-- RSVP modal
    │   └── FloatingAudioPlayer.jsx           <-- Audio controller
    └── editor/
        ├── InvitationCanvas.jsx              <-- Custom draggable canvas
        └── EditorToolbar.jsx
```

#### The Monolithic Bottle-Neck: `RoyalMultiSlidePresentation.jsx`
- Currently, **every** template routed to mobile preview invokes `RoyalMultiSlidePresentation.jsx`.
- While `RoyalMultiSlidePresentation.jsx` contains basic conditionals (`category.isBirthday`, `category.isValentine`, `category.isTempleWedding`), all wedding templates share:
  1. The exact same 6 slide schemas:
     - Slide 1: Welcome & Invocation
     - Slide 2: Save The Date
     - Slide 3: Wedding Events Overview
     - Slide 4: Family Blessings
     - Slide 5: Venue Location
     - Slide 6: Closing Thank You & RSVP
  2. Slides 2 through 6 fall back to `template01` static assets:
     - `06_save_the_date.png`
     - `07_wedding_events_overview.png`
     - `13_family_blessings.png`
     - `14_venue_location.png`
     - `15_closing_thank_you.png`
  3. Typography is hardcoded to gold serif text overlays designed solely for `tpl-wedding-navy-01`.
  4. The unique signature features of templates 02, 03, 04, 05, Birthday, and Valentine are completely omitted.

---

### 5. Architectural Parity Assessment Summary

| Template ID | Website Paradigm | Mobile Implementation | Divergence Severity |
| :--- | :--- | :--- | :--- |
| `tpl-wedding-navy-01` | React Multi-Section (Next.js) | `RoyalMultiSlidePresentation` (Native) | **LOW**: Mobile was originally built matching this template. |
| `tpl-anniversary-gold-02` | HTML5/CSS3 Iframe (`template-02.html`) | Forced into `RoyalMultiSlidePresentation` | **CRITICAL**: Missing green forest theme, marigold petals, lotus rangoli, 8 chapters. |
| `tpl-wedding-temple-03` | HTML5/CSS3 Iframe (`template-03.html`) | Forced into `RoyalMultiSlidePresentation` | **CRITICAL**: Missing emerald silk theme, gopuram arch doors, temple bells, Tamil shlokas. |
| `tpl-wedding-paper-palace-04` | HTML5/CSS3 Iframe (`template-04.html`) | Forced into `RoyalMultiSlidePresentation` | **CRITICAL**: Shown in user screenshot `media_1795690361919_523af363.png`. Missing blush peach paper craft, 3D doors, pop-up palace, scratch-off reveals. |
| `tpl-wedding-south-indian-05` | HTML5/CSS3 Iframe (`template-05.html`) | Forced into `RoyalMultiSlidePresentation` | **CRITICAL**: Missing silk cream/maroon theme, wax seal break, atchathai shower. |
| `tpl-birthday-celebration-01` | React Framer Motion (`birthday/page.jsx`) | Partially branched in `RoyalMultiSlidePresentation` | **HIGH**: Missing candle blowing, interactive 3D cake, polaroid gallery. |
| `tpl-valentine-love-01` | React Framer Motion (`valentine/page.jsx`) | Partially branched in `RoyalMultiSlidePresentation` | **HIGH**: Missing digital love letter unfold, evasive NO button, blooming rose petals. |
| `tpl-date-planner-01` | React Component (`date-planner/page.jsx`) | Forced into Valentine branch | **HIGH**: Missing date itinerary builder, time capsule, mood selection. |
