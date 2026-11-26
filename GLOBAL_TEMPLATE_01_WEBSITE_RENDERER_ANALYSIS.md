# GLOBAL_TEMPLATE_01_WEBSITE_RENDERER_ANALYSIS
## Deep Technical Analysis of Website Template Architecture

### 1. Architectural Classification of Website Templates

The website (`src/`) hosts eight celebration templates. Investigation reveals that the website does **not** employ a single, unified React rendering engine. Instead, it utilizes three distinct architectural paradigms:

```text
WEBSITE TEMPLATES (8)
├── PARADIGM 1: React Multi-Section Vertical & Horizontal Deck
│   └── Template 01: Aarav & Riya — The Royal Navy Wedding (src/components/template01/)
│
├── PARADIGM 2: Standalone HTML5 / WebGL / CSS3 / Canvas Interactive Micro-Applications
│   ├── Template 02: Arjun & Sia — Royal Lake Palace Heritage (public/template-02.html)
│   ├── Template 03: Thirumanam — South Indian Temple Wedding (public/template-03.html)
│   ├── Template 04: Tara & Kabir — The Grand Udaipur Palace (public/template-04.html)
│   └── Template 05: Arun & Meenakshi — Traditional South Indian (public/template-05.html)
│
└── PARADIGM 3: Interactive Framer Motion React Applications
    ├── Template 06: Golden Birthday Surprise (src/app/birthday/)
    ├── Template 07: Will You Be My Valentine? (src/app/valentine/)
    └── Template 08: Our Romantic Date Planner (src/app/date-planner/)
```

---

### 2. Comprehensive Template-by-Template Breakdown

#### Template 01: Aarav & Riya — The Royal Navy Wedding (`tpl-wedding-navy-01`)
- **Host Route**: `src/app/template-01/page.tsx`
- **Technology Stack**: React 19, TypeScript, Tailwind CSS, Framer Motion, HTML5 Audio.
- **Structure**:
  - Full-screen container with 11 custom presentation sections: `IntroGateway`, `WelcomeSection`, `SaveTheDateSection`, `EventsOverviewSection`, `HaldiSection`, `MehendiSection`, `WeddingSection`, `ReceptionSection`, `FamilyBlessingsSection`, `VenueLocationSection`, `RSVPSection`.
- **Assets & Styling**:
  - Imperial Navy (`#121E35`), Royal Gold foil (`#D7B875`), Champagne Cream (`#EDE2CF`).
  - High-resolution WebP arch backgrounds (`/images/templates/royal-navy-wedding-card.webp`).
  - Inline vector SVG filigree frames and borders.
- **Fonts**: `Cormorant Garamond`, `Cinzel Decorative`, `Playfair Display`.
- **Audio**: `Aaj Sajeya — Goldie Sohel` (`/audio/aaj-sajeya.mp3`) with Web Audio API auto-resume on first user gesture.

---

#### Template 02: Arjun & Sia — Royal Lake Palace Heritage (`tpl-anniversary-gold-02`)
- **Host Route**: `src/app/template-02/page.jsx` (Iframe embed)
- **Source File**: `public/template-02.html` (85 KB standalone web application)
- **Technology Stack**: Native HTML5, CSS3 3D transforms, HTML5 Canvas 2D particle engine, Web Audio API, Vanilla JavaScript.
- **Key Features & Interactions**:
  1. `#intro` Door Animation: Radial gradient sliding double doors (`.door.l`, `.door.r`) with brass knocker rings and gold seam illumination.
  2. Canvas Particle Physics: `#introCv` renders floating marigold flower petals, water ripples, and glowing Diwali diya reflections.
  3. 8 Bespoke Chapters: Welcome, Save the Date with live countdown, "How We Met" photo narrative, Sacred Muhurtham rituals, Sangeet, Palace Map, and RSVP.
  4. Bidirectional Messaging: Subscribes to `window.addEventListener('message')` with `INK_IVORY_CUSTOM_UPDATE` for live text and audio updates.
- **Tokens & Fonts**:
  - Dark Forest Green (`#22332a`, `#10302a`), Marigold Gold (`#d9a441`, `#f0a020`), Cream Paper (`#f8f2e2`).
  - Fonts: `Playfair Display`, `Cormorant Garamond`, `Karla`.
- **Audio**: `Kudmayi (Film Version) — Shahid Mallya, Pritam` (`/audio/kudmayi.mp3`).

---

#### Template 03: Thirumanam — South Indian Temple Wedding (`tpl-wedding-temple-03`)
- **Host Route**: `src/app/template-03/page.jsx` (Iframe embed)
- **Source File**: `public/template-03.html` (57 KB standalone web application)
- **Technology Stack**: Native HTML5, CSS3 gradients, Canvas Kolam floor rangoli generator, Vanilla JavaScript.
- **Key Features & Interactions**:
  1. Sacred Temple Loader: Aura radiance animation with authentic Tamil blessing invocation (`ஸ்ரீ கணேசாய நமஹ`).
  2. Temple Gopuram Doors: Double arch doors flanked by swinging brass temple bells with realistic audio chime triggers.
  3. Ceremonial Timeline: 7 South Indian rituals (Vratham, Janavasam, Kasi Yatra, Oonjal, Kanyadaanam, Mangalya Dharanam, Saptapadi) with auspicious Nakshatram and Lagnam metadata.
