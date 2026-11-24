// YOU ARE MINE — PriceBreakdown Component
// Renders authoritative breakdown with base price, discounts, and total payable amount.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export default function PriceBreakdown({ quote }) {
  const basePriceFormatted = quote?.formattedBase || '₹299';
  const discountFormatted = quote?.formattedDiscount || null;
  const finalPriceFormatted = quote?.formattedFinal || '₹299';
  const hasDiscount = !!quote?.discountPaise && quote?.discountPaise > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>PAYMENT BREAKDOWN</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Digital Invitation Publication</Text>
        <Text style={styles.value}>{basePriceFormatted}</Text>
      </View>

      {hasDiscount ? (
        <View style={styles.row}>
          <View style={styles.discountLabelRow}>
            <Text style={styles.discountLabel}>Coupon Discount</Text>
            {quote?.couponApplied ? (
              <View style={styles.couponTag}>
                <Text style={styles.couponTagText}>{quote.couponApplied}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.discountValue}>-{discountFormatted}</Text>
        </View>
      ) : null}

      <View style={styles.row}>
        <Text style={styles.label}>Cloud Hosting & SSL Security</Text>
        <Text style={styles.freeValue}>INCLUDED</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Taxes & GST</Text>
        <Text style={styles.freeValue}>INCLUDED</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <View>
          <Text style={styles.totalLabel}>Total Payable Amount</Text>
          <Text style={styles.totalSub}>One-time fee • No recurring charge</Text>
        </View>
        <Text style={styles.totalValue}>{finalPriceFormatted}</Text>
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
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: Colors.textPrimary,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  discountLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  discountLabel: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '500',
  },
  couponTag: {
    backgroundColor: Colors.successBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  couponTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
  },
  discountValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.success,
  },
  freeValue: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.mutedGold,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'serif',
  },
  totalSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'serif',
  },
});
