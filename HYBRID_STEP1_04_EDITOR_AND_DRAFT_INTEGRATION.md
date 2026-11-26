# HYBRID STEP 1.04 — EDITOR AND DRAFT INTEGRATION REPORT

## 1. Single Source of Truth
The native editor (`app/editor/[id].jsx`), powered by the Zustand store (`useEditorStore`) and `DraftsService` (persisted to backend and `AsyncStorage`), remains authoritative for all customer draft data.

## 2. Unidirectional State Flow
1. User adjusts fields in the native editor bottom sheets (Text, Style, Images, Music, Sections).
2. `useEditorStore` updates draft state and triggers debounce autosave.
3. `SharedWebInvitationViewport` detects draft state updates via React `useMemo`.
4. `syncDraftToWeb` injects the updated JSON payload via `window.postMessage('INK_IVORY_CUSTOM_UPDATE')`.
5. The canonical HTML template executes `updateDOM()` and re-renders names, dates, parents, and venue details without page reloads.

## 3. Audio & Music Management
- Music audio can be managed natively via `MusicService` or delegated to the template's embedded audio element.
- To prevent competing audio playback, the template audio control respects the active native playback state.
