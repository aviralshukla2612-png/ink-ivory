// YOU ARE MINE — PaymentProcessingScreen Component
// Displays a calm, elegant animated state while payment verification is underway.

import React from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { Sparkles, ShieldCheck } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

export default function PaymentProcessingScreen({ message = 'Verifying your bespoke invitation payment...' }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.sealWrapper}>
          <View style={styles.sealGlow}>
            <View style={styles.innerSeal}>
              <Sparkles size={32} color={Colors.champagneGold} />
            </View>
          </View>
        </View>

        <ActivityIndicator size="large" color={Colors.primary} style={styles.spinner} />

        <Text style={styles.tagline}>TRANSACTION PROCESSING</Text>
        <Text style={styles.mainTitle}>{message}</Text>
        <Text style={styles.subText}>
          Please do not close this window or navigate away while we establish your official celebration publication.
        </Text>

        <View style={styles.trustBadge}>
          <ShieldCheck size={14} color={Colors.mutedGold} />
          <Text style={styles.trustText}>Official YOU ARE MINE Secure Publication Engine</Text>
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
    paddingHorizontal: 28,
  },
  sealWrapper: {
    marginBottom: 24,
  },
  sealGlow: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(216, 183, 123, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerSeal: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.champagneGold,
  },
  spinner: {
    marginBottom: 20,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.mutedGold,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  mainTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 30,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
