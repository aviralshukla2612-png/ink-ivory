import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(tabs)/home');
  }, []);

  return <View style={{ flex: 1, backgroundColor: '#07080B' }} />;
}
