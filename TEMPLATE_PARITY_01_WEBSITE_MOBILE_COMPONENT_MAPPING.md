# TEMPLATE_PARITY_01_WEBSITE_MOBILE_COMPONENT_MAPPING
## Complete Component, Asset, and Token Mapping Across Web and Mobile

### 1. Template-by-Template Architectural Mapping

---

#### 1. Template 01: Aarav & Riya — The Royal Navy Wedding
- **Template ID**: `tpl-wedding-navy-01`
- **Occasion**: Wedding / Engagement
- **Website Implementation**:
  - **Route**: `src/app/template-01/page.tsx`
  - **Components**: `src/components/template01/`
    - `intro/IntroGateway.tsx` (Sliding Royal Arch Curtain)
    - `presentation/WelcomeSection.tsx`
    - `presentation/SaveTheDateSection.tsx`
    - `presentation/EventsOverviewSection.tsx`
    - `presentation/HaldiSection.tsx`
    - `presentation/MehendiSection.tsx`
    - `presentation/WeddingSection.tsx`
    - `presentation/ReceptionSection.tsx`
    - `presentation/FamilyBlessingsSection.tsx`
    - `presentation/VenueLocationSection.tsx`
    - `presentation/RSVPSection.tsx`
  - **Design Tokens**:
    - Primary Color: `#121E35` (Royal Navy)
    - Accent Gold: `#D7B875`
    - Text Color: `#EDE2CF`
    - Font Family: `Cormorant Garamond`, `Cinzel`, `Playfair Display`
  - **Audio**: `Aaj Sajeya — Goldie Sohel` (`/audio/aaj-sajeya.mp3`)
- **Mobile Implementation**:
  - **Route**: `you-are-mine-mobile/app/preview/[id].jsx`
  - **Components**:
    - `components/preview/GrandEntranceGate.jsx` (Royal Double Doors)
    - `components/preview/RoyalMultiSlidePresentation.jsx` (Slides 1–6)
    - `components/preview/CeremonyTimelineSection.jsx`
    - `components/preview/RSVPPreviewSection.jsx`
    - `components/preview/FloatingAudioPlayer.jsx`
  - **Assets**: `assets/template01/04_welcome_intro.png`, `06_save_the_date.png`, `07_wedding_events_overview.png`, `13_family_blessings.png`, `14_venue_location.png`, `15_closing_thank_you.png`
- **Mapping Alignment**: **90% Structural Alignment** (Baseline template).

---

#### 2. Template 02: Arjun & Sia — Royal Lake Palace Heritage
- **Template ID**: `tpl-anniversary-gold-02`
- **Occasion**: Wedding / Anniversary / Story
- **Website Implementation**:
  - **Route**: `src/app/template-02/page.jsx`
  - **Iframe Source**: `public/template-02.html` (85 KB standalone web application)
  - **Core Web Sections & Features**:
    - `#intro`: Dual sliding forest green doors with brass knocker rings (`.door.l`, `.door.r`)
    - `#sec-welcome`: Blooming Golden Lotus Rangoli and floating diya animations
    - `#sec-save`: Save the date with live countdown
    - `#sec-story`: "How We Met" chapter with photo memories
    - `#sec-events`: Traditional 5-event timeline (Ganesh Puja, Haldi, Sangeet, Muhurtham, Reception)
    - `#sec-venue`: Rambagh Palace Udaipur map embed & directions
    - `#sec-rsvp`: WhatsApp & direct RSVP modal
  - **Design Tokens**:
    - Primary Color: `#22332a` (Forest Green), `#10302a`
    - Accent Colors: `#d9a441` (Marigold Gold), `#f0a020`, `#7b1d36` (Royal Crimson)
    - Paper Background: `#f8f2e2`, `#fbf6e8`
    - Font Family: `Playfair Display`, `Cormorant Garamond`, `Karla`
  - **Audio**: `Kudmayi (Film Version) — Shahid Mallya, Pritam` (`/audio/kudmayi.mp3`)
- **Mobile Implementation**:
  - **Route**: `you-are-mine-mobile/app/preview/[id].jsx`
  - **Component**: `RoyalMultiSlidePresentation.jsx` (conditional `category.isLakePalace`)
  - **Discrepancy in Mobile**:
    - Only Slide 1 uses `assets/showcase/arjun-sia.jpg`.
    - Slides 2 through 6 fall back to `assets/template01/*.png` (Navy arch images!).
    - Missing sliding brass door animation, floating marigold particles, and forest green palette.
- **Mapping Alignment**: **25% Visual Alignment** (Severe Discrepancy).

---

