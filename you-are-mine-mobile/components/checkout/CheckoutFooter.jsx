// YOU ARE MINE — CheckoutFooter Component
// Sticky bottom CTA bar with secure encryption assurances and primary Pay button.

import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Lock, Sparkles } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

export default function CheckoutFooter({ finalAmount, onPublishAndPay, loading }) {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.securityRow}>
        <Lock size={12} color={Colors.mutedGold} />
        <Text style={styles.securityText}>256-Bit SSL Encryption • Instant Official Publication</Text>
      </View>

      <View style={styles.actionRow}>
        <View style={styles.amountCol}>
          <Text style={styles.totalDueText}>TOTAL DUE</Text>
          <Text style={styles.finalAmountText}>{finalAmount || '₹299'}</Text>
        </View>

        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={onPublishAndPay}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.champagneGold} />
          ) : (
            <View style={styles.payButtonContent}>
              <Sparkles size={16} color={Colors.champagneGold} />
              <Text style={styles.payButtonText}>Publish & Pay</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 10,
  },
  securityText: {
    fontSize: 10.5,
    color: Colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountCol: {
    justifyContent: 'center',
  },
  totalDueText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  finalAmountText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'serif',
  },
  payButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 14,
    minWidth: 180,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payButtonText: {
    color: '#FFF9F2',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
