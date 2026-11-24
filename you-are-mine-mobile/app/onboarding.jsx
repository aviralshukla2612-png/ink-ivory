import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Button } from '../components/common/Button';
import { useAuthStore } from '../store/auth.store';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Create Beautiful\nDigital Invitations',
    description: 'Personalize, preview and share stunning invitations for every occasion.',
    imageUri: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    fallbackLabel: '💍 Regal Wedding Invitation',
  },
  {
    id: '2',
    title: 'Personalize Your\nBespoke Celebration',
    description: 'Add your photos, dates, sacred venues, heartfelt messages and royal soundtracks with an intuitive native editor.',
    imageUri: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    fallbackLabel: '✨ Complete Creative Freedom',
  },
  {
    id: '3',
    title: 'Publish & Share\nInstantly With Loved Ones',
    description: 'Go live with your bespoke digital invitation website and share interactive links seamlessly across WhatsApp and messaging apps.',
    imageUri: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    fallbackLabel: '💌 Instant Live Publishing',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleFinish = async () => {
    await completeOnboarding();
    router.replace('/(tabs)/home');
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const onMomentumScrollEnd = (e) => {
    const pageIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(pageIndex);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar with Skip */}
      <View style={styles.topBar}>
        <View style={{ width: 48 }} />
        <TouchableOpacity
          onPress={handleFinish}
          activeOpacity={0.7}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slide Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slideContainer}>
            {/* Arched Photo Card */}
            <View style={styles.archOuter}>
              <View style={styles.archFrame}>
                <Image
                  source={{ uri: item.imageUri }}
                  style={styles.archImage}
                  resizeMode="cover"
                />
                <View style={styles.archOverlay} />
              </View>
            </View>

            {/* Typography */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      {/* Bottom Controls: Pagination Dots & CTA */}
      <View style={styles.bottomContainer}>
        {/* Pagination Dots */}
        <View style={styles.paginationRow}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <Button
          title={currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          variant="primary"
          size="large"
          style={styles.ctaButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  slideContainer: {
    width,
    alignItems: 'center',
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  archOuter: {
    width: width * 0.76,
    height: width * 0.94,
    borderTopLeftRadius: width * 0.38,
    borderTopRightRadius: width * 0.38,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    padding: 3,
    borderWidth: 1.5,
    borderColor: Colors.champagneGold,
    backgroundColor: Colors.cream,
    elevation: 4,
    shadowColor: Colors.deepBurgundy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    marginTop: 10,
  },
  archFrame: {
    flex: 1,
    borderTopLeftRadius: width * 0.36,
    borderTopRightRadius: width * 0.36,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.deepBurgundy,
  },
  archImage: {
    width: '100%',
    height: '100%',
  },
  archOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(74, 23, 37, 0.08)',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 24,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 12,
    paddingHorizontal: 12,
  },
  bottomContainer: {
    paddingHorizontal: 28,
    paddingBottom: 28,
    alignItems: 'center',
    gap: 20,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 7,
    borderRadius: 3.5,
  },
  activeDot: {
    width: 22,
    backgroundColor: Colors.primary,
  },
  inactiveDot: {
    width: 7,
    backgroundColor: '#DECFC3',
  },
  ctaButton: {
    width: '100%',
  },
});