#### 3. Template 03: Thirumanam — South Indian Temple Wedding
- **Template ID**: `tpl-wedding-temple-03`
- **Occasion**: South Indian Temple Wedding
- **Website Implementation**:
  - **Route**: `src/app/template-03/page.jsx`
  - **Iframe Source**: `public/template-03.html` (57 KB standalone web application)
  - **Core Web Sections & Features**:
    - `#loader`: Sacred temple aura with Tamil blessing invocation
    - `#hero`: Temple Gopuram arch with hanging brass bells and Kolam floor patterns
    - `#muhurtham`: Sacred Muhurtham timing with auspicious Nakshatram and Lagnam
    - `#ceremonies`: Vratham, Janavasam, Kasi Yatra, Oonjal, Kanyadaanam, Mangalya Dharanam, Saptapadi
    - `#family`: Traditional Tamil Kula Deivam and maternal/paternal family tree
    - `#mandap`: Madurai Meenakshi Amman Temple / Temple Mandap directions
  - **Design Tokens**:
    - Primary Colors: `#06201a` (Emerald Silk Night), `#6a0d20` (Crimson)
    - Accent Brass: `#d9a521`, `#f7de8a`
    - Cream Canvas: `#fbf5e6`
    - Font Family: `Cinzel Decorative`, `Noto Serif Tamil`, `Cormorant Garamond`
  - **Audio**: `Mast Magan / Nadaswaram Mangala Vathiyam` (`/audio/mast-magan.mp3`)
- **Mobile Implementation**:
  - **Route**: `you-are-mine-mobile/app/preview/[id].jsx`
  - **Component**: `RoyalMultiSlidePresentation.jsx` (conditional `category.isTempleWedding`)
  - **Discrepancy in Mobile**:
    - Uses `assets/showcase/thirumanam.jpg` on slides 1–3, falls back to Template 01 Navy arch on slides 4–6.
    - Missing Noto Serif Tamil typography, temple bell chimes, Kolam borders, and sacred emerald-crimson silk styling.
- **Mapping Alignment**: **30% Visual Alignment** (Severe Discrepancy).

---

#### 4. Template 04: Tara & Kabir — The Grand Udaipur Palace
- **Template ID**: `tpl-wedding-paper-palace-04`
- **Occasion**: Royal Palace Wedding / Paper Craft Bespoke
- **Website Implementation**:
  - **Route**: `src/app/template-04/page.jsx`
  - **Iframe Source**: `public/template-04.html` (424 KB standalone web application)
  - **Core Web Sections & Features**:
    - `#gate`: 3D rotating double doors (`.dr.l`, `.dr.r` with `transform: rotateY(-115deg)`)
    - `#arch`: Three concentric arch cutouts (`.a1`, `.a2`, `.a3`) creating physical depth
    - `#palace-board`: Pop-up paper craft palace illustration layers
    - `#scratch-card`: Interactive canvas scratch-off reveal cards for private events
    - `#varmala`: Interactive garland stringing gesture
    - `#itinerary`: 5 royal celebrations with hand-drawn paper botanical badges
  - **Design Tokens**:
    - Background: `#f4d6cc` (Blush Peach Paper), `#fff6ea`
    - Text / Accent: `#a24a6a` (Plum Wine), `#5a3a3a` (Deep Ink)
    - Secondary Accents: `#9cb591` (Sage Green), `#f4cba9` (Peach)
    - Font Family: `Great Vibes` (cursive script), `Baloo 2`, `Cormorant Garamond`
  - **Audio**: `Mangal Rang (Ramayana)` (`/audio/mangal-rang.mp3`)
- **Mobile Implementation**:
  - **Route**: `you-are-mine-mobile/app/preview/[id].jsx`
  - **Component**: `RoyalMultiSlidePresentation.jsx`
  - **Discrepancy in Mobile**:
    - **Observed in User Screenshot**: Renders navy blue archway with gold serif text and Ganesh shloka, completely ignoring the blush peach paper aesthetic, Great Vibes cursive typography, 3D rotating doors, and pop-up palace.
- **Mapping Alignment**: **10% Visual Alignment** (Critical Divergence).

---

#### 5. Template 05: Arun & Meenakshi — Traditional South Indian
- **Template ID**: `tpl-wedding-south-indian-05`
- **Occasion**: Traditional South Indian Wedding
- **Website Implementation**:
  - **Route**: `src/app/template-05/page.jsx`
  - **Iframe Source**: `public/template-05.html` (53 KB standalone web application)
  - **Core Web Sections & Features**:
    - `#wax-seal`: Interactive wax seal gate breaking animation
    - `#atchathai`: Canvas particle system showering yellow turmeric rice and flower petals
    - `#ceremonies`: Traditional South Indian rituals with Tamil script annotations
    - `#wedding-card`: Classic folded invitation card with deep maroon borders
  - **Design Tokens**:
    - Background: `#faf5e8` (Raw Silk Cream), `#f6ede0`
    - Primary Ink: `#6b1030` (Temple Maroon)
    - Gold: `#b08a3e`
    - Green: `#0e4a30`
    - Font Family: `Pinyon Script`, `Jost`, `Cormorant Garamond`, `Noto Sans Tamil`
  - **Audio**: `Traditional Nadaswaram & Thavil Mangala Isai` (`/audio/south-indian-nadaswaram.mp3`)
