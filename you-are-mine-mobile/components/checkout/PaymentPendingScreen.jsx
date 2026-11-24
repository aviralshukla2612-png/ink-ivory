// YOU ARE MINE — PaymentPendingScreen Component
// Handles asynchronous pending payments and checks backend order reconciliation status.

import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Clock, RefreshCw, ArrowLeft, ShieldAlert } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { PaymentService } from '../../services/payments/payment.service';

export default function PaymentPendingScreen({ params: propParams }) {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const params = propParams || searchParams || {};

  const orderId = params.orderId || 'PENDING_ORDER';
  const draftId = params.draftId;
  const [checking, setChecking] = useState(false);

  const handleCheckStatus = async () => {
    try {
      setChecking(true);
      const res = await PaymentService.recoverPendingOrder(orderId);

      if (res?.isPaid && res?.isPublished) {
        router.replace({
          pathname: '/checkout/success',
          params: {
            slug: res.slug || 'celebration',
            invitationUrl: `https://youaremine.online/invite/${res.slug}`,
            orderId: orderId,
          },
        });
      } else if (res?.isPaid && !res?.isPublished) {
        Alert.alert(
          'Payment Confirmed',
          'Your payment was confirmed. The publication engine is finalizing your live link. Please check again in a few moments.'
        );
      } else {
        Alert.alert(
          'Still Processing',
          'The payment provider has not yet reported completion. Do not pay again; please wait a moment and tap Check Status.'
        );
      }
    } catch (err) {
      Alert.alert('Status Check', err.message || 'Unable to reach payment verification server.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Clock size={42} color={Colors.warning} />
        </View>

        <Text style={styles.tagline}>AUTHORIZATION IN PROGRESS</Text>
        <Text style={styles.mainTitle}>Payment Processing</Text>
        <Text style={styles.subtitle}>
          Your payment transaction reference <Text style={styles.orderIdText}>{orderId}</Text> is currently being confirmed by your payment provider.
        </Text>

        <View style={styles.warningCard}>
          <View style={styles.warningHeader}>
            <ShieldAlert size={16} color={Colors.warning} />
            <Text style={styles.warningTitle}>Do Not Pay Again</Text>
          </View>
          <Text style={styles.warningBody}>
            To protect your account from accidental duplicate billing, please do not start another payment. Our automated recovery engine monitors this transaction.
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.checkBtn, checking && styles.checkBtnDisabled]}
            onPress={handleCheckStatus}
            disabled={checking}
            activeOpacity={0.85}
          >
            {checking ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <RefreshCw size={16} color="#FFFFFF" />
                <Text style={styles.checkBtnText}>Check Payment Status</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.returnBtn}
            onPress={() => router.replace('/(tabs)/my-invitations')}
            activeOpacity={0.75}
          >
            <ArrowLeft size={16} color={Colors.textPrimary} />
            <Text style={styles.returnBtnText}>Go to My Invitations</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.warningBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 124, 0, 0.25)',
  },
  tagline: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.warning,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  mainTitle: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13.5,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  orderIdText: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  warningCard: {
    width: '100%',
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 124, 0, 0.3)',
    marginBottom: 32,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.warning,
  },
  warningBody: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  actionButtons: {
    width: '100%',
    gap: 12,
  },
  checkBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
  },
  checkBtnDisabled: {
    opacity: 0.6,
  },
  checkBtnText: {
    color: '#FFF9F2',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  returnBtn: {
    backgroundColor: Colors.cream,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  returnBtnText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});
