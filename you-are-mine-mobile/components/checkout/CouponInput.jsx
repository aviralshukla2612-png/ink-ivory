// YOU ARE MINE — CouponInput Component
// Handles authoritative coupon validation via server-side pricing quote.

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Tag, Check, X } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

export default function CouponInput({ appliedCoupon, onApplyCoupon, onRemoveCoupon, loading }) {
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    setErrorMsg(null);
    try {
      await onApplyCoupon(code.trim().toUpperCase());
      setCode('');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired promotional code.');
    }
  };

  const handleRemove = () => {
    setErrorMsg(null);
    onRemoveCoupon();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>PROMOTIONAL COUPON</Text>

      {appliedCoupon ? (
        <View style={styles.appliedBanner}>
          <View style={styles.appliedLeft}>
            <View style={styles.checkCircle}>
              <Check size={12} color="#FFFFFF" strokeWidth={3} />
            </View>
            <View>
              <Text style={styles.appliedCode}>{appliedCoupon}</Text>
              <Text style={styles.appliedSub}>Authoritative discount applied</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleRemove} style={styles.removeBtn} activeOpacity={0.7}>
            <X size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Tag size={16} color={Colors.mutedGold} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter coupon code (e.g. YOUMINE50)"
                placeholderTextColor={Colors.textSecondary}
                value={code}
                onChangeText={(text) => {
                  setCode(text.toUpperCase());
                  if (errorMsg) setErrorMsg(null);
                }}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[styles.applyBtn, (!code.trim() || loading) && styles.applyBtnDisabled]}
              onPress={handleApply}
              disabled={!code.trim() || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.applyBtnText}>APPLY</Text>
              )}
            </TouchableOpacity>
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
        </View>
      )}
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnDisabled: {
    opacity: 0.5,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  appliedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.successBg,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.25)',
  },
  appliedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appliedCode: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.success,
    letterSpacing: 0.5,
  },
  appliedSub: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  removeBtn: {
    padding: 6,
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.error,
    fontWeight: '500',
  },
});
