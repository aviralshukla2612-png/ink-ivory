# HYBRID STEP 1.03 — NATIVE-TO-WEB COMMUNICATION BRIDGE

## 1. Validated Message Contract

Communication between the native React Native shell and the embedded HTML5 WebView follows a bidirectional protocol:

### Web-to-Native (`window.ReactNativeWebView.postMessage`)
```typescript
interface WebToNativeMessage {
  type: 'TEMPLATE_READY' | 'INVITATION_UPDATED' | 'REQUEST_CUSTOMIZATION' | 'REQUEST_CLOSE' | 'PLAYBACK_REQUEST' | 'RENDER_ERROR';
  payload: any;
}
```

1. **`TEMPLATE_READY`**: Dispatched by template DOM upon `DOMContentLoaded`. Informs native host that scripts and listeners are active.
2. **`INVITATION_UPDATED`**: Dispatched when an incoming `INK_IVORY_CUSTOM_UPDATE` has been rendered into the DOM.
3. **`RENDER_ERROR`**: Intercepts unhandled JavaScript exceptions in the template and alerts the native container.

### Native-to-Web (`injectJavaScript`)
```typescript
interface NativeToWebMessage {
  type: 'INK_IVORY_CUSTOM_UPDATE';
  payload: {
    names: string;
    bride?: string;
    groom?: string;
    date: string;
    venue: string;
    city: string;
    brideParents?: string;
    groomParents?: string;
    family?: string;
    audioSource?: string;
    audioStartTime?: number;
  };
}
```

## 2. Security & Sanitization Controls
- Messages are validated with `try/catch` and strict schema checking.
- No authentication tokens, API keys, or database credentials are ever exposed across the bridge.
- Unrecognized message types are safely discarded without throwing unhandled exceptions.
