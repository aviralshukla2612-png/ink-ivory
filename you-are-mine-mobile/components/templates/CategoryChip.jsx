import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export const OCCASION_CATEGORIES = [
  'All',
  'Wedding',
  'Birthday',
  'Anniversary',
  'Proposal',
  'Engagement',
];

export function CategoryChip({
  categories = OCCASION_CATEGORIES,
  selectedCategory = 'All',
  onSelectCategory,
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      {categories.map((cat) => {
        const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
        return (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, isSelected ? styles.activeChip : styles.inactiveChip]}
            onPress={() => onSelectCategory(cat)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.chipText,
                isSelected ? styles.activeChipText : styles.inactiveChipText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    flexGrow: 0,
    height: 46,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  chip: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  activeChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.deepBurgundy,
  },
  inactiveChip: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeChipText: {
    color: Colors.textLight,
  },
  inactiveChipText: {
    color: Colors.textPrimary,
  },
});

export default CategoryChip;
