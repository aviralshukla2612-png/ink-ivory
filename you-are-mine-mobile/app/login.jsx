import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, ShieldCheck, ArrowRight, X } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { Button } from '../components/common/Button';
import { LotusLogo } from '../components/common/LotusLogo';
import { useAuthStore } from '../store/auth.store';

export default function LoginScreen() {
  const router = useRouter();
  const { requestOtp, confirmOtp } = useAuthStore();

  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSendOtp = async () => {
    const cleaned = phoneNumber.replace(/\D/g, '').slice(-10);
    if (cleaned.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      setLoading(true);
      setStatusMessage('');
      const res = await requestOtp(cleaned, 'Customer');
      setStep('otp');
      setStatusMessage(res.message || `OTP dispatched to +91 ${cleaned}`);
    } catch (err) {
      Alert.alert('Notice', err.message || 'Failed to dispatch OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Incomplete OTP', 'Please enter the 4-digit verification code.');
      return;
    }

    try {
      setLoading(true);
      await confirmOtp(phoneNumber, otp);
      Alert.alert('Verified', 'Welcome to YOU ARE MINE!', [
        { text: 'Continue', onPress: () => router.replace('/(tabs)/home') },
      ]);
    } catch (err) {
      Alert.alert('Verification Failed', err.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header Dismiss Bar */}
        <View style={styles.topBar}>
          <View style={{ width: 36 }} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.replace('/(tabs)/home')}
            activeOpacity={0.7}
          >
            <X size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Brand Lotus Logo */}
          <View style={styles.logoContainer}>
            <LotusLogo size={42} color={Colors.champagneGold} />
            <Text style={styles.brandTitle}>YOU ARE MINE</Text>
            <Text style={styles.brandTagline}>Sign In with Mobile OTP</Text>
          </View>

          {step === 'phone' ? (
            /* STEP 1: Enter Phone Number */
            <View style={styles.formContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.inputRow}>
                <View style={styles.prefixBox}>
                  <Text style={styles.prefixText}>🇮🇳 +91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Enter 10-digit number"
                  placeholderTextColor="#A89B92"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  autoFocus
                />
              </View>
              <Text style={styles.helperText}>
                We will send an official DLT OTP via SMS to verify your account.
              </Text>

              <Button
                title="Get Verification Code"
                onPress={handleSendOtp}
                loading={loading}
                variant="primary"
                size="large"
                style={styles.actionBtn}
                icon={<ArrowRight size={18} color={Colors.textLight} />}
              />
            </View>
          ) : (
            /* STEP 2: Enter 4-Digit OTP */
            <View style={styles.formContainer}>
              <Text style={styles.label}>Enter 4-Digit Verification Code</Text>
              <View style={styles.otpInputBox}>
                <TextInput
                  style={styles.otpInput}
                  placeholder="• • • •"
                  placeholderTextColor="#A89B92"
                  keyboardType="number-pad"
                  maxLength={4}
                  value={otp}
                  onChangeText={setOtp}
                  autoFocus
                />
              </View>

              {statusMessage ? (
                <Text style={styles.successNotice}>{statusMessage}</Text>
              ) : null}

              <Button
                title="Verify & Enter"
                onPress={handleVerifyOtp}
                loading={loading}
                variant="primary"
                size="large"
                style={styles.actionBtn}
                icon={<ShieldCheck size={18} color={Colors.textLight} />}
              />

              <TouchableOpacity
                onPress={() => setStep('phone')}
                style={styles.changeNumberBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.changeNumberText}>Edit Phone Number</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Continue as Guest Fallback */}
          <TouchableOpacity
            style={styles.guestButton}
            onPress={() => router.replace('/(tabs)/home')}
            activeOpacity={0.7}
          >
            <Text style={styles.guestText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  brandTitle: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 3.5,
    marginTop: 14,
  },
  brandTagline: {
    fontSize: 13,
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginTop: 6,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  prefixBox: {
    paddingHorizontal: 14,
    height: '100%',
    backgroundColor: Colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  prefixText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 14,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
    lineHeight: 17,
  },
  actionBtn: {
    marginTop: 24,
    width: '100%',
  },
  otpInputBox: {
    height: 60,
    borderWidth: 1.5,
    borderColor: Colors.champagneGold,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInput: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 12,
    textAlign: 'center',
    width: '100%',
  },
  successNotice: {
    fontSize: 13,
    color: Colors.success,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  changeNumberBtn: {
    marginTop: 16,
    alignSelf: 'center',
    paddingVertical: 6,
  },
  changeNumberText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  guestButton: {
    marginTop: 28,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  guestText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
