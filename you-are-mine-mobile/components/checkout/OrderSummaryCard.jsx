// YOU ARE MINE — OrderSummaryCard Component
// Displays luxurious invitation cover, couple names, template title, and bespoke features.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Sparkles, Globe, Music, Users, ShieldCheck } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

export default function OrderSummaryCard({ draft, template, quote }) {
  const fields = draft?.fields || {};
  const coupleNames = fields.names || draft?.title || 'Karthik & Meenakshi';
  const occasion = template?.occasion || 'Wedding';
  const templateTitle = template?.title || 'Royal Palace Celebration';
  const coverImage =
    template?.previewImage ||
    fields.couple_photo ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80';

  return (
    <View style={styles.card}>
      {/* Decorative Golden Corner Accents */}
      <View style={styles.goldCornerTL} />
      <View style={styles.goldCornerTR} />

      <View style={styles.topRow}>
        <View style={styles.thumbnailWrapper}>
          <Image source={{ uri: coverImage }} style={styles.thumbnail} contentFit="cover" />
          <View style={styles.thumbnailBorder} />
        </View>

        <View style={styles.infoCol}>
          <View style={styles.badgeRow}>
            <View style={styles.occasionBadge}>
              <Text style={styles.occasionText}>{occasion.toUpperCase()}</Text>
            </View>
            <View style={styles.bespokeBadge}>
              <Sparkles size={11} color={Colors.champagneGold} />
              <Text style={styles.bespokeText}>BESPOKE</Text>
            </View>
          </View>

          <Text style={styles.coupleNames} numberOfLines={2}>
            {coupleNames}
          </Text>
          <Text style={styles.templateTitle} numberOfLines={1}>
            {templateTitle}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Included Publication Features */}
      <View style={styles.featuresList}>
        <View style={styles.featureItem}>
          <Globe size={14} color={Colors.primary} />
          <Text style={styles.featureText}>Custom Public Web Link</Text>
        </View>
        <View style={styles.featureItem}>
          <Music size={14} color={Colors.primary} />
          <Text style={styles.featureText}>Background Audio Stream</Text>
        </View>
        <View style={styles.featureItem}>
          <Users size={14} color={Colors.primary} />
          <Text style={styles.featureText}>Digital RSVP Attendance</Text>
        </View>
        <View style={styles.featureItem}>
          <ShieldCheck size={14} color={Colors.primary} />
          <Text style={styles.featureText}>1-Year High-Speed Hosting</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFDF9',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(216, 183, 123, 0.45)', // Soft champagne gold border
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    position: 'relative',
  },
  goldCornerTL: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 14,
    height: 14,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: Colors.champagneGold,
  },
  goldCornerTR: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 14,
    height: 14,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: Colors.champagneGold,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnailWrapper: {
    width: 76,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },
  infoCol: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  occasionBadge: {
    backgroundColor: Colors.blush,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  occasionText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  bespokeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: Colors.champagneGold,
    gap: 3,
  },
  bespokeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  coupleNames: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 4,
  },
  templateTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'serif',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 14,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
    gap: 6,
  },
  featureText: {
    fontSize: 11,
    color: Colors.textPrimary,
  },
});
