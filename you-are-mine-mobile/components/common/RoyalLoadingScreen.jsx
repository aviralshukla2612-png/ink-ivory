import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Sparkles } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Curated Rotating Luxury Invitation Slides
 * Dynamically cycles throughout the 0 → 100 counting sequence.
 */
const SHOWCASE_SLIDES = [
  {
    image: require('../../assets/showcase/navy-wedding.jpg'),
    badge: 'ROYAL BESPOKE EDITION',
    title: 'The Royal Navy Wedding',
    subtitle: 'Moving 3D Golden Gates & Sitar',
  },
  {
    image: require('../../assets/showcase/udaipur-palace.jpg'),
    badge: 'PALACE HERITAGE SUITE',
    title: 'Tara & Kabir — Udaipur Palace',
    subtitle: 'Lakeside Mandap & Fireworks',
  },
  {
    image: require('../../assets/showcase/arjun-sia.jpg'),
    badge: 'SIGNATURE 8-SECTION STORY',
    title: 'Arjun & Sia — Lake Palace',
    subtitle: 'Blooming Lotus & Marigold Rangoli',
  },
  {
    image: require('../../assets/showcase/thirumanam.jpg'),
    badge: 'SACRED TEMPLE WEDDING',
    title: 'Thirumanam South Indian',
    subtitle: 'Golden Gopuram & Temple Bells',
  },
  {
    image: require('../../assets/showcase/birthday.jpg'),
    badge: 'CHIC BIRTHDAY CELEBRATION',
    title: 'Golden Birthday Surprise',
    subtitle: 'Festive Confetti & Live Music',
  },
  {
    image: require('../../assets/showcase/valentine.jpg'),
    badge: 'INTERACTIVE LOVE STORY',
    title: 'Will You Be My Valentine?',
    subtitle: 'Wax Seal Letter & Proposal',
  },
];

