// YOU ARE MINE — PaymentMethodSelector Component
// Displays platform-compliant payment method options based on distribution channel.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { CreditCard, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

export default function PaymentMethodSelector({ providers, selectedProviderId, onSelectProvider }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>PAYMENT METHOD & COMPLIANCE</Text>

      <View style={styles.methodsList}>
        {providers.map((p) => {
          const isSelected = p.id === selectedProviderId;

          return (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.methodCard,
                isSelected && styles.methodCardSelected,
                !p.isAvailable && styles.methodCardUnavailable,
              ]}
              onPress={() => onSelectProvider(p.id)}
              disabled={!p.isAvailable}
              activeOpacity={0.8}
            >
              <View style={styles.methodHeader}>
                <View style={styles.iconCircle}>
                  {p.id === 'razorpay' ? (
                    <CreditCard size={18} color={Colors.primary} />
                  ) : p.id === 'google_play' ? (
                    <Smartphone size={18} color={Colors.primary} />
                  ) : (
                    <ShieldCheck size={18} color={Colors.primary} />
                  )}
                </View>

                <View style={styles.methodTitleCol}>
                  <View style={styles.titleRow}>
                    <Text style={styles.methodName}>{p.name}</Text>
                    {p.badge ? (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{p.badge}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.methodSubtitle}>{p.subtitle}</Text>
                </View>

                <View style={styles.checkCol}>
                  {isSelected ? (
                    <CheckCircle2 size={20} color={Colors.primary} />
                  ) : (
                    <View style={styles.radioOutline} />
                  )}
                </View>
              </View>

              <Text style={styles.policyNote}>• {p.policyNote}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 12,
  },
  methodsList: {
    gap: 10,
  },
  methodCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  methodCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FAF5ED',
  },
  methodCardUnavailable: {
    opacity: 0.5,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodTitleCol: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  badge: {
    backgroundColor: Colors.blush,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
  },
  methodSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  checkCol: {
    marginLeft: 8,
  },
  radioOutline: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  policyNote: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
