# HYBRID STEP 3C.04 — EDITOR AND DRAFT INTEGRATION REPORT

## 1. Canonical Field Mappings
The native Zustand store (`useEditorStore`) maps the following fields to Birthday:
- `names` or `recipientName` -> Updates birthday recipient (`.js-recipient`).
- `host` or `senderName` -> Updates planner signature (`.js-sender`).
- `date` or `weddingDate` -> Updates celebration date pill (`.js-date`).
- `message` or `letterMessage` -> Updates warm wishes body (`.js-message`).

## 2. Unidirectional Data Synchronization
- Changes made in the native bottom sheet emit `INK_IVORY_CUSTOM_UPDATE` into the WebView.
- The WebView listener executes DOM replacement in ~15ms with zero full-page reload.
- Debounced autosave (`DraftsService.saveDraft`) persists changes to local storage and backend APIs.
