import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Sparkles } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { BrandEmblem } from '../common/BrandEmblem';

export function HeroBanner({ onCtaPress }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Background card with rich silk texture simulation */}
      <View style={styles.card}>
        {/* Left Column: Content */}
        <View style={styles.contentCol}>
          {/* Subtle decorative emblem badge */}
          <View style={styles.sparkleBadge}>
            <Sparkles size={12} color={Colors.champagneGold} />
            <Text style={styles.badgeText}>ROYAL BESPOKE EDITIONS</Text>
          </View>

          {/* Headline & Description */}
          <Text style={styles.heading}>Make Every Moment{'\n'}Unforgettable</Text>
          <Text style={styles.subheading}>
            Bespoke digital invitations for life's most cherished weddings & celebrations.
          </Text>

          {/* CTA Button */}
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={onCtaPress || (() => router.push('/(tabs)/explore'))}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaText}>Create Invitation</Text>
            <ArrowRight size={14} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Right Column: Decorative Pure Vector Gold Brand Emblem */}
        <View style={styles.emblemWrapper}>
          <BrandEmblem size={54} color={Colors.champagneGold} secondaryColor="#F3E5AB" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    backgroundColor: Colors.deepBurgundy,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(216, 183, 123, 0.4)',
    elevation: 4,
    shadowColor: Colors.deepBurgundy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  contentCol: {
    flex: 1,
    paddingRight: 10,
    zIndex: 2,
  },
  emblemWrapper: {
    width: 86,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.95,
  },
  emblemImage: {
    width: 82,
    height: 36,
  },
  sparkleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(216, 183, 123, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 10,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.champagneGold,
    letterSpacing: 1,
  },
  heading: {
    fontFamily: 'serif',
    fontSize: 19,
    fontWeight: '700',
    color: Colors.textLight,
    lineHeight: 25,
    letterSpacing: 0.3,
  },
  subheading: {
    fontSize: 11.5,
    color: '#E8D4C4',
    lineHeight: 16,
    marginTop: 6,
    marginBottom: 14,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: Colors.champagneGold,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
});

export default HeroBanner;
