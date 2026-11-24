import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Colors } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { HeroBanner } from '../../components/home/HeroBanner';
import { OccasionCircles } from '../../components/home/OccasionCircles';
import { FeaturedSection } from '../../components/home/FeaturedSection';
import { Button } from '../../components/common/Button';
import { TemplatesService } from '../../services/templates.service';
import { useFavoritesStore } from '../../store/favorites.store';

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

  const featuredTemplates = templates.slice(0, 4);
  const recommendedTemplates = templates.slice(2);

  return (
    <SafeAreaView style={styles.safeArea}>
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
        {/* Screen 3: Hero Banner */}
        <HeroBanner onCtaPress={() => router.push('/(tabs)/explore')} />

        {/* Screen 3: Occasion Categories (4 Circles) */}
        <OccasionCircles onSelectOccasion={handleSelectOccasion} />

        {/* Loading State */}
        {isLoading && !isRefetching ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading royal catalog...</Text>
          </View>
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
          /* Real Backend Template Carousels */
          <>
            <FeaturedSection
              templates={featuredTemplates}
              title="Featured Templates"
              onSeeAll={() => router.push('/(tabs)/explore')}
            />

            <FeaturedSection
              templates={recommendedTemplates}
              title="Recommended For You"
              onSeeAll={() => router.push('/(tabs)/explore')}
            />
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
    paddingBottom: 28,
  },
  centerContainer: {
    paddingVertical: 36,
    alignItems: 'center',
    gap: 10,
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
    textAlign: 'center',
  },
});