- **Mobile Implementation**:
  - **Route**: `you-are-mine-mobile/app/preview/[id].jsx`
  - **Component**: `RoyalMultiSlidePresentation.jsx`
  - **Discrepancy in Mobile**:
    - Completely missing maroon/cream silk theme, wax seal break, atchathai shower, and Tamil script support.
- **Mapping Alignment**: **15% Visual Alignment** (Critical Divergence).

---

#### 6. Template 06: Golden Birthday Surprise
- **Template ID**: `tpl-birthday-celebration-01`
- **Occasion**: Birthday
- **Website Implementation**:
  - **Route**: `src/app/birthday/page.jsx`
  - **Components**: `src/components/birthday/`
    - `CakeCelebration.tsx` (Interactive candle blow-out with audio microphone/touch trigger)
    - `ConfettiBurst.tsx`
    - `PolaroidGallery.tsx`
    - `PartyTimeline.tsx`
  - **Design Tokens**:
    - Background: `#FFF3EE` (Warm Peach Cream), `#FFE4D6`
    - Accent Colors: `#EAB308` (Gold), `#EC4899` (Birthday Pink)
    - Font Family: `Playfair Display`, `Inter`
  - **Audio**: `Happy Birthday Jazz Celebration` (`/audio/birthday-jazz.mp3`)
- **Mobile Implementation**:
  - **Route**: `you-are-mine-mobile/app/preview/[id].jsx`
  - **Component**: `RoyalMultiSlidePresentation.jsx` (`category.isBirthday`)
  - **Discrepancy in Mobile**:
    - Replaces interactive cake and blowing candles with static text slides and `assets/showcase/birthday.jpg`.
- **Mapping Alignment**: **40% Visual Alignment** (Functional Gap).

---

#### 7. Template 07: Will You Be My Valentine?
- **Template ID**: `tpl-valentine-love-01`
- **Occasion**: Valentine / Proposal
- **Website Implementation**:
  - **Route**: `src/app/valentine/page.jsx`
  - **Components**: `src/components/valentine/`
    - `LoveLetterEnvelope.tsx` (Sealed envelope unfolds into handwritten letter)
    - `ProposalInteraction.tsx` (Interactive evasive NO button + expanding blooming YES button)
    - `PetalShower.tsx` (Falling red and pink rose petals)
  - **Design Tokens**:
    - Background: `#FFF4F0` (Soft Blush Rose)
    - Primary Accent: `#BE123C` (Romantic Crimson)
    - Font Family: `Playfair Display`, `Dancing Script`, `Inter`
  - **Audio**: `Romantic Acoustic Guitar & Piano Melody` (`/audio/valentine-acoustic.mp3`)
- **Mobile Implementation**:
  - **Route**: `you-are-mine-mobile/app/preview/[id].jsx`
  - **Component**: `RoyalMultiSlidePresentation.jsx` (`category.isValentine`)
  - **Discrepancy in Mobile**:
    - Text-only question slide without evasive button physics, unfolding love letter, or falling petals.
- **Mapping Alignment**: **40% Visual Alignment** (Functional Gap).

---

#### 8. Template 08: Our Romantic Date Planner
- **Template ID**: `tpl-date-planner-01`
- **Occasion**: Date Night / Romantic Experience
- **Website Implementation**:
  - **Route**: `src/app/date-planner/page.jsx`
  - **Components**: `src/components/date-planner/`
    - `ActivityChooser.tsx` (Interactive multi-step date itinerary cards)
    - `TimeCapsuleModal.tsx`
    - `InvitationCardExport.tsx`
  - **Design Tokens**:
    - Background: `#FFF8F5`, `#FFEFEA`
    - Accent Colors: `#9F1239`, `#D97706`
    - Font Family: `Playfair Display`, `Inter`
- **Mobile Implementation**:
  - **Route**: `you-are-mine-mobile/app/preview/[id].jsx`
  - **Component**: Currently treated as a fallback under `category.isValentine`.
  - **Discrepancy in Mobile**:
    - Lacks activity chooser steps and date itinerary interactive cards.
- **Mapping Alignment**: **20% Visual Alignment** (Severe Discrepancy).
