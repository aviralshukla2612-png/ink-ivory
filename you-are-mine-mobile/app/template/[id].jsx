import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  Heart,
  ChevronLeft,
  LayoutGrid,
  Type,
  Music2,
  Share2,
  ArrowRight,
} from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Button } from '../../components/common/Button';
import { TemplatesService } from '../../services/templates.service';
import { useFavoritesStore } from '../../store/favorites.store';

const { width } = Dimensions.get('window');

const FEATURES = [
  { id: 'sections', label: 'Multiple\nSections', icon: LayoutGrid },
  { id: 'photos', label: 'Add Photos\n& Text', icon: Type },
  { id: 'music', label: 'Background\nMusic', icon: Music2 },
  { id: 'share', label: 'Easy\nShare', icon: Share2 },
];

export default function TemplateDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorited = isFavorite(String(id));

  const {
    data: template,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['template', id],
    queryFn: () => TemplatesService.getTemplateById(String(id)),
  });

  const handleCustomize = () => {
    // Navigate to native editor entry point
    router.push({
      pathname: '/editor/[id]',
      params: { id: template?.id || id },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading invitation details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !template) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>Template not found</Text>
          <Text style={styles.errorSubtext}>{error?.message || 'Unable to retrieve template'}</Text>
          <Button title="Go Back" onPress={() => router.back()} variant="outline" size="small" style={{ marginTop: 12 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => toggleFavorite(template.id)}
          activeOpacity={0.7}
        >
          <Heart
            size={20}
            color={favorited ? Colors.primary : Colors.textPrimary}
            fill={favorited ? Colors.primary : 'none'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Screen 5: Arched Large Artwork */}
        <View style={styles.artworkContainer}>
          <View style={styles.archOuter}>
            <Image
              source={{ uri: template.previewImageUrl }}
              style={styles.artworkImage}
              contentFit="cover"
              transition={300}
            />
            <View style={styles.artworkOverlay} />
          </View>
        </View>

        {/* Details Block */}
        <View style={styles.infoBlock}>
          {/* Title */}
          <Text style={styles.title}>{template.title}</Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>{template.priceDisplay || `₹${template.price || 299}`}</Text>
            {template.originalPriceINR || template.originalPrice ? (
              <Text style={styles.originalPrice}>₹{template.originalPriceINR || template.originalPrice}</Text>
            ) : null}
          </View>

          {/* Badges */}
          <View style={styles.badgesRow}>
            <View style={styles.occasionBadge}>
              <Text style={styles.occasionBadgeText}>{template.occasionBadge || 'Wedding'}</Text>
            </View>
            <View style={styles.tierBadge}>
              <Text style={styles.tierBadgeText}>{template.tierBadge || 'Premium'}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            {template.description ||
              'A traditional celebration invitation with elegant animations, regal typography and soundtrack music.'}
          </Text>

          {/* Screen 5: 4 Feature Icon Tiles */}
          <View style={styles.featuresGrid}>
            {FEATURES.map((item) => {
              const Icon = item.icon;
              return (
                <View key={item.id} style={styles.featureBox}>
                  <View style={styles.featureIconCircle}>
                    <Icon size={18} color={Colors.primary} strokeWidth={1.8} />
                  </View>
                  <Text style={styles.featureLabel}>{item.label}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Screen 5: Sticky Bottom CTA Button */}
      <View style={styles.bottomBar}>
        <Button
          title="Customize This Template"
          onPress={handleCustomize}
          variant="primary"
          size="large"
          style={styles.customizeButton}
          icon={<ArrowRight size={18} color={Colors.textLight} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  artworkContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 6,
    width: '100%',
  },
  archOuter: {
    width: '100%',
    maxWidth: 360,
    aspectRatio: 0.88,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.cream,
    borderWidth: 1.5,
    borderColor: Colors.champagneGold,
    elevation: 4,
    shadowColor: Colors.deepBurgundy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  artworkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  infoBlock: {
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 27,
    letterSpacing: 0.4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  originalPrice: {
    fontSize: 14,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  occasionBadge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  occasionBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tierBadge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(216, 183, 123, 0.2)',
    borderWidth: 1,
    borderColor: Colors.champagneGold,
  },
  tierBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginTop: 14,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
    gap: 8,
  },
  featureBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 14,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.divider,
    elevation: 8,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  customizeButton: {
    width: '100%',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  errorSubtext: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
