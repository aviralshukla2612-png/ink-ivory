# TEMPLATE_PARITY_02_VISUAL_DISCREPANCY_REGISTER
## Itemized Defect Register: Website vs. Mobile Rendering Discrepancies

### 1. Overview
This register catalogs all visual, layout, typographic, decorative, and interactive discrepancies identified between the website and mobile applications across all 8 celebration templates.

---

### 2. Discrepancy Register by Category

#### CATEGORY A: Typography & Font Discrepancies

##### DISCREPANCY A-01: Template 04 Udaipur Script Typography Failure
- **Template ID**: `tpl-wedding-paper-palace-04`
- **Website Component**: `public/template-04.html` (`.sc { font-family: 'Great Vibes', cursive }`)
- **Mobile Component**: `components/preview/RoyalMultiSlidePresentation.jsx` (`styles.serifHeadingGold`)
- **Expected Appearance**: Elegant flowing cursive calligraphy ("Tara & Kabir", "Cordially Invited") using `Great Vibes` and clean headline typography using `Baloo 2`.
- **Actual Appearance**: Monolithic gold serif typography (`fontFamily: 'serif'`, uppercase tracked letters) resembling Template 01, completely losing the bespoke paper-craft calligraphy.
- **Root Cause**: Mobile does not load or bundle `Great Vibes` or `Baloo 2` fonts; `RoyalMultiSlidePresentation.jsx` hardcodes `serif` styles.
- **Severity**: **CRITICAL (P0)**
- **Recommended Fix**: Add `@expo-google-fonts/great-vibes` and `@expo-google-fonts/baloo-2` (or load through `expo-font`), bind them to template-specific theme styles.

##### DISCREPANCY A-02: Template 03 Thirumanam Tamil Script Rendering
- **Template ID**: `tpl-wedding-temple-03`
- **Website Component**: `public/template-03.html` (`font-family: 'Noto Serif Tamil'`)
- **Mobile Component**: `components/preview/RoyalMultiSlidePresentation.jsx`
- **Expected Appearance**: Authentic Tamil typography (`ஸ்ரீ கணேசாய நமஹ`, `திருமணம்`) rendered in refined `Noto Serif Tamil` and regal headings in `Cinzel Decorative`.
- **Actual Appearance**: Fallback system sans-serif or basic serif; broken Tamil glyph rendering on some Android devices.
- **Root Cause**: `Noto Serif Tamil` and `Cinzel Decorative` are not configured in Expo font loader.
- **Severity**: **HIGH (P1)**
- **Recommended Fix**: Load `NotoSerifTamil_500Medium` and `CinzelDecorative_700Bold` in `_layout.jsx`.

##### DISCREPANCY A-03: Template 05 Traditional Script & Serif Hierarchy
- **Template ID**: `tpl-wedding-south-indian-05`
- **Website Component**: `public/template-05.html` (`.script { font-family: 'Pinyon Script' }`, `Jost`)
- **Mobile Component**: `components/preview/RoyalMultiSlidePresentation.jsx`
- **Expected Appearance**: Flowing English cursive signature in `Pinyon Script` and modern geometric metadata in `Jost`.
- **Actual Appearance**: Default system serif headers; missing all script flourishes.
- **Root Cause**: Fonts omitted in React Native mobile client.
- **Severity**: **HIGH (P1)**
- **Recommended Fix**: Add `PinyonScript` and `Jost` to Expo font assets.

---

#### CATEGORY B: Layout, Dimensions & Framing Discrepancies

##### DISCREPANCY B-01: Template 04 Multi-Arch Cutout vs. Flat Viewport
- **Template ID**: `tpl-wedding-paper-palace-04`
- **Website Component**: `public/template-04.html` (`.a1`, `.a2`, `.a3` concentric rounded arch frames)
- **Mobile Component**: `components/preview/RoyalMultiSlidePresentation.jsx` (`styles.slideCard`)
- **Expected Appearance**: Triple concentric nested paper arches with peach/pink borders and soft box shadows creating depth like a physical paper cutout.
- **Actual Appearance**: Flat single card with dark navy vignette overlay (`styles.darkVignette`).
- **Root Cause**: Mobile renders a generic full-bleed image card rather than nested arch views.
- **Severity**: **CRITICAL (P0)**
- **Recommended Fix**: Implement a dedicated `PaperArchContainer` native view component for Template 04 with concentric bordered arch views (`borderRadius: [240, 240, 0, 0]`).

##### DISCREPANCY B-02: Template 02 Golden Lotus Rangoli Layout
- **Template ID**: `tpl-anniversary-gold-02`
- **Website Component**: `public/template-02.html` (`#sec-welcome`, `#introCv`)
- **Mobile Component**: `components/preview/RoyalMultiSlidePresentation.jsx`
- **Expected Appearance**: Centered blooming lotus rangoli with radial gradient green doors and floating golden diya reflections on water.
- **Actual Appearance**: Slide 1 displays a static rectangular image crop of `arjun-sia.jpg` with a navy text overlay.
- **Root Cause**: Mobile slide layout does not recreate the circular lotus emblem or the dark forest green background canvas.
- **Severity**: **HIGH (P1)**
- **Recommended Fix**: Create native `LotusRangoliHero` component for Template 02.

---

#### CATEGORY C: Images, Textures & Background Color Divergence

