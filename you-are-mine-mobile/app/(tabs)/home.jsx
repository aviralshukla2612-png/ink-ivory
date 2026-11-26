import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ChevronRight, Star } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { HeroBanner } from '../../components/home/HeroBanner';
import { OccasionCircles } from '../../components/home/OccasionCircles';
import { FeaturedSection } from '../../components/home/FeaturedSection';
import { TemplateCard } from '../../components/templates/TemplateCard';
import { Button } from '../../components/common/Button';
import { TemplatesService } from '../../services/templates.service';
import { useFavoritesStore } from '../../store/favorites.store';
import { RoyalLoadingScreen } from '../../components/common/RoyalLoadingScreen';

export default function HomeScreen() {
  const router = useRouter();
  const loadFavorites = useFavoritesStore((state) => state.loadFavorites);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const {
    data: templates = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['templates'],
    queryFn: TemplatesService.getTemplates,
  });

  const handleSelectOccasion = (occasion) => {
    router.push({
      pathname: '/(tabs)/explore',
      params: { category: occasion },
    });
  };

  const featuredTemplates = templates.slice(0, 5);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* 1. Hero Luxury Silk Banner */}
        <HeroBanner onCtaPress={() => router.push('/(tabs)/explore')} />

        {/* 2. Occasion Category Circles */}
        <OccasionCircles onSelectOccasion={handleSelectOccasion} />

        {/* 3. Loading State */}
        {isLoading && !isRefetching ? (
          <RoyalLoadingScreen
            fullScreen={false}
            title="ROYAL CATALOG"
            subtitle="CURATED DESIGNS"
            message="Discovering bespoke royal wedding templates..."
          />
        ) : isError ? (
          /* Error & Retry State */
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Unable to load templates</Text>
            <Text style={styles.errorSubtext}>{error?.message || 'Check connection'}</Text>
            <Button
              title="Retry Connection"
              onPress={() => refetch()}
              variant="outline"
              size="small"
              style={{ marginTop: 12 }}
            />
          </View>
        ) : (
          <>
            {/* 4. Curated Horizontal Featured Showcase */}
            <FeaturedSection
              templates={featuredTemplates}
              title="Featured Invitations"
              subtitle="Signature moving invitations with music"
              onSeeAll={() => router.push('/(tabs)/explore')}
            />

            {/* 5. Trending 2-Column Editorial Grid (Replaces repetitive second carousel) */}
            <View style={styles.gridSection}>
              <View style={styles.gridHeaderRow}>
                <View style={styles.gridTitleCol}>
                  <Text style={styles.gridTitle}>Trending Collections</Text>
                  <Text style={styles.gridSubtitle}>Designed for unforgettable moments</Text>
                </View>

                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/explore')}
                  activeOpacity={0.7}
                  style={styles.seeAllBtn}
                >
                  <Text style={styles.seeAllText}>See All</Text>
                  <ChevronRight size={14} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              {/* 2-Column Responsive Card Grid */}
              <View style={styles.twoColGrid}>
                {templates.map((tpl) => (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    isHorizontal={false}
                  />
                ))}
              </View>
            </View>

            {/* 6. Luxury Trust Badge */}
            <View style={styles.trustBanner}>
              <View style={styles.trustRow}>
                <Star size={13} color="#D8B77B" fill="#D8B77B" />
                <Text style={styles.trustText}>4.9/5 Rated by 500+ Couples across India</Text>
              </View>
              <Text style={styles.trustSubtext}>
                Instant WhatsApp sharing • Bespoke music library • Lifetime hosting
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  centerContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  errorContainer: {
    padding: 24,
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginVertical: 14,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  errorSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  gridSection: {
    marginTop: 10,
    marginBottom: 8,
  },
  gridHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  gridTitleCol: {
    flex: 1,
  },
  gridTitle: {
    fontFamily: 'serif',
    fontSize: 19,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  gridSubtitle: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  twoColGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  trustBanner: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(216, 183, 123, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(216, 183, 123, 0.35)',
    alignItems: 'center',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  trustText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6F5645',
    letterSpacing: 0.2,
  },
  trustSubtext: {
    fontSize: 10.5,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
