import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Sparkles } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

export function HeroBanner({ onCtaPress }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Background card with rich silk texture simulation */}
      <View style={styles.card}>
        {/* Subtle decorative emblem */}
        <View style={styles.sparkleBadge}>
          <Sparkles size={14} color={Colors.champagneGold} />
          <Text style={styles.badgeText}>ROYAL BESPOKE EDITIONS</Text>
        </View>

        {/* Headline & Description */}
        <Text style={styles.heading}>Make Every Moment{'\n'}Unforgettable</Text>
        <Text style={styles.subheading}>
          Create beautiful digital invitations for life's most meaningful celebrations.
        </Text>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={onCtaPress || (() => router.push('/(tabs)/explore'))}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Create Invitation</Text>
          <ArrowRight size={15} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  card: {
    backgroundColor: Colors.deepBurgundy,
    borderRadius: 22,
    paddingVertical: 22,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(216, 183, 123, 0.35)',
    elevation: 4,
    shadowColor: Colors.deepBurgundy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  sparkleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(216, 183, 123, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.champagneGold,
    letterSpacing: 1.2,
  },
  heading: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textLight,
    lineHeight: 28,
    letterSpacing: 0.4,
  },
  subheading: {
    fontSize: 13,
    color: '#E8D4C4',
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 18,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: Colors.champagneGold,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
});

export default HeroBanner;