##### DISCREPANCY C-01: False Navy Assets in Template 04 (Shown in User Screenshot)
- **Template ID**: `tpl-wedding-paper-palace-04`
- **Website Component**: `public/template-04.html` (`--desk: #f4d6cc; --bg: #fff6ea; --paper: #fffaf1`)
- **Mobile Component**: `components/preview/RoyalMultiSlidePresentation.jsx` (lines 261-318)
- **Expected Appearance**: Blush peach desk background (`#f4d6cc`), warm paper card (`#fffaf1`), plum text (`#a24a6a`), and sage accents (`#9cb591`).
- **Actual Appearance**: **Imperial Navy (`#121E35`) background, gold Ganesh shloka `॥ श्री गणेशाय नमः ॥`, and dark vignette**, as captured in user screenshot `media_1795690361919_523af363.png`.
- **Root Cause**: `RoyalMultiSlidePresentation.jsx` fell back to `assets/template01/04_welcome_intro.png` and Template 01 text overlays because it lacked template-aware background styles and theme resolution.
- **Severity**: **CRITICAL (P0)**
- **Recommended Fix**: Implement template-specific color tokens and paper background assets in mobile preview.

##### DISCREPANCY C-02: Slide 2–6 Falling Back to Template 01 Navy Assets Across ALL Templates
- **Template ID**: `tpl-anniversary-gold-02`, `tpl-wedding-temple-03`, `tpl-wedding-paper-palace-04`, `tpl-wedding-south-indian-05`
- **Website Component**: Respective HTML / CSS styling for all 8 chapters
- **Mobile Component**: `RoyalMultiSlidePresentation.jsx` (lines 275-318)
- **Expected Appearance**: Consistent template-specific backgrounds across all itinerary, venue, and blessing slides.
- **Actual Appearance**: Slide 1 may show a template card, but Slides 2–6 abruptly switch to Template 01's navy arch drawings (`06_save_the_date.png`, `07_wedding_events_overview.png`, etc.).
- **Root Cause**: Hardcoded asset fallback in `RoyalMultiSlidePresentation.jsx`.
- **Severity**: **CRITICAL (P0)**
- **Recommended Fix**: Define per-template 6-slide theme configurations with custom background gradients, cards, and borders.

---

#### CATEGORY D: Animations & Interactive Ceremonies

##### DISCREPANCY D-01: 3D Rotating Double Doors in Template 04
- **Template ID**: `tpl-wedding-paper-palace-04`
- **Website Component**: `public/template-04.html` (`.dr.l`, `.dr.r`, `transform: rotateY(-115deg)`)
- **Mobile Component**: `GrandEntranceGate.jsx`
- **Expected Appearance**: Double doors swing outwards on a 3D perspective Y-axis hinge with brass ring knockers moving in 3D perspective.
- **Actual Appearance**: 2D horizontal sliding gates (`translateX`) with flat gold filigree doors.
- **Root Cause**: Mobile `GrandEntranceGate.jsx` only performs 2D sliding translation, not 3D Y-axis rotation.
- **Severity**: **HIGH (P1)**
- **Recommended Fix**: Implement 3D perspective door rotation using React Native `Animated` with `perspective: 1000` and `rotateY` transforms.

##### DISCREPANCY D-02: Missing Interactive Scratch-Off Reveal & Varmala Stringing
- **Template ID**: `tpl-wedding-paper-palace-04`
- **Website Component**: `public/template-04.html` (`#scratch-card`, `#varmala`)
- **Mobile Component**: Omitted entirely in mobile.
- **Expected Appearance**: Guests can scratch off a gold card to reveal private after-party details and drag a rose garland over the couple to complete the Varmala ceremony.
- **Actual Appearance**: Static event text list.
- **Root Cause**: Omitted from mobile implementation.
- **Severity**: **MEDIUM (P2)**
- **Recommended Fix**: Add a native touch-reveal card and interactive garland gesture component in mobile editor and preview.

##### DISCREPANCY D-03: Missing Wax Seal Breaking & Atchathai Shower in Template 05
- **Template ID**: `tpl-wedding-south-indian-05`
- **Website Component**: `public/template-05.html` (`#wax-seal`, `#atchathai`)
- **Mobile Component**: Omitted entirely in mobile.
- **Expected Appearance**: Physical wax seal breaks with crack animation; yellow turmeric rice particles shower down over the invitation.
- **Actual Appearance**: Standard instant fade-in.
- **Root Cause**: Omitted from mobile implementation.
- **Severity**: **HIGH (P1)**
- **Recommended Fix**: Integrate native wax seal fracture animation and lightweight particle shower using `react-native-reanimated` or `Animated`.

##### DISCREPANCY D-04: Birthday Cake Candle Blowing & Confetti Burst
- **Template ID**: `tpl-birthday-celebration-01`
- **Website Component**: `src/components/birthday/CakeCelebration.tsx`, `ConfettiBurst.tsx`
- **Mobile Component**: `RoyalMultiSlidePresentation.jsx`
- **Expected Appearance**: Interactive cake where touching or blowing on the candle extinguishes flame, triggering cheer sound effect and colorful confetti blast.
- **Actual Appearance**: Static text card saying "Happy Birthday Dearest Ananya".
- **Root Cause**: Omitted from mobile slide deck.
- **Severity**: **HIGH (P1)**
- **Recommended Fix**: Add native `InteractiveBirthdayCake` component with tap-to-blow flame extinguishing and confetti explosion.

##### DISCREPANCY D-05: Valentine Evasive "No" Button & Love Letter Unfold
- **Template ID**: `tpl-valentine-love-01`
- **Website Component**: `src/components/valentine/ProposalInteraction.tsx`
- **Mobile Component**: `RoyalMultiSlidePresentation.jsx`
- **Expected Appearance**: Playful proposal screen where tapping "No" makes the button dodge away while "Yes" blossoms into hearts and rose petals.
- **Actual Appearance**: Plain text slide with a static WhatsApp button.
- **Root Cause**: Omitted from mobile slide deck.
- **Severity**: **HIGH (P1)**
- **Recommended Fix**: Add native `EvasiveProposalButtons` and `UnfoldingLoveLetter` components.