- **Tokens & Fonts**:
  - Emerald Silk Night (`#06201a`), Crimson Silk (`#6a0d20`), Luminous Brass (`#d9a521`).
  - Fonts: `Cinzel Decorative`, `Noto Serif Tamil`, `Cormorant Garamond`.
- **Audio**: `Mast Magan & Nadaswaram Mangala Vathiyam` (`/audio/mast-magan.mp3`).

---

#### Template 04: Tara & Kabir — The Grand Udaipur Palace (`tpl-wedding-paper-palace-04`)
- **Host Route**: `src/app/template-04/page.jsx` (Iframe embed)
- **Source File**: `public/template-04.html` (424 KB standalone web application)
- **Technology Stack**: HTML5, CSS3 3D perspective (`perspective: 1400px`), HTML5 Canvas Scratch-Off Engine, SVG symbol library, Fireworks particle engine (`launchCrackers`, `burst`), Vanilla JavaScript.
- **Key Features & Interactions**:
  1. 3D Perspective Double Doors: Sage-green doors (`.half.l`, `.half.r`) rotate outward on a Y-axis hinge (`rotateY(-105deg)`) with realistic shadow foreshortening.
  2. Triple Concentric Paper Arches: Physical depth achieved via nested rounded borders (`.a1` peach `#f4cba9`, `.a2` pink `#eaa9b8`, `.a3` cream `#fff6e3`).
  3. Interactive Pop-up Palace: 6-slot puzzle (`#board`) where tapping slots pops up palace turrets (`.slot.pop`) with confetti bursts.
  4. Interactive Canvas Scratch-Off Cards: Gold foil scratch cards (`.scr canvas`) revealing private ceremony dates when rubbed.
  5. Interactive Varmala Ceremony: Guests drag/tap rose flower badges along a bezier curve (`bx(t)`, `by(t)`) to weave the sacred wedding garland, triggering firecracker bursts.
- **Tokens & Fonts**:
  - Blush Peach Paper (`#f4d6cc`), Warm Cream (`#fff6ea`), Plum Wine (`#a24a6a`), Sage Green (`#9cb591`).
  - Fonts: `Great Vibes` (cursive script), `Baloo 2` (modern Indian headline sans), `Cormorant Garamond`.
- **Audio**: `Mangal Rang (Ramayana)` (`/audio/mangal-rang.mp3`).

---

#### Template 05: Arun & Meenakshi — Traditional South Indian (`tpl-wedding-south-indian-05`)
- **Host Route**: `src/app/template-05/page.jsx` (Iframe embed)
- **Source File**: `public/template-05.html` (53 KB standalone web application)
- **Technology Stack**: HTML5, CSS3 animations, Canvas Atchathai particle physics, Vanilla JavaScript.
- **Key Features & Interactions**:
  1. Wax Seal Gate: Realistic wax seal stamp with fracture animation upon opening.
  2. Canvas Atchathai Shower: Continuous falling yellow turmeric rice grains and red flower petals showering over the couple's portrait.
  3. Traditional Arch Card: Folded silk card with temple green borders and Tamil script annotations.
- **Tokens & Fonts**:
  - Raw Silk Cream (`#faf5e8`), Temple Maroon (`#6b1030`), Sacred Green (`#0e4a30`), Gold (`#b08a3e`).
  - Fonts: `Pinyon Script`, `Jost`, `Cormorant Garamond`, `Noto Sans Tamil`.
- **Audio**: `Traditional Nadaswaram & Thavil Mangala Isai` (`/audio/south-indian-nadaswaram.mp3`).

---

#### Template 06: Golden Birthday Surprise (`tpl-birthday-celebration-01`)
- **Host Route**: `src/app/birthday/page.jsx`
- **Technology Stack**: React 19, Framer Motion, HTML5 Audio, Canvas Confetti.
- **Features**: Interactive 3D cake with blowable/tappable candles, confetti cannons, floating balloons, polaroid photo memories gallery.
- **Tokens & Fonts**: Warm Peach Cream (`#FFF3EE`), Gold (`#EAB308`), Birthday Pink (`#EC4899`). Fonts: `Playfair Display`, `Inter`.

---

#### Template 07: Will You Be My Valentine? (`tpl-valentine-love-01`)
- **Host Route**: `src/app/valentine/page.jsx`
- **Technology Stack**: React 19, Framer Motion, CSS Petal Shower.
- **Features**: Unfolding wax-sealed love letter, interactive proposal with evasive "No" button that dodges the cursor, blooming "Yes" button with heart fireworks and falling rose petals.
- **Tokens & Fonts**: Soft Blush Pink (`#FFF4F0`), Romantic Crimson (`#BE123C`). Fonts: `Playfair Display`, `Dancing Script`.

---

#### Template 08: Our Romantic Date Planner (`tpl-date-planner-01`)
- **Host Route**: `src/app/date-planner/page.jsx`
- **Technology Stack**: React 19, Lucide Icons, LocalStorage State.
- **Features**: Interactive date itinerary builder with mood selection cards, time capsule message box, and custom date invitation card generator.
- **Tokens & Fonts**: Warm Cream (`#FFF8F5`), Wine (`#9F1239`), Gold (`#D97706`). Fonts: `Playfair Display`, `Inter`.
