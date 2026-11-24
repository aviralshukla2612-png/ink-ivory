import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { TemplateCard } from '../templates/TemplateCard';

export function FeaturedSection({ templates = [], title = 'Featured Templates', onSeeAll }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          onPress={onSeeAll || (() => router.push('/(tabs)/explore'))}
          activeOpacity={0.7}
          style={styles.seeAllBtn}
        >
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {templates.map((tpl) => (
          <View key={tpl.id} style={styles.itemWrapper}>
            <TemplateCard template={tpl} isHorizontal />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  seeAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  scrollList: {
    paddingHorizontal: 16,
    gap: 14,
  },
  itemWrapper: {
    marginRight: 4,
  },
});

export default FeaturedSection;
