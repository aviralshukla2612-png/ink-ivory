import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Linking,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from '../../constants/colors';
import { Config } from '../../constants/config';

import { TEMPLATE_01_BUNDLED_HTML } from './bundledTemplate01Html';
import { TEMPLATE_02_BUNDLED_HTML } from './bundledTemplate02Html';
import { TEMPLATE_03_BUNDLED_HTML } from './bundledTemplate03Html';
import { TEMPLATE_04_BUNDLED_HTML } from './bundledTemplate04Html';
import { TEMPLATE_05_BUNDLED_HTML } from './bundledTemplate05Html';
import { TEMPLATE_VALENTINE_BUNDLED_HTML } from './bundledValentineHtml';
import { TEMPLATE_BIRTHDAY_BUNDLED_HTML } from './bundledBirthdayHtml';
import { TEMPLATE_DATE_PLANNER_BUNDLED_HTML } from './bundledDatePlannerHtml';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * SharedWebInvitationViewport
 * 
 * Unified host component for embedding canonical HTML5/CSS3 celebration templates
 * inside the native Expo mobile app with offline reliability and real-time
 * bidirectional postMessage synchronization.
 * 
 * Supported Royal Templates:
 * - Template 02: Lake Palace Heritage (Arjun & Sia)
 * - Template 03: Traditional Thirumanam (Meera & Ashwin)
 * - Template 04: Udaipur Paper Palace (Tara & Kabir)
 * - Template 05: Royal Tanjore Heritage (Diya & Siddharth)
 */
