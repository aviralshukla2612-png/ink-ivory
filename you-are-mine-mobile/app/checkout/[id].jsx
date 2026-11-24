// YOU ARE MINE — Checkout Route: /checkout/[id]
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import PublicationCheckoutScreen from '../../components/checkout/PublicationCheckoutScreen';

export default function CheckoutPage() {
  const { id } = useLocalSearchParams();
  return <PublicationCheckoutScreen draftId={id} />;
}
