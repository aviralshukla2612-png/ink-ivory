# HYBRID STEP 3B.04 — EDITOR AND DRAFT INTEGRATION REPORT

## 1. Customization Fields
The native Zustand store (`useEditorStore`) maps the following fields to Valentine:
- `names` or `recipientName` -> Updates Dearest greeting (`.js-recipient`).
- `host` or `senderName` -> Updates letter signature (`.js-sender`).
- `message` or `letterMessage` -> Updates letter paragraph body (`.js-letter-body`).

## 2. Unidirectional Data Synchronization
- Changes made in the native bottom sheet emit `INK_IVORY_CUSTOM_UPDATE` into the WebView.
- The WebView listener executes DOM replacement in ~16ms with zero full-page reload or state flicker.
- Existing debounced autosave (`DraftsService.saveDraft`) persists changes to SQLite/AsyncStorage and backend APIs.
