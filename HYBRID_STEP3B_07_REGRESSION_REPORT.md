# HYBRID STEP 3B.07 — REGRESSION REPORT

## 1. Scope of Regression Testing
Testing was conducted across:
- **Royal Wedding Templates:** Templates 01, 02, 03, 04, and 05.
- **Unmigrated Templates:** Birthday and Date Planner.
- **System Services:** `useEditorStore`, `DraftsService`, and `MusicService`.

## 2. Test Results
1. **Royal Templates Isolation:**
   - Navigating between `tpl-wedding-navy-01`, `tpl-wedding-paper-palace-04`, and `valentine` displays their respective color palettes and layouts without style bleed.
2. **Unmigrated Occasions:**
   - Birthday and Date Planner continue to route through their existing native presentation renderers.
3. **Editor Autosave Stability:**
   - Saving Valentine draft state updates backend drafts without API schema violations.
4. **Build Cleanliness:**
   - Website Next.js App Router verified clean (`tsc --noEmit` code 0).
   - Mobile codebase verified 100% JavaScript (zero `.ts` or `.tsx` files).
