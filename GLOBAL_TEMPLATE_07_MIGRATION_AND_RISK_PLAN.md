# GLOBAL_TEMPLATE_07_MIGRATION_AND_RISK_PLAN
## Migration Roadmap, Offline Strategy & Risk Mitigation

### 1. Phased Migration Roadmap

The migration to the Hybrid Architecture can be executed cleanly and incrementally without risking platform downtime:

```text
PHASE 1: Foundation & Bridge Construction
├── 1. Install & configure `react-native-webview` in mobile (pure JS wrapper)
├── 2. Build `SharedWebInvitationViewport.jsx` with bidirectional postMessage bridge
└── 3. Implement local HTML/asset bundling and caching for offline availability

PHASE 2: Pilot Migration & Validation (Template 04 & Template 02)
├── 1. Route Template 04 through `SharedWebInvitationViewport`
├── 2. Route Template 02 (Lake Palace) through `SharedWebInvitationViewport`
└── 3. Verify real-time editor two-way updates and full 60fps gesture response

PHASE 3: Full Fleet Rollout (Templates 01, 03, 05, Birthday, Valentine, Date Planner)
├── 1. Route Templates 03 & 05
├── 2. Route Birthday, Valentine & Date Planner
└── 3. Verify side-by-side parity across all 8 celebration templates

PHASE 4: Final Hardening & Cleanup
├── 1. Verify offline mode on physical Android and iOS devices
├── 2. Deprecate legacy monolithic cloner components
└── 3. Final sign-off
```

---

### 2. Offline Availability & Asset Strategy

To guarantee that mobile templates open and function even when the user has poor connectivity or is offline:
1. **Local Asset Bundling**:
   - The canonical `public/template-*.html` files and their local assets (`/audio/`, `/images/`) are bundled directly into the mobile app's asset manifest or local document directory.
2. **Local File Protocol / Embedded HTTP Daemon**:
   - On mobile, `WebView` loads via `file:///android_asset/...` or a lightweight local asset file URI (`source={{ uri: localHtmlPath }}`), ensuring instant 0ms load times and 100% offline functionality.
3. **Font Bundling**:
   - Web fonts are bundled locally and referenced via relative CSS `@font-face` within the HTML templates, requiring zero runtime calls to Google Fonts CDN.

---

### 3. Risk Assessment & Mitigation Matrix

| Risk Factor | Severity | Probability | Technical Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **WebView Memory Consumption** | Medium | Low | Ensure the WebView instance is unmounted when leaving the Preview/Editor screens. Never keep inactive WebView instances alive in the background. |
| **Audio Playback Overlap** | Low | Low | Mute or pause the WebView's internal audio element when the screen loses focus, using `MusicService` as the single authoritative master audio player. |
| **Security & Cross-Origin Communication** | Low | Very Low | Enforce strict `originWhitelist={['*']}` or local file scheme. All `postMessage` payloads are strictly typed JSON (`INK_IVORY_CUSTOM_UPDATE`). |
| **iOS / Android App Store Rejection** | None | Zero | Standard commercial apps (Airbnb, Slack, Uber, Discord) use embedded WebViews for rich interactive documents and cards. This violates zero App Store policies. |
| **Rollback Safety** | Low | Low | `TemplateRendererRouter.jsx` acts as a feature flag. If an unexpected issue occurs on any device, a single boolean toggle can route back to native fallback components instantly. |
