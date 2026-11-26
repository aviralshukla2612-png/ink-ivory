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
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  item: {
    alignItems: 'center',
    width: '23%',
  },
  circle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFF9F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.goldLight,
    elevation: 2,
    shadowColor: Colors.deepBurgundy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    marginBottom: 6,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});

export default OccasionCircles;
