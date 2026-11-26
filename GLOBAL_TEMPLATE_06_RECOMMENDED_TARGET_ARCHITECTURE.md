# GLOBAL_TEMPLATE_06_RECOMMENDED_TARGET_ARCHITECTURE
## Target Architecture Specification: The Hybrid Adapter Model

### 1. Architectural Philosophy: Best of Both Worlds
The **Hybrid Adapter Architecture** resolves the visual parity challenge by leveraging each platform's greatest strength:
1. **React Native (Native Domain)**: High-performance native navigation, native authentication, touch-responsive draggable toolbars, bottom sheets, camera integration, offline draft persistence, and native payment flows.
2. **Web Core (Visual Domain)**: Hardware-accelerated HTML5/CSS3/Canvas rendering for the invitation card, preserving 100% visual fidelity, 3D perspective doors, particle systems, and web typography.

```text
┌────────────────────────────────────────────────────────────────────────┐
│               YOU ARE MINE MOBILE APPLICATION (EXPO)                   │
├────────────────────────────────────────────────────────────────────────┤
│  NATIVE LAYER (React Native / Expo Router)                             │
│  ├── App Navigation (Tabs: Home, Explore, Invitations, Music, Profile) │
│  ├── Authentication & Customer Session (useAuthStore, SecureStore)     │
│  ├── Draft Persistence & Autosave (useEditorStore, AsyncStorage)       │
│  ├── Native Editor Controls (EditorHeader, BottomSheets, Toolbar)      │
│  └── Checkout & Payment Gateway (Razorpay Native SDK)                  │
├────────────────────────────────────────────────────────────────────────┤
│  INVITATION CANVAS (SharedWebInvitationViewport.jsx)                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Embedded Hardware-Accelerated WebView (react-native-webview)     │  │
│  │ • Renders canonical public/template-*.html                       │  │
│  │ • 100% Pixel-Exact to Website                                    │  │
│  │ • Zero Duplicate UI Code                                         │  │
│  │ • Hardware Canvas, Web Audio & CSS 3D Support                    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                               ▲                                        │
│                               │ Bidirectional postMessage Bridge       │
│                               ▼                                        │
│  NATIVE-TO-WEB PROTOCOL:                                               │
│  • postMessage({ type: 'INK_IVORY_CUSTOM_UPDATE', payload: fields })   │
│  • onMessage({ type: 'INVITATION_ACTION', action: 'EDIT' | 'MAPS' })   │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 2. The Bi-Directional Bridge Protocol

The website templates (`template-02.html` through `template-05.html`) already include a built-in message listener:
```javascript
// public/template-04.html (line 365)
window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'INK_IVORY_CUSTOM_UPDATE') {
    const p = e.data.payload;
    if (p.names) { ... }
    if (p.date) { ... }
    if (p.venue) { ... }
    updateDOM();
  }
});
```

#### The Native Implementation: `SharedWebInvitationViewport.jsx`
```javascript
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export function SharedWebInvitationViewport({
  templateId,
  fields,
  designConfig,
  isEditable = false,
  onAction,
}) {
  const webViewRef = useRef(null);

  // Synchronize field changes from React Native Editor Store to the Web Canvas in real time
  useEffect(() => {
    if (webViewRef.current && fields) {
      const message = JSON.stringify({
        type: 'INK_IVORY_CUSTOM_UPDATE',
        payload: {
          names: fields.names,
          date: fields.date || fields.weddingDate,
          time: fields.time,
          venue: fields.venue || fields.venueName,
          city: fields.city,
          message: fields.message,
          brideParents: fields.brideParents,
          groomParents: fields.groomParents,
          host: fields.host,
          audioSource: fields.audioSource,
        },
      });
      webViewRef.current.postMessage(message);
    }
  }, [fields]);

  const sourceUri = getTemplateSourceUri(templateId);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: sourceUri }}
        style={styles.webView}
        scrollEnabled={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (onAction) onAction(data);
          } catch (e) {}
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
```

---

### 3. Benefits of the Target Architecture

1. **Instant, Absolute Visual Parity Across All 8 Templates**:
   Because mobile renders the exact same canonical template source as the website, **visual parity is 100% by definition**. There are zero color mismatches, zero font discrepancies, and zero missing animations.
2. **Permanent Elimination of Design Drifting**:
   When a designer updates a graphic or ceremony on the website, mobile automatically receives the update with **zero lines of mobile code required**.
3. **Preservation of the Native Experience**:
   Users still enjoy smooth 60fps native tab switching, native login, native bottom sheets, native draft autosave, and native Razorpay payment screens.
4. **Guaranteed Consistency between Preview and Publication**:
   What the customer previews in the mobile editor is **byte-for-byte identical** to what their invited wedding guests will see when opening the published web link.
