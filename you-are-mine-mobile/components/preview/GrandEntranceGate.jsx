import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Sparkles, ArrowRight } from 'lucide-react-native';
import { MusicService } from '../../services/music.service';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * GrandEntranceGate
 * Dynamic entrance gate experience adapting to each template's bespoke theme,
 * artwork, occasion badge, and musical soundtrack.
 */
export function GrandEntranceGate({
  coupleNames = 'Aarav & Riya',
  tagline = 'THE WEDDING CELEBRATION OF',
  message = 'Step through to immerse in sacred rituals, joyful festivities, and celebration.',
  audioUrl,
  audioTitle = 'Bespoke Celebration Melody',
  audioStartTime = 0,
  templateId = 'tpl-wedding-navy-01',
  backgroundImageUrl = null,
  badgeText = 'ROYAL INVITATION',
  buttonText = 'ENTER CELEBRATION',
  onGateOpened = () => {},
}) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Auto-start soundtrack when entering gate experience
  useEffect(() => {
    if (audioUrl) {
      MusicService.playSound(audioUrl, { startTime: audioStartTime }).catch((err) => {
        console.warn('Audio auto-play note on gate mount:', err?.message);
      });
    }
  }, [audioUrl, audioStartTime]);

  const handleOpenGate = () => {
    if (hasInteracted) return;
    setHasInteracted(true);

    // Ensure audio is playing
    if (audioUrl) {
      MusicService.playSound(audioUrl, { startTime: audioStartTime }).catch((err) => {
        console.warn('Audio playback error on gate open:', err?.message);
      });
    }

    // Camera zoom push animation into the celebration
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onGateOpened) onGateOpened();
    });
  };

  const handleDirectAccess = () => {
    setHasInteracted(true);
    if (audioUrl) {
      MusicService.playSound(audioUrl, { startTime: audioStartTime }).catch(() => {});
    }
    if (onGateOpened) onGateOpened();
  };

  const lowerId = String(templateId || '').toLowerCase();
  let backgroundSource = require('../../assets/grand-entrance-gate.png');
  let effectiveButtonText = buttonText;

  if (lowerId.includes('birthday')) {
    backgroundSource = require('../../assets/showcase/birthday.jpg');
    if (!buttonText || buttonText === 'ENTER CELEBRATION') effectiveButtonText = 'ENTER BIRTHDAY PARTY';
  } else if (lowerId.includes('valentin') || lowerId.includes('date-planner')) {
    backgroundSource = require('../../assets/showcase/valentine.jpg');
    if (!buttonText || buttonText === 'ENTER CELEBRATION') effectiveButtonText = 'OPEN VALENTINE LOVE LETTER';
  } else if (lowerId.includes('thirumanam') || lowerId.includes('south-indian') || lowerId.includes('temple')) {
    backgroundSource = require('../../assets/showcase/thirumanam.jpg');
    if (!buttonText || buttonText === 'ENTER CELEBRATION') effectiveButtonText = 'ENTER TEMPLE WEDDING';
  } else if (lowerId.includes('udaipur') || lowerId.includes('paper-palace')) {
    backgroundSource = require('../../assets/showcase/udaipur-palace.jpg');
    if (!buttonText || buttonText === 'ENTER CELEBRATION') effectiveButtonText = 'ENTER ROYAL PALACE';
  } else if (lowerId.includes('lake') || lowerId.includes('anniversary')) {
    backgroundSource = require('../../assets/showcase/arjun-sia.jpg');
    if (!buttonText || buttonText === 'ENTER CELEBRATION') effectiveButtonText = 'ENTER HERITAGE CELEBRATION';
  } else if (backgroundImageUrl && typeof backgroundImageUrl === 'string' && backgroundImageUrl.startsWith('http')) {
    backgroundSource = { uri: backgroundImageUrl };
  }

  return (
    <Animated.View
      style={[
        styles.fullScreenOverlay,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* 1. Bespoke Template Backdrop Image */}
      <Image
        source={backgroundSource}
        style={styles.backgroundImage}
        contentFit="cover"
        contentPosition="center"
        priority="high"
      />

      {/* Atmospheric Dark Luxury Vignette (Tap anywhere to open) */}
      <TouchableOpacity
        style={styles.vignetteOverlay}
        activeOpacity={1}
        onPress={handleOpenGate}
      />

      {/* 2. Central Frosted Glass Invitation Card */}
      <View style={styles.centerContainer}>
        <View style={styles.frostedCard}>
          {/* Badge: ✨ ROYAL INVITATION / OCCASION */}
          <View style={styles.badgePill}>
            <Sparkles size={13} color="#D6B477" />
            <Text style={styles.badgeText}>{badgeText.toUpperCase()}</Text>
          </View>

          {/* Subtitle / Eyebrow */}
          <Text style={styles.taglineText}>
            {tagline ? tagline.toUpperCase() : 'CELEBRATING'}
          </Text>

          {/* Main Title / Couple Names */}
          <Text style={styles.namesText} numberOfLines={2}>
            {coupleNames}
          </Text>

          {/* Flourish Divider: ✦ — ✦ */}
          <View style={styles.flourishRow}>
            <View style={styles.flourishLine} />
            <Text style={styles.flourishDiamond}>✦</Text>
            <View style={styles.flourishLine} />
          </View>

          {/* Invitation Message */}
          <Text style={styles.messageText}>
            {message}
          </Text>

          {/* Primary Gold CTA: ENTER CELEBRATION → */}
          <TouchableOpacity
            style={styles.enterButton}
            onPress={handleOpenGate}
            activeOpacity={0.85}
          >
            <Text style={styles.enterButtonText}>{effectiveButtonText.toUpperCase()}</Text>
            <ArrowRight size={17} color="#091321" strokeWidth={2.5} style={{ marginLeft: 6 }} />
          </TouchableOpacity>

          {/* Direct Access (Skip) */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleDirectAccess}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>DIRECT ACCESS (SKIP)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullScreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: '#091321',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  vignetteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 19, 33, 0.55)',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    zIndex: 10,
  },
  frostedCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'rgba(9, 19, 33, 0.88)',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(214, 180, 119, 0.45)',
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.65,
    shadowRadius: 24,
    elevation: 12,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(214, 180, 119, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(214, 180, 119, 0.35)',
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E7CEA0',
    letterSpacing: 2.2,
  },
  taglineText: {
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontSize: 12,
    color: '#D6B477',
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: 'center',
  },
  namesText: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFDF7',
    textAlign: 'center',
    letterSpacing: 0.8,
    marginBottom: 12,
    lineHeight: 34,
  },
  flourishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  flourishLine: {
    width: 40,
    height: 1,
    backgroundColor: '#D6B477',
    opacity: 0.6,
  },
  flourishDiamond: {
    fontSize: 10,
    color: '#D6B477',
  },
  messageText: {
    fontSize: 13,
    color: 'rgba(255, 253, 247, 0.85)',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  enterButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D6B477',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D6B477',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  enterButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#091321',
    letterSpacing: 1.2,
  },
  skipButton: {
    marginTop: 14,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  skipButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(214, 180, 119, 0.75)',
    letterSpacing: 1.5,
    textDecorationLine: 'underline',
  },
  webPreviewLink: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(26, 38, 62, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(214, 180, 119, 0.35)',
  },
  webPreviewText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E7CEA0',
  },
});

export default GrandEntranceGate;
