# MILESTONE 11 — PHASE 0: REPOSITORY BASELINE & IMPLEMENTATION PLAN

**Project:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Milestone:** 11 — Global Remediation, UI Refinement & Advanced Audio Trimmer  
**Baseline Git Commit:** `8c12e79`  
**Branch:** `main`  
**Date:** November 25, 2026  
**Status:** BASELINE VERIFIED & APPROVED  

---

## 1. Executive Summary

This document establishes the verified codebase baseline and detailed execution blueprints for the 5 core tasks of Milestone 11:
1. Mobile Bottom Tab Bar Text Clipping Remediation (DEF-912)
2. Portrait Template Cover Image Cropping Remediation (DEF-913)
3. Explore Header Brand Logo Transparency & Contrast (DEF-914)
4. Burgundy Envelope Foil Seal High-Luminance Contrast (DEF-915)
5. Advanced Instagram-Style Interactive Audio Trimmer (FEAT-AUDIO-01)

Every task is analyzed against verified source files, root causes, proposed minimal safe changes, and regression risks.

---

## 2. Task-by-Task Implementation Blueprints

### Task 1: Fix Mobile Bottom Tab Bar Text Clipping
- **Relevant Files:**
  - `you-are-mine-mobile/app/(tabs)/_layout.jsx`
- **Existing Implementation:**
  - `tabBarStyle` has a fixed height: `Platform.OS === 'web' ? 72 : 64`.
  - `paddingBottom: Platform.OS === 'web' ? 12 : 8`.
  - `tabBarLabel` has `lineHeight: 18`, `minHeight: 18`, `paddingBottom: 2`.
- **Verified Defect:**
  - On mobile web viewports and devices with soft navigation bars, the text descenders of tab labels ("Home", "Explore", "My Invitations") are cut off horizontally at the screen bottom edge.
- **Root Cause:**
  - Fixed height without dynamic safe-area insets from `useSafeAreaInsets()`, causing tab items to be pushed down and clipped by the tab bar outer boundary.
- **Proposed Minimal Safe Change:**
  - Import `useSafeAreaInsets` from `react-native-safe-area-context`.
  - Dynamically calculate tab bar height and padding:
    ```javascript
    const insets = useSafeAreaInsets();
    const bottomPadding = Math.max(insets.bottom, Platform.OS === 'web' ? 12 : 8);
    const tabHeight = (Platform.OS === 'ios' ? 52 : 58) + bottomPadding;
    ```
  - Remove unnecessary `minHeight` / `lineHeight` clamp on `tabBarLabel` and add `fontSize: 10.5`, `marginBottom: 2`.
- **Affected Platforms:** Android, iOS, Mobile Web.
- **Regression Risks:** None; preserves tab routes and icon scaling.
- **Required Tests:** Verify on simulated mobile viewports across Home, Explore, Invitations, Music, Profile tabs.

---

### Task 2: Fix Portrait Template Cover Image Cropping
- **Relevant Files:**
  - `you-are-mine-mobile/app/template/[id].jsx`
  - `you-are-mine-mobile/components/templates/TemplateCard.jsx`
- **Existing Implementation:**
  - Arched artwork container enforces `aspectRatio: 0.88` with `borderTopLeftRadius: 180`, `borderTopRightRadius: 180`, and `contentFit="cover"`.
- **Verified Defect:**
  - In `tpl-wedding-south-indian-05`, the couple's cover image is aggressively center-cropped into their faces, cutting off the traditional cultural attire and temple mandap architecture.
- **Root Cause:**
  - Centered `contentFit="cover"` in combination with the arched dome top slices off heads or crops cultural attire.
- **Proposed Minimal Safe Change:**
  - Use `contentPosition="top center"` (or support `template.focalPoint || 'top center'`).
  - Extend the container `aspectRatio: 0.78` or allow template-specific aspect ratio metadata (`template.coverAspectRatio || 0.82`) so tall portrait wedding cards display their full regal composition.
- **Affected Platforms:** Android, iOS, Web.
- **Regression Risks:** None; cards maintain uniform border styling and drop shadow.
- **Required Tests:** Inspect South Indian wedding template, Lake Palace heritage, and Grand Udaipur templates.

