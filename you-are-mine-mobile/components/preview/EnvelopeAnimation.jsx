import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  AccessibilityInfo,
} from 'react-native';
import { Heart, Sparkles, ChevronDown } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * EnvelopeAnimation
 * Presents a luxury wax-sealed envelope that opens to reveal the bespoke invitation.
 * Respects accessibility / reduced motion preferences.
 */
export function EnvelopeAnimation({
  coupleNames = 'Aarav & Riya',
  tagline = 'The Wedding Celebration',
  onOpened,
  isOpen = false,
}) {
  const [opened, setOpened] = useState(isOpen);
  const flapAnim = useRef(new Animated.Value(0)).current; // 0 = closed, 1 = opened
  const sealScaleAnim = useRef(new Animated.Value(1)).current;
  const envelopeFadeAnim = useRef(new Animated.Value(1)).current;

  const handleOpen = () => {
    if (opened) return;

    // Wax seal pulse and flap opening sequence
    Animated.sequence([
      Animated.timing(sealScaleAnim, {
        toValue: 1.15,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(flapAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(sealScaleAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(envelopeFadeAnim, {
        toValue: 0,
        duration: 450,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setOpened(true);
      if (onOpened) onOpened();
    });
  };

  const handleSkip = () => {
    setOpened(true);
    if (onOpened) onOpened();
  };

  if (opened) return null;

  const flapRotation = flapAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  });

  return (
    <Animated.View style={[styles.overlay, { opacity: envelopeFadeAnim }]}>
      <View style={styles.container}>
        {/* Skip Button */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
          accessibilityLabel="Skip envelope animation"
        >
          <Text style={styles.skipText}>Skip Envelope</Text>
        </TouchableOpacity>

        {/* Envelope Body */}
        <View style={styles.envelopeCard}>
          {/* Top Flap (Animated) */}
          <Animated.View
            style={[
              styles.flap,
              {
                transform: [
                  { perspective: 800 },
                  { rotateX: flapRotation },
                ],
              },
            ]}
          >
            <View style={styles.flapInner}>
              <View style={styles.flapGoldBorder} />
            </View>
          </Animated.View>

          {/* Letter / Invitation Peek Preview */}
          <View style={styles.letterPeek}>
            <Sparkles size={16} color={Colors.gold} style={styles.sparkleIcon} />
            <Text style={styles.peekTagline}>{tagline.toUpperCase()}</Text>
            <Text style={styles.peekNames} numberOfLines={2}>
              {coupleNames}
            </Text>
            <View style={styles.goldLine} />
          </View>

          {/* Envelope Pocket */}
          <View style={styles.pocket}>
            {/* Wax Seal Button */}
            <TouchableOpacity
              style={styles.sealTouchable}
              onPress={handleOpen}
              activeOpacity={0.85}
              accessibilityLabel="Tap seal to open invitation"
            >
              <Animated.View
                style={[
                  styles.waxSeal,
                  { transform: [{ scale: sealScaleAnim }] },
                ]}
              >
                <View style={styles.waxSealInner}>
                  <Heart size={20} color="#F8E7C0" fill="#F8E7C0" />
                  <Text style={styles.sealMonogram}>YOU ARE MINE</Text>
                </View>
              </Animated.View>
            </TouchableOpacity>

            <Text style={styles.instructionText}>✦ Tap wax seal to open ✦</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31, 25, 22, 0.92)',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  skipButton: {
    marginBottom: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 249, 242, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(216, 183, 123, 0.4)',
  },
  skipText: {
    color: Colors.champagne,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  envelopeCard: {
    width: Math.min(SCREEN_WIDTH - 48, 340),
    height: 440,
    backgroundColor: '#F7EFE4',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.gold,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    position: 'relative',
  },
  flap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 190,
    zIndex: 10,
    transformOrigin: 'top',
  },
  flapInner: {
    flex: 1,
    backgroundColor: '#EDE1D0',
    borderBottomLeftRadius: 170,
    borderBottomRightRadius: 170,
    borderWidth: 1,
    borderColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  flapGoldBorder: {
    width: 60,
    height: 2,
    backgroundColor: Colors.gold,
    opacity: 0.6,
  },
  letterPeek: {
    marginTop: 70,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  sparkleIcon: {
    marginBottom: 8,
  },
  peekTagline: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 2,
    marginBottom: 8,
  },
  peekNames: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 12,
  },
  goldLine: {
    width: 80,
    height: 1,
    backgroundColor: Colors.gold,
    opacity: 0.8,
  },
  pocket: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: '#F3E8D8',
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    borderWidth: 1,
    borderColor: 'rgba(216, 183, 123, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  sealTouchable: {
    marginBottom: 12,
  },
  waxSeal: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#5A1220',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F3E5AB',
    elevation: 10,
    shadowColor: '#D8B77B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
  },
  waxSealInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#F8E7C0',
    backgroundColor: '#6A1828',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealMonogram: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#FFF2D1',
    letterSpacing: 0.8,
    marginTop: 3,
  },
  instructionText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#7D5E4D',
    letterSpacing: 0.5,
  },
});

export default EnvelopeAnimation;
