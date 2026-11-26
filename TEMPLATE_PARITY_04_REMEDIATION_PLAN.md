# TEMPLATE_PARITY_04_REMEDIATION_PLAN
## Actionable Mobile Rendering Parity Strategy & Implementation Plan

### 1. Architectural Guardrails (Non-Negotiable Constraints)
In strict compliance with user instructions:
1. **Preserve Website Renderer**: Zero modifications to website Next.js templates or `public/template-*.html`.
2. **Mobile JavaScript Only**: All mobile code remains strictly pure JavaScript (`.js`, `.jsx`). No TypeScript.
3. **No WebView Shortcuts**: Mobile templates must render as first-class, performant native React Native components—never wrapping the mobile app in a full-screen WebView.
4. **Preserve Customer Customization & Data Flow**: Keep the shared backend, PostgreSQL schema, draft saving, publication checkout, and pricing logic intact.
5. **No Production Modifications During Audit**: Present root causes and remediation plan first; implement only after user approval.

---

### 2. Strategic Solution: Template-Aware Modular Native Rendering Architecture

Rather than forcing all 8 celebration templates into a single rigid 6-slide component with hardcoded navy assets, mobile will adopt a **Modular Template Adapter Architecture**:

```text
you-are-mine-mobile/components/templates/
├── common/
│   ├── FloatingMusicControl.jsx
│   ├── SlideIndicatorBar.jsx
│   └── TemplateHeaderPill.jsx
├── engines/
│   ├── NavyRoyalEngine.jsx          (Template 01: Aarav & Riya)
│   ├── LakePalaceHeritageEngine.jsx (Template 02: Arjun & Sia)
│   ├── TempleHeritageEngine.jsx     (Template 03: Thirumanam)
│   ├── UdaipurPaperPalaceEngine.jsx (Template 04: Tara & Kabir)
│   ├── SouthIndianTraditionEngine.jsx (Template 05: Arun & Meenakshi)
│   ├── BirthdayCelebrationEngine.jsx (Template 06: Golden Birthday Surprise)
│   ├── ValentineLoveEngine.jsx      (Template 07: Will You Be My Valentine)
│   └── DatePlannerEngine.jsx        (Template 08: Romantic Date Planner)
└── TemplateRendererRouter.jsx        <-- Dynamically routes template ID to its native engine
```

---

### 3. Phased Implementation Roadmap

#### Phase 1: Foundation & Typography Integration
1. **Font Asset Registration**:
   - Install/bundle the missing signature Google fonts for mobile:
     - `Great Vibes` (for Template 04 Udaipur cursive)
     - `Baloo 2` (for Template 04 headlines)
     - `Noto Serif Tamil` (for Template 03 Thirumanam)
     - `Cinzel Decorative` (for Template 03 / Royal headings)
     - `Pinyon Script` (for Template 05 Traditional signatures)
     - `Cormorant Garamond` (classic serif)
   - Load fonts in `you-are-mine-mobile/app/_layout.jsx` with splash screen gate.

2. **Template Design Tokens**:
   - Create `constants/templateThemes.js` storing canonical color palettes, border radii, font pairings, and background colors for all 8 templates.

---

#### Phase 2: Template 04 (Udaipur Paper Palace) Parity Remediation (P0)
*Addresses the direct issue reported in user screenshot `media_1795690361919_523af363.png`.*
1. **Paper Arch View Hierarchy**:
   - Construct `UdaipurPaperPalaceEngine.jsx` using:
     - Background: Blush peach desk (`#f4d6cc`)
     - Triple concentric rounded arches (`.a1` peach `#f4cba9`, `.a2` pink `#eaa9b8`, `.a3` cream `#fff6e3`).
     - Real cursive calligraphy in `Great Vibes` ("Tara & Kabir", "You are Cordially Invited").
     - Metadata in `Baloo 2` uppercase tracking.
2. **3D Rotating Double Doors**:
   - Build native 3D door rotation component in `UdaipurDoors.jsx` using React Native `Animated`:
     - Left door: `transform: [{ perspective: 1000 }, { rotateY: leftDoorAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-115deg'] }) }]`
     - Right door: `transform: [{ perspective: 1000 }, { rotateY: rightDoorAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '115deg'] }) }]`
     - Brass knocker rings and arch header plate.
3. **Palace Paper Pop-up & Event Badges**:
   - Render multi-tier paper craft illustrations and event cards styled in soft pastel tones.

---

#### Phase 3: Templates 02, 03 & 05 Parity Remediation (P1)
1. **Template 02 (Lake Palace Heritage)**:
   - Green forest palette (`#22332a`), golden lotus rangoli center emblem, sliding brass doors, marigold particle overlay, and 8 dedicated chapter slides.
2. **Template 03 (Temple Thirumanam)**:
   - Deep emerald silk night (`#06201a`), crimson temple accents, sacred Gopuram arch doors, authentic Tamil shlokas, and Nadaswaram audio.
3. **Template 05 (South Indian Tradition)**:
   - Silk cream (`#faf5e8`) and temple maroon (`#6b1030`), wax seal breaking opening effect, and Atchathai rice shower.

---

#### Phase 4: Birthday, Valentine & Date Planner Parity Remediation (P1)
1. **Birthday Celebration**:
   - Peach cream palette, interactive 3D cake component with tap/blow candle flame extinguishing, confetti particle burst, and polaroid photo gallery.
2. **Valentine / Proposal**:
   - Wax seal love letter unfolding animation, interactive "Will You Be My Valentine?" with playful evasive "No" button and blooming "Yes" button with falling rose petals.
3. **Date Planner**:
   - Interactive date itinerary selector with activity category cards and customizable schedule.

---

#### Phase 5: Verification & Regression Testing
1. Side-by-side visual parity checks against Next.js website reference at 390px (iPhone) and 412px (Android) viewports.
2. Verify audio playback across all templates with zero unhandled rejections.
3. Verify Draft saving, Editor manipulation, and Publication Checkout flows work seamlessly with new template engines.
4. Verify codebase remains 100% pure JavaScript with zero build warnings.
