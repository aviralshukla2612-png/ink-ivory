import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { TemplateCard } from '../templates/TemplateCard';

export function FeaturedSection({
  templates = [],
  title = 'Featured Invitations',
  subtitle = 'Moving cards with live soundtracks',
  onSeeAll,
}) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        <TouchableOpacity
          onPress={onSeeAll || (() => router.push('/(tabs)/explore'))}
          activeOpacity={0.7}
          style={styles.seeAllBtn}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={14} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Horizontal Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
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
    marginTop: 6,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  titleCol: {
    flex: 1,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 19,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  subtitle: {
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
  scrollList: {
    paddingHorizontal: 16,
    gap: 12,
    alignItems: 'flex-start',
  },
  itemWrapper: {},
});

export default FeaturedSection;
