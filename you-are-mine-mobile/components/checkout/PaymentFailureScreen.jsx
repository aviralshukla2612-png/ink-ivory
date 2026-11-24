// YOU ARE MINE — PaymentFailureScreen Component
// Displays clear failure explanation and offers safe retry without creating duplicate orders.

import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

export default function PaymentFailureScreen({ params: propParams }) {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const params = propParams || searchParams || {};

  const errorMessage = params.errorMessage || 'The transaction could not be completed.';
  const draftId = params.draftId;

  const handleRetry = () => {
    if (draftId) {
      router.replace(`/checkout/${draftId}`);
    } else {
      router.back();
    }
  };

  const handleBackToPreview = () => {
    if (draftId) {
      router.replace(`/preview/${draftId}`);
    } else {
      router.replace('/(tabs)/my-invitations');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <AlertCircle size={42} color={Colors.error} />
        </View>

        <Text style={styles.tagline}>CHECKOUT NOTICE</Text>
        <Text style={styles.mainTitle}>Payment Incomplete</Text>
        <Text style={styles.errorDescription}>{errorMessage}</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>No Charges Incurred</Text>
          <Text style={styles.infoBody}>
            If your account was debited, your bank will automatically reverse the hold. Your invitation draft remains completely safe in your studio.
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.retryBtn} onPress={handleRetry} activeOpacity={0.85}>
            <RefreshCw size={16} color="#FFF9F2" />
            <Text style={styles.retryBtnText}>Retry Checkout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.returnBtn} onPress={handleBackToPreview} activeOpacity={0.75}>
            <ArrowLeft size={16} color={Colors.textPrimary} />
            <Text style={styles.returnBtnText}>Return to Preview</Text>
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
    backgroundColor: Colors.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(198, 40, 40, 0.2)',
  },
  tagline: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.error,
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
  errorDescription: {
    fontSize: 13.5,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  infoBody: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  actionButtons: {
    width: '100%',
    gap: 12,
  },
  retryBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
  },
  retryBtnText: {
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