export function SharedWebInvitationViewport({
  template,
  draftData,
  isEditable = false,
  onCustomize,
  onClose,
  onPlaybackRequest,
  onRenderReady,
}) {
  const webViewRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const rawId = String(template?.id || draftData?.templateId || draftData?.id || '').toLowerCase();

  // Resolve template-specific bundled HTML
  const { bundledHtml, defaultTitle, defaultNames, defaultPaletteBg } = useMemo(() => {
    if (rawId.includes('navy') || rawId === 'tpl-wedding-navy-01') {
      return {
        bundledHtml: TEMPLATE_01_BUNDLED_HTML,
        defaultTitle: 'Royal Navy Palace',
        defaultNames: 'Aarav & Riya',
        defaultPaletteBg: '#0F1E36', // Deep royal navy
      };
    }
    if (rawId.includes('gold-02') || rawId.includes('lake') || rawId.includes('anniversary')) {
      return {
        bundledHtml: TEMPLATE_02_BUNDLED_HTML,
        defaultTitle: 'Lake Palace Heritage',
        defaultNames: 'Arjun & Sia',
        defaultPaletteBg: '#22332a', // Deep forest emerald
      };
    }
    if (rawId.includes('temple-03') || rawId.includes('thirumanam') || rawId.includes('garden-03')) {
      return {
        bundledHtml: TEMPLATE_03_BUNDLED_HTML,
        defaultTitle: 'Traditional Thirumanam',
        defaultNames: 'Meera & Ashwin',
        defaultPaletteBg: '#1a3329', // Sacred emerald silk
      };
    }
    if (rawId.includes('south-indian-05') || rawId.includes('indian-05') || rawId.includes('tanjore')) {
      return {
        bundledHtml: TEMPLATE_05_BUNDLED_HTML,
        defaultTitle: 'Royal Tanjore Heritage',
        defaultNames: 'Diya & Siddharth',
        defaultPaletteBg: '#2a151b', // Raw silk maroon
      };
    }
    if (rawId.includes('valentine') || rawId === 'valentine') {
      return {
        bundledHtml: TEMPLATE_VALENTINE_BUNDLED_HTML,
        defaultTitle: 'Sealed Love Letter',
        defaultNames: 'Aarav & Riya',
        defaultPaletteBg: '#FFF4F0', // Soft romantic blush
      };
    }
    if (rawId.includes('birthday') || rawId === 'birthday') {
      return {
        bundledHtml: TEMPLATE_BIRTHDAY_BUNDLED_HTML,
        defaultTitle: 'Golden Birthday Surprise',
        defaultNames: 'Ananya',
        defaultPaletteBg: '#FFF3EE', // Warm birthday cream
      };
    }
    if (rawId.includes('date-planner') || rawId === 'date-planner') {
      return {
        bundledHtml: TEMPLATE_DATE_PLANNER_BUNDLED_HTML,
        defaultTitle: 'Our Perfect Date',
        defaultNames: 'Riya & Aarav',
        defaultPaletteBg: '#FFF4F0', // Romantic blush cream
      };
    }
    // Default fallback to Template 04 (Udaipur Paper Palace)
    return {
      bundledHtml: TEMPLATE_04_BUNDLED_HTML,
      defaultTitle: 'The Grand Udaipur Palace',
      defaultNames: 'Tara & Kabir',
      defaultPaletteBg: '#fffaf1', // Ivory paper palace
    };
  }, [rawId]);

  // Prepare custom invitation data payload
  const customPayload = useMemo(() => {
    const fields = draftData?.fields || template?.defaultFields || {};
    const names = fields.names || defaultNames;
    const parts = names.split(/&|\band\b/i).map((s) => s.trim());
    const groomName = parts[0] || 'Groom';
    const brideName = parts[1] || 'Bride';

    return {
      names,
      groom: fields.groom || groomName,
      bride: fields.bride || brideName,
      date: fields.date || fields.weddingDate || 'Friday, 18 December 2026',
      weddingDate: fields.weddingDate || fields.date || 'Friday, 18 December 2026',
      venue: fields.venue || fields.venueName || 'The City Palace Complex, Udaipur',
      venueName: fields.venueName || fields.venue || 'The City Palace Complex, Udaipur',
      city: fields.city || 'Udaipur, Rajasthan',
      brideParents: fields.brideParents || 'Smt. Sunita & Shri Harshvardhan Singhania',
      groomParents: fields.groomParents || 'Smt. Gayatri & Shri Vikramaditya Kapoor',
      family: fields.family || fields.host || 'Singhania & Kapoor Families',
      audioSource: fields.audioSource || '/music/mangal-rang.mp3',
      audioStartTime: fields.audioStartTime || 0,
    };
  }, [draftData, template, defaultNames]);

  // Synchronize draft fields into WebView via window.postMessage
  const syncDraftToWeb = useCallback(() => {
    if (!webViewRef.current) return;
    try {
      const serialized = JSON.stringify(customPayload);
      const script = `
        (function() {
          try {
            window.postMessage({
              type: 'INK_IVORY_CUSTOM_UPDATE',
              payload: ${serialized}
            }, '*');
          } catch (e) {
            console.error('Bridge sync error:', e);
          }
        })();
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    } catch (err) {
      console.warn('[SharedWebInvitationViewport] Failed to inject custom update:', err);
    }
  }, [customPayload]);

  // Push updates when customPayload changes and webview is ready
  useEffect(() => {
    if (isReady) {
      syncDraftToWeb();
    }
  }, [isReady, customPayload, syncDraftToWeb]);

  // Handle incoming web-to-native messages
  const handleMessage = useCallback((event) => {
    try {
      const rawData = event.nativeEvent?.data;
      if (!rawData) return;

      const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
      const { type, payload } = data;

      switch (type) {
        case 'TEMPLATE_READY':
          setIsReady(true);
          setHasError(false);
          syncDraftToWeb();
          if (typeof onRenderReady === 'function') {
            onRenderReady(payload);
          }
          break;

        case 'INVITATION_UPDATED':
          // Update acknowledged by web renderer
          break;

        case 'DATE_PLANNER_CHOICE_CHANGED':
          // Bidirectional Choice Event from Date Planner WebView
          if (payload && typeof onCustomize === 'function') {
            onCustomize(payload);
          }
          break;

        case 'REQUEST_CUSTOMIZATION':
          if (typeof onCustomize === 'function') {
            onCustomize();
          }
          break;

        case 'REQUEST_CLOSE':
          if (typeof onClose === 'function') {
            onClose();
          }
          break;

        case 'PLAYBACK_REQUEST':
          if (typeof onPlaybackRequest === 'function') {
            onPlaybackRequest(payload);
          }
          break;

        case 'RENDER_ERROR':
          console.warn('[SharedWebInvitationViewport] Web runtime reported error:', payload);
          break;

        default:
          break;
      }
    } catch (e) {
      console.warn('[SharedWebInvitationViewport] Error parsing web message:', e);
    }
  }, [syncDraftToWeb, onCustomize, onClose, onPlaybackRequest, onRenderReady]);

  // Navigation request safety interceptor
  const handleShouldStartLoadWithRequest = useCallback((request) => {
    const url = request.url || '';

    // Allow initial load and local bundle schemes
    if (
      url.startsWith('about:blank') ||
      url.startsWith('data:') ||
      url.startsWith('file:') ||
      url.includes('localhost') ||
      url.includes('127.0.0.1')
    ) {
      return true;
    }

    // External intent handlers (WhatsApp, Maps, Google Calendar)
    if (
      url.startsWith('https://wa.me/') ||
      url.startsWith('whatsapp:') ||
      url.startsWith('https://maps.google.com') ||
      url.startsWith('https://calendar.google.com')
    ) {
      Linking.openURL(url).catch((err) =>
        console.warn('[SharedWebInvitationViewport] Could not open external URL:', err)
      );
      return false;
    }

    // Block unapproved external navigation
    return false;
  }, []);

  // On Web browsers, react-native-webview renders an empty/mock view.
  // We render an iframe with srcDoc on web to achieve 100% web parity.
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: defaultPaletteBg }]}>
        <iframe
          srcDoc={bundledHtml}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: defaultPaletteBg,
          }}
          title={defaultTitle}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: defaultPaletteBg }]}>
      <WebView
        ref={webViewRef}
        source={{ html: bundledHtml, baseUrl: Config.API_BASE_URL || 'http://localhost:3000' }}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
        scrollEnabled={true}
        bounces={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onMessage={handleMessage}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        onLoadStart={() => setHasError(false)}
        onLoadEnd={() => {
          setIsReady(true);
          syncDraftToWeb();
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('[SharedWebInvitationViewport] WebView load error:', nativeEvent);
          setHasError(true);
          setErrorMessage(nativeEvent.description || 'Failed to render invitation template');
        }}
        style={styles.webView}
      />

      {/* Loading Indicator Overlay */}
      {!isReady && !hasError && (
        <View style={[styles.loadingOverlay, { backgroundColor: defaultPaletteBg }]}>
          <ActivityIndicator size="large" color={Colors.primary || '#D7B875'} />
          <Text style={styles.loadingText}>Loading {defaultTitle}...</Text>
        </View>
      )}

      {/* Error Fallback Overlay */}
      {hasError && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorTitle}>Unable to display invitation</Text>
          <Text style={styles.errorSubtitle}>{errorMessage}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              setHasError(false);
              webViewRef.current?.reload();
            }}
          >
            <Text style={styles.retryBtnText}>Retry Loading</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#D7B875',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 11,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 13,
    color: '#BBBBBB',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#D7B875',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryBtnText: {
    color: '#1E1E1E',
    fontWeight: '700',
    fontSize: 14,
  },
});
