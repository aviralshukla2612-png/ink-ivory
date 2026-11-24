import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, Gift, Calendar, Sparkles } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

const OCCASIONS = [
  { id: 'wedding', label: 'Wedding', icon: Sparkles },
  { id: 'birthday', label: 'Birthday', icon: Gift },
  { id: 'proposal', label: 'Proposal', icon: Heart },
  { id: 'anniversary', label: 'Anniversary', icon: Calendar },
];

export function OccasionCircles({ onSelectOccasion }) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {OCCASIONS.map((occ) => {
          const Icon = occ.icon;
          return (
            <TouchableOpacity
              key={occ.id}
              style={styles.item}
              onPress={() => onSelectOccasion(occ.label)}
              activeOpacity={0.7}
            >
              <View style={styles.circle}>
                <Icon size={20} color={Colors.primary} strokeWidth={1.8} />
              </View>
              <Text style={styles.label}>{occ.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginVertical: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    gap: 8,
  },
  circle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: Colors.deepBurgundy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
});

export default OccasionCircles;
