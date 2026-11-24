import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants/colors';
import { LotusLogo } from '../components/common/LotusLogo';
import { useAuthStore } from '../store/auth.store';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { isLoading, isOnboardingDone } = useAuthStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Logo fade & scale entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: false,
      }),
    ]).start();

    // 2. Navigation timer once auth and onboarding state hydrate
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (isOnboardingDone) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/onboarding');
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoading, isOnboardingDone]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Decorative Gold Silk Wave Lines (SVG Background) */}
      <View style={styles.wavesContainer}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Path
            d={`M -50 ${height * 0.35} Q ${width * 0.4} ${height * 0.55} ${width + 50} ${height * 0.45}`}
            stroke={Colors.champagneGold}
            strokeWidth="0.8"
            strokeOpacity="0.35"
            fill="none"
          />
          <Path
            d={`M -50 ${height * 0.38} Q ${width * 0.45} ${height * 0.58} ${width + 50} ${height * 0.49}`}
            stroke={Colors.champagneGold}
            strokeWidth="1.2"
            strokeOpacity="0.45"
            fill="none"
          />
          <Path
            d={`M -50 ${height * 0.65} Q ${width * 0.5} ${height * 0.78} ${width + 50} ${height * 0.7}`}
            stroke={Colors.champagneGold}
            strokeWidth="1"
            strokeOpacity="0.3"
            fill="none"
          />
        </Svg>
      </View>

      {/* Central Brand Identity */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LotusLogo size={54} color={Colors.champagneGold} />
        
        <Text style={styles.brandTitle}>YOU ARE MINE</Text>
        <Text style={styles.brandSubtitle}>Digital Invitations</Text>
      </Animated.View>

      {/* Bottom Progress Bar */}
      <View style={styles.bottomBarContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepBurgundy,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  wavesContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  brandTitle: {
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '700',
    color: Colors.champagneGold,
    letterSpacing: 4.5,
    marginTop: 22,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#E8D2C0',
    letterSpacing: 2.5,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 50,
    width: '38%',
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(216, 183, 123, 0.25)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.champagneGold,
    borderRadius: 2,
  },
});
