// YOU ARE MINE — PublicationCheckoutScreen Component
// Master Checkout Screen with server quotes, coupon application, and platform-compliant payment launch.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Shield } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { PaymentService } from '../../services/payments/payment.service';
import { PaymentProviderFactory } from '../../services/payments/payment-provider.factory';
import { DraftsService } from '../../services/drafts.service';
import { TemplatesService } from '../../services/templates.service';
import { useAuthStore } from '../../store/auth.store';

import OrderSummaryCard from './OrderSummaryCard';
import PriceBreakdown from './PriceBreakdown';
import CouponInput from './CouponInput';
import PaymentMethodSelector from './PaymentMethodSelector';
import CheckoutFooter from './CheckoutFooter';

export default function PublicationCheckoutScreen({ draftId }) {
  const router = useRouter();
  const customer = useAuthStore((state) => state.customer);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  const [draft, setDraft] = useState(null);
  const [template, setTemplate] = useState(null);
  const [quote, setQuote] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const providers = PaymentProviderFactory.getAvailableProviders();
  const primaryProvider = PaymentProviderFactory.getPrimaryProvider();
  const [selectedProviderId, setSelectedProviderId] = useState(primaryProvider.providerId);

  // Initialize checkout by loading draft, template, and authoritative quote
  useEffect(() => {
    let isMounted = true;

    async function initializeCheckout() {
      if (!draftId) {
        Alert.alert('Error', 'Invalid draft ID for checkout.');
        router.back();
        return;
      }

      try {
        setLoading(true);

        // 1. Fetch Draft
        const draftData = await DraftsService.getDraft(draftId);
        if (!draftData) {
          throw new Error('Draft not found or unauthorized.');
        }

        // 2. Fetch Template Metadata
        let templateData = null;
        try {
          const templates = await TemplatesService.getTemplates();
          templateData = templates.find((t) => t.id === draftData.templateId);
        } catch (tErr) {
          console.warn('Template fetch warning:', tErr);
        }

        // 3. Fetch Server Quote
        const quoteRes = await PaymentService.getQuote(draftId);

        if (isMounted) {
          setDraft(draftData);
          setTemplate(templateData);
          setQuote(quoteRes?.quote || {
            basePricePaise: 29900,
            finalPricePaise: 29900,
            formattedBase: '₹299',
            formattedFinal: '₹299',
          });
        }
      } catch (err) {
        Alert.alert('Checkout Initialization Error', err.message || 'Unable to open checkout for this draft.', [
          { text: 'Return', onPress: () => router.back() },
        ]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initializeCheckout();

    return () => {
      isMounted = false;
    };
  }, [draftId]);

  // Handle Coupon Application
  const handleApplyCoupon = async (couponCode) => {
    try {
      setCouponLoading(true);
      const res = await PaymentService.getQuote(draftId, couponCode);
      if (res?.quote) {
        setQuote(res.quote);
        setAppliedCoupon(couponCode);
      }
    } catch (err) {
      throw err;
    } finally {
      setCouponLoading(false);
    }
  };

  // Handle Coupon Removal
  const handleRemoveCoupon = async () => {
    try {
      setCouponLoading(true);
      const res = await PaymentService.getQuote(draftId, null);
      if (res?.quote) {
        setQuote(res.quote);
        setAppliedCoupon(null);
      }
    } catch (err) {
      console.warn('Failed to reset quote:', err);
    } finally {
      setCouponLoading(false);
    }
  };

  // Handle Publish & Pay Execution
  const handlePublishAndPay = async () => {
    if (submitting) return; // Prevent double taps

    const providerObj = PaymentProviderFactory.getProviderById(selectedProviderId);
    if (!providerObj || !providerObj.isAvailable()) {
      Alert.alert(
        'Platform Provider Notice',
        `The ${providerObj?.displayName || 'selected payment provider'} is currently not active in this development runtime. You can complete publication using the web checkout at youaremine.online or contact concierge support.`
      );
      return;
    }

    try {
      setSubmitting(true);

      // 1. Create or retrieve active payment order
      const orderRes = await PaymentService.createOrder(draftId, appliedCoupon, selectedProviderId);

      // 2. Launch Native Payment SDK
      const paymentResult = await providerObj.launchPayment(
        {
          orderId: orderRes.orderId,
          amount: orderRes.amount,
          key: orderRes.key,
          currency: orderRes.currency || 'INR',
          draftTitle: draft?.title || 'Celebration Invitation',
        },
        customer || {}
      );

      // 3. Server Verification & Atomic Publication Activation
      const verifyRes = await PaymentService.verifyPayment({
        orderId: orderRes.orderId,
        paymentId: paymentResult.paymentId || `pay_${Date.now()}`,
        signature: paymentResult.signature || '',
        provider: selectedProviderId,
      });

      if (verifyRes?.success) {
        // Navigate to Success Screen
        router.replace({
          pathname: '/checkout/success',
          params: {
            slug: verifyRes.slug || 'celebration',
            invitationUrl: verifyRes.invitationUrl || `https://youaremine.online/invite/${verifyRes.slug}`,
            title: draft?.title || 'Bespoke Invitation',
            orderId: orderRes.orderId,
          },
        });
      } else {
        throw new Error(verifyRes?.error || 'Verification completed with uncertain status.');
      }
    } catch (err) {
      if (err.message === 'PAYMENT_CANCELLED_BY_USER') {
        // Customer dismissed modal / cancelled; don't show scary error
        return;
      }

      router.push({
        pathname: '/checkout/failure',
        params: {
          errorMessage: err.message || 'Payment or verification was interrupted.',
          draftId: draftId,
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading bespoke invitation quote...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={submitting}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout & Publish</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Order Summary Card */}
        <OrderSummaryCard draft={draft} template={template} quote={quote} />

        {/* Coupon Input */}
        <CouponInput
          appliedCoupon={appliedCoupon}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={handleRemoveCoupon}
          loading={couponLoading}
        />

        {/* Payment Method Selector */}
        <PaymentMethodSelector
          providers={providers}
          selectedProviderId={selectedProviderId}
          onSelectProvider={(id) => setSelectedProviderId(id)}
        />

        {/* Price Breakdown */}
        <PriceBreakdown quote={quote} />

        {/* Trust Badges */}
        <View style={styles.trustRow}>
          <Shield size={14} color={Colors.mutedGold} />
          <Text style={styles.trustText}>Official YOU ARE MINE Digital Guarantee</Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Footer */}
      <CheckoutFooter
        finalAmount={quote?.formattedFinal}
        onPublishAndPay={handlePublishAndPay}
        loading={submitting}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'serif',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerRightPlaceholder: {
    width: 38,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
    marginBottom: 10,
  },
  trustText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