export function RoyalLoadingScreen({
  title = 'YOU ARE MINE',
  subtitle = 'ROYAL ATELIER',
  message = "Let's celebrate today and craft your bespoke royal invitation",
  fullScreen = true,
  onFinished,
}) {
  const [count, setCount] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Animated values
  const countProgress = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const cardGlow = useRef(new Animated.Value(0.45)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;
  const slideFadeAnim = useRef(new Animated.Value(1)).current;

  // Slide switcher: calm, luxurious cinematic crossfade every 1100ms (matching Zarvion pacing)
  useEffect(() => {
    const slideInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(slideFadeAnim, {
          toValue: 0.15,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(slideFadeAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.in(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();

      setActiveSlideIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 1100);

    return () => clearInterval(slideInterval);
  }, []);

  // Counter 0 to 100 animation: calm, steady, luxurious progression (~3.4 seconds)
  useEffect(() => {
    let current = 0;
    const duration = 3400; // 3.4 seconds smooth, measured pacing like Zarvion
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Non-linear easing: starts steady, speeds up smoothly through mid-range, finishes crisp
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      current = Math.min(100, Math.floor(eased * 100));
      setCount(current);

      if (progress >= 1) {
        clearInterval(timer);
        setCount(100);
        if (onFinished) {
          setTimeout(() => {
            Animated.timing(fadeOutAnim, {
              toValue: 0,
              duration: 350,
              useNativeDriver: Platform.OS !== 'web',
            }).start(() => {
              if (typeof onFinished === 'function') {
                onFinished();
              }
            });
          }, 200);
        }
      }
    }, 24);

    // Progress bar animation
    Animated.timing(countProgress, {
      toValue: 100,
      duration: duration,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: false,
    }).start();

    // Subtle ambient breathing on central showcase card
    const ambientLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.025,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(cardGlow, {
            toValue: 0.85,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(cardGlow, {
            toValue: 0.45,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]),
      ])
    );
    ambientLoop.start();

    return () => {
      clearInterval(timer);
      ambientLoop.stop();
    };
  }, []);

  const progressWidth = countProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const activeSlide = SHOWCASE_SLIDES[activeSlideIndex] || SHOWCASE_SLIDES[0];

  const content = (
    <Animated.View style={[styles.canvas, { opacity: fadeOutAnim }]}>
      {/* Ambient Deep Radial Backlight */}
      <View style={styles.ambientBacklight} />

      {/* TOP HEADER ROW: Brand Logo on Left, Big Counting Number on Right */}
      <View style={styles.topHeaderRow}>
        {/* Official Luminous Gold Brand Logo Banner */}
        <View style={styles.brandContainer}>
          <Image
            source={require('../../assets/logo-dark-bg.png')}
            style={styles.logoBanner}
            contentFit="contain"
            priority="high"
          />
        </View>

        {/* Big Modern Numeric Counter (0 -> 100) */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterNumber}>
            {String(count).padStart(2, '0')}
          </Text>
          <Text style={styles.counterPercent}>%</Text>
        </View>
      </View>

      {/* CENTER: Illuminated 3D Glass Showcase Card (Dynamically Crossfading) */}
      <View style={styles.centerContainer}>
        {/* Ambient Neon Backglow */}
        <Animated.View
          style={[
            styles.glowAura,
            {
              opacity: cardGlow,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />

        {/* The Showcase Glass Portal */}
        <Animated.View
          style={[
            styles.showcaseCard,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          {/* Dynamically Crossfading Card Visual Artwork */}
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              { opacity: slideFadeAnim },
            ]}
          >
            <Image
              source={activeSlide.image}
              style={styles.cardArtwork}
              contentFit="cover"
              priority="high"
              transition={150}
            />
          </Animated.View>

          {/* Dark Glassmorphic Gradient Overlay */}
          <View style={styles.cardGlassOverlay} />

          {/* Dynamic Card Monogram, Badge & Metadata */}
          <Animated.View
            style={[
              styles.cardInnerContent,
              { opacity: slideFadeAnim },
            ]}
          >
            <View style={styles.cardPill}>
              <Sparkles size={11} color="#D7B875" />
              <Text style={styles.cardPillText}>{activeSlide.badge}</Text>
            </View>

            <View style={styles.cardBottomMeta}>
              <Text style={styles.cardTitle}>{activeSlide.title}</Text>
              <Text style={styles.cardSubtitle}>{activeSlide.subtitle}</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </View>

      {/* BOTTOM SECTION: Ultra-Minimal Slim Neon Golden Progress Line */}
      <View style={styles.bottomSection}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressWidth,
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );

  if (fullScreen) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        {content}
      </SafeAreaView>
    );
  }

  return <View style={styles.inlineContainer}>{content}</View>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2A0C16', // Luxury Deep Royal Burgundy Wine (No black!)
  },
  inlineContainer: {
    minHeight: 480,
    backgroundColor: '#2A0C16',
    borderRadius: 24,
    overflow: 'hidden',
    marginVertical: 12,
  },
  canvas: {
    flex: 1,
    backgroundColor: '#2A0C16', // Luxury Deep Royal Burgundy Wine
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
    position: 'relative',
  },
  ambientBacklight: {
    position: 'absolute',
    top: '25%',
    left: '15%',
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    borderRadius: (SCREEN_WIDTH * 0.7) / 2,
    backgroundColor: 'rgba(215, 184, 117, 0.12)',
  },

  /* Top Header Row */
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 8,
    zIndex: 10,
  },
  brandContainer: {
    justifyContent: 'center',
    paddingTop: 4,
  },
  logoBanner: {
    width: 145,
    height: 48,
  },

  /* Big Numeric Counter (Right Side, Exactly Like Zarvion) */
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  counterNumber: {
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    fontSize: 68,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    lineHeight: 68,
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(215, 184, 117, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  counterPercent: {
    fontSize: 20,
    fontWeight: '700',
    color: '#D7B875',
    marginLeft: 3,
    marginTop: 6,
  },

  /* Center: Showcase Portal Card */
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 18,
    position: 'relative',
  },
  glowAura: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.72,
    height: SCREEN_HEIGHT * 0.38,
    borderRadius: 28,
    backgroundColor: 'rgba(215, 184, 117, 0.16)',
  },
  showcaseCard: {
    width: Math.min(SCREEN_WIDTH - 64, 290),
    height: Math.min(SCREEN_HEIGHT * 0.42, 320),
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(215, 184, 117, 0.55)',
    backgroundColor: '#35131D',
    elevation: 12,
    shadowColor: '#D7B875',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    position: 'relative',
  },
  cardArtwork: {
    ...StyleSheet.absoluteFillObject,
  },
  cardGlassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(42, 12, 22, 0.08)',
  },
  cardInnerContent: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(53, 19, 29, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(215, 184, 117, 0.5)',
  },
  cardPillText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#EDE2CF',
    letterSpacing: 1.2,
  },
  cardBottomMeta: {
    backgroundColor: 'rgba(42, 12, 22, 0.90)',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(215, 184, 117, 0.35)',
  },
  cardTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Cinzel' : 'serif',
    fontSize: 14.5,
    fontWeight: '700',
    color: '#EDE2CF',
  },
  cardSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#D7B875',
    marginTop: 2,
  },

  /* Bottom Section */
  bottomSection: {
    paddingBottom: 4,
  },
  quoteRow: {
    marginBottom: 16,
  },
  quoteHeadline: {
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 25,
    letterSpacing: -0.3,
  },
  progressTrack: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(215, 184, 117, 0.18)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D7B875',
    borderRadius: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerBrand: {
    fontSize: 9.5,
    fontWeight: '700',
    color: 'rgba(237, 226, 207, 0.45)',
    letterSpacing: 1.5,
  },
  footerStatus: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#D7B875',
    letterSpacing: 1.2,
    fontVariant: ['tabular-nums'],
  },
});

export default RoyalLoadingScreen;
