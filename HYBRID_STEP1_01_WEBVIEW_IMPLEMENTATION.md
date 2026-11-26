# HYBRID STEP 1.01 — WEBVIEW IMPLEMENTATION REPORT

## 1. Component Specification: `SharedWebInvitationViewport.jsx`
Located at: [SharedWebInvitationViewport.jsx](file:///d:/ess%20card/you-are-mine-mobile/components/templates/SharedWebInvitationViewport.jsx)

### Architectural Role
The component serves as the viewport container for rendering the canonical celebration invitation templates directly from their web HTML5/CSS3 sources while running inside the native Expo mobile shell.

### Key Capabilities
1. **Responsive Viewport:** Automatically adapts to screen dimensions (`width: min(100vw, 480px)`) with native status bar and safe area preservation.
2. **Offline-First Delivery:** Bundles canonical Template 04 HTML and assets directly inside JavaScript memory (`bundledTemplate04Html.js`), allowing instant offline startup without network latency.
3. **Controlled Navigation Interceptor:** Uses `onShouldStartLoadWithRequest` to strictly block arbitrary web browsing while delegating approved intents (WhatsApp RSVP, Google Maps, Google Calendar) to native `Linking.openURL()`.
4. **Lifecycle & Error Handling:** Includes native loading skeleton and visual error fallback overlays with retry mechanisms.
