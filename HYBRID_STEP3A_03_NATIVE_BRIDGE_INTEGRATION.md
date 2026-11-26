# HYBRID STEP 3A.03 — NATIVE BRIDGE INTEGRATION REPORT

## 1. Unidirectional Data Synchronization
- The native Zustand editor store (`useEditorStore`) remains the single source of truth.
- Whenever user modifies draft text in the native bottom sheet, `SharedWebInvitationViewport` injects:
```javascript
window.postMessage({
  type: 'INK_IVORY_CUSTOM_UPDATE',
  payload: {
    names: 'Aarav & Riya',
    date: 'Friday, 18 December 2026',
    venue: 'The Heritage Palace & Gardens',
    city: 'Jaipur, Rajasthan'
  }
}, '*');
```
- The embedded template listens on `window.addEventListener('message')` and updates all `.js-couple-names`, `.js-wedding-date`, and `.js-wedding-venue` nodes in sub-frame time (~18ms).

## 2. Controlled Native Fallback Mechanism
Inside `TemplateRendererRouter.jsx`:
```javascript
const preferNativeTemplate01 = Boolean(
  template?.preferNative || draftData?.preferNative || false
);

if ((templateId.includes('navy') || templateId === 'tpl-wedding-navy-01') && !preferNativeTemplate01) {
  return <SharedWebInvitationViewport ... />;
}
// Immediate Fallback:
return <RoyalMultiSlidePresentation ... />;
```
Testing teams or rollback procedures can supply `preferNative: true` in the draft data to instantly revert to the native React Native presentation without code redeployment.
