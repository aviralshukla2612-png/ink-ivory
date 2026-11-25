import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Colors } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { SearchBar } from '../../components/templates/SearchBar';
import { CategoryChip } from '../../components/templates/CategoryChip';
import { TemplateCard } from '../../components/templates/TemplateCard';
import { Button } from '../../components/common/Button';
import { TemplatesService } from '../../services/templates.service';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const initialCategory = params.category ? String(params.category) : 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

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

  // Client-side search and category filtering over real backend catalog
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      // 1. Category check
      if (selectedCategory !== 'All') {
        const tplOccasion = (tpl.occasion || '').toLowerCase();
        const selected = selectedCategory.toLowerCase();
        if (!tplOccasion.includes(selected)) {
          return false;
        }
      }

      // 2. Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = (tpl.title || '').toLowerCase().includes(query);
        const occasionMatch = (tpl.occasion || '').toLowerCase().includes(query);
        const tagMatch = Array.isArray(tpl.tags) && tpl.tags.some((t) => t.toLowerCase().includes(query));
        if (!titleMatch && !occasionMatch && !tagMatch) {
          return false;
        }
      }

      return true;
    });
  }, [templates, selectedCategory, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header: Explore Templates with Clean Transparent Vector Brand Mark */}
      <Header title="Explore Templates" showLogoWithTitle={true} showNotification={false} />

      {/* Screen 4: Search Input */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => setSelectedCategory('All')}
      />

      {/* Screen 4: Category Pills */}
      <CategoryChip
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 2-Column Template Grid */}
      {isLoading && !isRefetching ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading templates...</Text>
        </View>
      ) : isError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Could not load templates</Text>
          <Text style={styles.errorSubtext}>{error?.message || 'Check server connection'}</Text>
          <Button
            title="Retry"
            onPress={() => refetch()}
            variant="outline"
            size="small"
            style={{ marginTop: 12 }}
          />
        </View>
      ) : (
        <FlatList
          data={filteredTemplates}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          renderItem={({ item }) => <TemplateCard template={item} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No templates found</Text>
              <Text style={styles.emptySubtext}>
                No invitations match your selected filters. Try clearing your search.
              </Text>
              <Button
                title="Clear Filters"
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                variant="outline"
                size="small"
                style={{ marginTop: 14 }}
              />
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  errorContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
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
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptySubtext: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
