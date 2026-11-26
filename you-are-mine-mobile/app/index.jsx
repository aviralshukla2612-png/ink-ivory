import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { RoyalLoadingScreen } from '../components/common/RoyalLoadingScreen';

export default function AppEntryScreen() {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === 'web') {
      router.replace('/(tabs)/home');
    }
  }, [router]);

  const handleFinished = () => {
    router.replace('/(tabs)/home');
  };

  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <RoyalLoadingScreen
      fullScreen={true}
      title="YOU ARE MINE"
      subtitle="DIGITAL INVITATIONS"
      message="Let's celebrate today and craft your bespoke royal invitation"
      onFinished={handleFinished}
    />
  );
}
