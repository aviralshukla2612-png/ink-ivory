# HYBRID STEP 3.01 — BIRTHDAY (GOLDEN BIRTHDAY SURPRISE) ANALYSIS

## 1. Website Renderer Architecture
- **Location:** `src/app/birthday/page.jsx` & `src/components/birthday/`
- **Underlying Technology:** Next.js 15 App Router, React DOM 19, Framer Motion (`AnimatePresence`), Canvas Confetti (`BirthdayConfetti.jsx`), Particle systems (`GoldenParticles.jsx`, `FloatingBalloons.jsx`).
- **Interactive Features:**
  - Interactive gift box unboxing (`BirthdayOpening.jsx`)
  - Audio playback synchronization
  - Memories photo gallery with lightbox
  - Interactive birthday wishes submission
- **Messaging Bridge:** Listens for `INK_IVORY_CUSTOM_UPDATE` (line 178) updating `recipientName`, `senderName`, `heading`, `message`, and `date`.

## 2. Current Mobile Implementation
- **Location:** Generic `InvitationCanvas.jsx` fallback or `RoyalMultiSlidePresentation.jsx` occasion branch.
- **Divergence:**
  - Missing dynamic physics for floating balloons and golden particle dust.
  - Lacks the multi-section vertical storytelling layout present on the web.
  - Cake lighting / gift opening micro-interactions absent in native React Native.

## 3. WebView Compatibility & Feasibility
- **Feasibility:** HIGH.
- **Framer Motion in WebView:** Fully supported in WebKit / Blink DOM. All CSS transforms, spring physics, and canvas particle loops run smoothly at 60 FPS.
- **Recommended Approach:** Package as a standalone HTML5 micro-app (`template-birthday.html`) or embed the pre-rendered Next.js client route within `SharedWebInvitationViewport`.
