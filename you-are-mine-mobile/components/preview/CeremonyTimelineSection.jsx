import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles, Calendar, Clock, MapPin } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

/**
 * CeremonyTimelineSection
 * Renders the wedding ceremony itinerary inside full-screen preview.
 */
export function CeremonyTimelineSection({ sections = [] }) {
  if (!sections || sections.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Sparkles size={16} color={Colors.gold} />
        <Text style={styles.title}>CEREMONY CELEBRATIONS</Text>
        <Sparkles size={16} color={Colors.gold} />
      </View>

      <View style={styles.timelineList}>
        {sections.map((item, index) => {
          const isLast = index === sections.length - 1;

          return (
            <View key={item.id || index} style={styles.eventRow}>
              {/* Timeline Indicator Column */}
              <View style={styles.indicatorCol}>
                <View style={styles.goldDot} />
                {!isLast && <View style={styles.verticalLine} />}
              </View>

              {/* Event Content Card */}
              <View style={styles.eventCard}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                
                <View style={styles.metaRow}>
                  <Calendar size={12} color={Colors.primary} style={styles.metaIcon} />
                  <Text style={styles.metaText}>{item.date || 'Celebration Day'}</Text>
                  
                  {item.time ? (
                    <>
                      <Text style={styles.metaDivider}>•</Text>
                      <Clock size={12} color={Colors.primary} style={styles.metaIcon} />
                      <Text style={styles.metaText}>{item.time}</Text>
                    </>
                  ) : null}
                </View>

                {item.venue ? (
                  <View style={styles.venueRow}>
                    <MapPin size={12} color={Colors.gold} style={styles.metaIcon} />
                    <Text style={styles.venueText}>{item.venue}</Text>
                  </View>
                ) : null}

                {item.description ? (
                  <Text style={styles.descriptionText}>{item.description}</Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 18,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 2,
  },
  timelineList: {
    paddingLeft: 4,
  },
  eventRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  indicatorCol: {
    width: 24,
    alignItems: 'center',
  },
  goldDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.gold,
    borderWidth: 2,
    borderColor: '#FAF5EE',
    marginTop: 4,
  },
  verticalLine: {
    flex: 1,
    width: 2,
    backgroundColor: 'rgba(216, 183, 123, 0.45)',
    marginVertical: 4,
  },
  eventCard: {
    flex: 1,
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(216, 183, 123, 0.35)',
    marginLeft: 8,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  eventTitle: {
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  metaDivider: {
    marginHorizontal: 6,
    color: Colors.gold,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  venueText: {
    fontSize: 11.5,
    color: '#8D6B4F',
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 6,
    lineHeight: 16,
  },
});

export default CeremonyTimelineSection;