---

### Task 3: Fix Explore Header Brand Logo Artifact
- **Relevant Files:**
  - `you-are-mine-mobile/components/common/Header.jsx`
  - `you-are-mine-mobile/app/(tabs)/explore.jsx`
  - `you-are-mine-mobile/assets/logo.png`, `logo-dark-bg.png`
- **Existing Implementation:**
  - `Header.jsx` currently displays text title when `title` prop is passed, or full raster logo when no title is passed. In dark banners (`HeroBanner.jsx`, `music.jsx`), raster `logo-dark-bg.png` is used.
- **Verified Defect:**
  - In older views, a small raster icon with a white opaque box background was rendered next to screen titles. In dark banners, the logo was low-contrast.
- **Proposed Minimal Safe Change:**
  - Ensure `Header.jsx` renders a clean, crisp title, and where a brand mark is desired, render a pure SVG vector insignia (`react-native-svg`) with `#4A1725` or `#D8B77B` fill, completely eliminating raster white boundary boxes.
- **Affected Platforms:** Android, iOS, Web.
- **Regression Risks:** Header layout stability.
- **Required Tests:** Verify Explore screen header and dark banner logos.

---

### Task 4: Improve Burgundy Envelope Foil Seal Contrast
- **Relevant Files:**
  - `you-are-mine-mobile/components/preview/EnvelopeAnimation.jsx`
- **Existing Implementation:**
  - Wax seal uses flat `#D8B77B` border and icon on `#6A1828` / `#4A1725` burgundy background.
- **Verified Defect:**
  - Insignia lacks specular luminosity and appears subtle on deep burgundy.
- **Proposed Minimal Safe Change:**
  - Enhance the seal styling with multi-layer high-luminance champagne gold:
    - Inner medallion: `#D8B77B` with `#FFF2D1` specular highlight and subtle gold shadow (`shadowColor: '#D8B77B', shadowOpacity: 0.35`).
    - Monogram and heart icon in rich lustrous `#FFF2D1`.
- **Affected Platforms:** Android, iOS, Web.
- **Regression Risks:** None; animations and touch handlers remain unchanged.
- **Required Tests:** Verify seal visibility and open animation sequence in preview.

---

### Task 5: Instagram-Style Interactive Audio Trimmer
- **Relevant Files:**
  - `you-are-mine-mobile/components/editor/MusicSelectionSheet.jsx`
  - `you-are-mine-mobile/services/music.service.js`
  - `you-are-mine-mobile/store/editor.store.js`
  - `src/app/invite/[slug]/page.tsx`
  - `src/components/template01/ui/MusicPlayer.jsx`
- **Existing Implementation:**
  - Prototype trimmer in `MusicSelectionSheet.jsx` with static presets and basic loop seek.
  - Store tracks `audioStartTime` and `audioClipDuration`.
  - Public invitation page `/invite/[slug]` does not explicitly forward `audioStartTime` / `audioEndTime` to template iframe query string.
- **Verified Needs:**
  - Interactive scrubbing: Drag handle for start and clip duration.
  - Waveform visualizer showing active playing position.
  - Persistent storage in `draft.fields.audioStartTime`, `draft.designConfig.audioStartTime`, and `draft.designConfig.audioEndTime`.
  - Public invitation snapshot propagation so guests hear the exact selected chorus loop upon opening.
- **Proposed Minimal Safe Change:**
  1. Complete the interactive audio scrubber and waveform slider in `MusicSelectionSheet.jsx`.
  2. Ensure `setMusicTiming(startTime, clipDuration)` saves to both `fields` and `designConfig`.
  3. Update `src/app/invite/[slug]/page.tsx` to forward `audioStartTime` and `audioEndTime` in query parameters.
  4. Ensure template audio players respect `audioStartTime` and `audioEndTime`.
- **Affected Platforms:** All platforms (Web, Android, iOS, Public Invitation Viewer).
- **Regression Risks:** Backward compatibility with legacy invitations without trim settings (default to `startTime = 0`, full duration).
- **Required Tests:** Run cross-platform regression test, verify autosave, draft reload, and published snapshot immutability.
