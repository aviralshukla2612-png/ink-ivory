# MILESTONE 9 — INVITATION STORYTELLING & CHAPTER ARCHITECTURE

**Document Version:** 1.0.0  
**Status:** Certified & Active  
**Milestone:** 9 (Feature Expansion — Zero Regression)  
**System Architecture:** Configurable Template Sections & Reduced-Motion Storytelling Engine

---

## 1. Architectural Principles

Invitations on *YOU ARE MINE* are interactive narrative journeys rather than static greeting cards. A luxury celebration unfolds through a sequence of bespoke storytelling chapters:
1. **Interactive Opening Experience:** Wax-sealed envelope unsealing (`EnvelopeAnimation.jsx`) or royal temple gate opening (`GateOpening.jsx`).
2. **Sacred Welcome & Invocation:** Traditional verses (Ganesh Vandana, Tamil Mangala Sloka, or contemporary poetic blessings).
3. **Couple Narrative / Storyline:** Multi-chapter journey ("How We Met", "The First Spark", "The Journey Home", "The Promise").
4. **Ceremony Itinerary / Timeline:** Multi-event schedule with date, time, venue, and directions.
5. **Curated Melody / Soundtrack:** Auto-looping royal audio with interactive waveform trimmer.
6. **Family Blessings & RSVPs:** Interactive guest confirmation with dietary, plus-one, and loving wishes forms.

---

## 2. Section Visibility & Customization Matrix

Sections are fully configurable per template and user draft via `supportedSections` and `designConfig.enabledSections`:
| Section Key | Wedding | Birthday | Proposal | Date Planner | Default State |
|---|---|---|---|---|---|
| `opening` | Mandapam Gate / Wax Seal | 3D Candle Blow | Love Letter Envelope | Mystery Envelope | Enabled |
| `hero` | Royal Couple Portrait | Birthday Hero Title | Romantic Question | Venue Map Card | Enabled |
| `story` | 5-Chapter Love Story | Milestone Memory | Relationship Tale | Date Highlights | Optional |
| `events` | Multi-Function Timeline | Party Schedule | Celebration Dinner | Activity Stops | Enabled |
| `memories` | Heritage Photo Gallery | Polaroid Stream | Romantic Polaroids | Secret Moments | Optional |
| `music` | Soundtrack Player | Birthday Melody | Romantic Serenade | Acoustic Track | Enabled |
| `rsvp` | Guest RSVP Portal | Guest Wishes | Acceptance Response | Reservation Form | Enabled |

---

## 3. Motion & Accessibility Safeguards

- **Reduced Motion Support:** All chapter transitions check `AccessibilityInfo.isReduceMotionEnabled()`. When reduced motion is enabled, scale and 3D flip animations fall back to instantaneous or subtle linear opacity fades.
- **Zero WebView Fallbacks:** The native mobile client renders all story chapters through pure React Native primitives (`Animated`, `FlatList`, `View`, `Text`), completely bypassing webview performance bottlenecks and memory leaks.
