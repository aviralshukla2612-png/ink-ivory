# HYBRID STEP 2.00 — ROYAL TEMPLATES MIGRATION PLAN

## 1. Executive Summary
Following the successful Step 1 Proof of Concept with Template 04, Step 2 migrates the remaining standalone HTML5 royal celebration templates to **Option D (Hybrid Architecture)**:
- **Phase 2A:** Template 02 — Lake Palace Heritage (`tpl-anniversary-gold-02` / `template-02.html`)
- **Phase 2B:** Template 03 — Traditional Thirumanam (`tpl-wedding-temple-03` / `template-03.html`)
- **Phase 2C:** Template 05 — Royal Tanjore Heritage (`tpl-wedding-south-indian-05` / `template-05.html`)

## 2. Shared Engine Architecture
- **Unified Viewport:** Reuses `SharedWebInvitationViewport.jsx`.
- **Extensible Router:** Updates `TemplateRendererRouter.jsx` to dynamically route Templates 02, 03, 04, and 05 to their canonical HTML modules.
- **Offline Delivery:** Uses `scripts/bundle-royal-templates.js` to package each template with embedded vector assets and Base64 fonts, eliminating CDN dependencies.
- **State Integrity:** Unidirectional data flow from `useEditorStore` via the validated `INK_IVORY_CUSTOM_UPDATE` bridge.
