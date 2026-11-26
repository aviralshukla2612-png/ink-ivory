# HYBRID STEP 3.02 — VALENTINE (SEALED LOVE LETTER) ANALYSIS

## 1. Website Renderer Architecture
- **Location:** `src/app/valentine/page.jsx` & `src/components/valentine/`
- **Underlying Technology:** Next.js 15 App Router, React DOM 19, Framer Motion, HTML5 Audio, Canvas particle systems (`HeartParticles.jsx`, `RosePetals.jsx`).
- **Interactive Features:**
  - 3D Envelope folding and unfolding (`OpeningExperience.jsx`)
  - "Will You Be My Valentine?" proposal trigger with heart explosion physics (`ProposalSection.jsx`, `YesCelebration.jsx`)
  - Sealed romantic love letter parchment (`LoveLetter.jsx`)
  - Memory photo collage (`MemoryGallery.jsx`)
- **Messaging Bridge:** Built-in `postMessage` listener for `INK_IVORY_CUSTOM_UPDATE` (line 120).

## 2. Current Mobile Implementation
- **Location:** Generic canvas fallback.
- **Divergence:**
  - Envelope 3D flap-fold animation completely missing in mobile.
  - Heart particle explosion on "Yes!" tap unavailable.
  - Parchment texture and romantic cursive typography diverge from website.

## 3. WebView Compatibility & Feasibility
- **Feasibility:** HIGH.
- **3D Transforms & Particle Physics:** WebKit handles CSS `preserve-3d`, `rotateX` envelope flaps, and Canvas 2D heart bursts natively.
- **Recommended Approach:** Export into an offline bundle (`template-valentine.html`) with embedded romantic cursive fonts (`Great Vibes` / `Playfair Display`).
