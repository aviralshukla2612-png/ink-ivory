# MILESTONE 9 — ADVANCED INVITATION CUSTOMIZATION & EDITOR ARCHITECTURE

**Document Version:** 1.0.0  
**Status:** Certified & Active  
**Milestone:** 9 (Feature Expansion — Zero Regression)  
**System Architecture:** Unified Cross-Platform Editor (Web & React Native Mobile)

---

## 1. Executive Summary & Design Philosophy

The *YOU ARE MINE* Advanced Invitation Editor delivers fine-grained creative control over royal digital stationery while strictly upholding visual luxury and preventing layout corruption. Rather than exposing an unconstrained canvas that leads to illegible or chaotic designs, the system provides high-precision **stepped controls**, **layer management**, **safe-area boundaries**, and **template-default reset actions**.

Every element modification is stored in the canonical shared schema (`CustomContent` and `EditorElement`) ensuring 100% interoperability between the Web client (Next.js 15) and Mobile client (React Native / Expo 58).

---

## 2. Advanced Typography Engine

### 2.1 Font Families & Render Stack
The editor supports curated luxury typographic pairings configured per template:
- **Royal Serif (`serif`):** Cormorant Garamond / Playfair Display. Used for sacred couple names, blessings, and formal event titles.
- **Modern Sans (`sans-serif`):** Inter / Montserrat. Used for dates, times, RSVP instructions, and venue addresses ensuring crisp mobile readability.
- **Romantic Script (`script`):** Great Vibes / Alex Brush italic flair. Used for taglines ("The Wedding Celebration", "Save the Date", "Together with our families").

### 2.2 Letter Spacing & Weight Steppers
- **Font Weight Tokens:**
  - `400` (Regular) — Body paragraphs and secondary details.
  - `600` (Medium) — Subtitles, ceremony names, venue highlights.
  - `700` (Bold) — Sacred couple names, numerals, and key announcements.
- **Letter Spacing Tokens:**
  - `Tight (-0.5px)` — Condensed titling for long Indian names.
  - `Normal (0px)` — Default balanced kerning.
  - `Relaxed (+1.5px)` — Elevated luxury elegance for subheadings.
  - `Wide (+3.0px)` — High-fashion royal uppercase monograms and taglines.

---

## 3. Element Layering & Visual Alignment

### 3.1 Z-Index & Layer Ordering
Elements are rendered in an explicit stack order. Users can reorder overlapping layers with one-tap tactile actions:
- **`Bring Forward (⬆)`:** Increases the element's numerical `zIndex` by 1 and shifts its index in the display stack.
- **`Send Backward (⬇)`:** Decreases `zIndex` down to minimum floor 1, preventing elements from slipping behind the background artwork.
- Native React Native PanResponder integrates with `zIndex` and elevation styles so dragging respects the active layer hierarchy.

### 3.2 Visual Alignment Guides
When any text or image element is selected or actively dragged:
- **Center Vertical Guide Line:** An SVG dashed champagne gold line (`stroke="rgba(216, 183, 123, 0.35)"`, `strokeDasharray="3,3"`) dynamically renders down the canvas axis (`x = CANVAS_LOGICAL_WIDTH / 2`).
- **Safe-Area Boundaries:** Hard drag boundaries enforce `newX ∈ [-120, 120]` and `newY ∈ [80, CANVAS_LOGICAL_HEIGHT - 60]`, ensuring no element can ever be dragged off-screen or obscure the royal temple arch or base floral garlands.

### 3.3 Default Restoration
- **Reset Element:** Reverts position `(x, y)`, `fontSize`, `fontFamily`, `color`, `letterSpacing`, `fontWeight`, and `zIndex` of the active element back to the original template authoring specification without altering other elements.
- **Reset Canvas:** Restores all elements simultaneously to factory template defaults with confirmation protection.

---

## 4. Color Palette Curation

The color engine enforces royal harmony by restricting choices to vetted metallic and luxury tones:
| Color Token | Hex Code | Purpose |
|---|---|---|
| Deep Burgundy | `#741E32` | Classic royal ink for bridal announcements |
| Champagne Gold | `#D8B77B` | Metallic accents, borders, and monograms |
| Dark Charcoal | `#45291F` | High-contrast readable body text |
| Muted Gold | `#B99762` | Subtle secondary dates and venue coordinates |
| Classic Black | `#1A1412` | Traditional formal wedding print style |
| Soft Blush | `#C48A80` | Romantic pastel highlights for haldi/mehendi |

---

## 5. State Management & Undo/Redo Integrity

### 5.1 Dual-Stack History Machine
The Zustand editor store (`editor.store.js`) maintains two state arrays:
- `undoStack`: Snapshots pushed before mutating operations (`updateElementPosition`, `updateElementStyle`, `reorderElementLayer`, `resetElementToDefault`).
- `redoStack`: Cleared on new mutations; restored on `redo()`.
- Maximum stack depth is bounded at 20 snapshots to prevent mobile memory bloat.

### 5.2 Auto-Save & Draft Synchronization
- Real-time modifications trigger a debounced (1500ms) save to AsyncStorage / Backend Drafts.
- Drafts include `version: 2` metadata tags, allowing smooth hydration on either web or mobile clients.
