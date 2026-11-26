import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Platform, View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { Colors } from '../constants/colors';
import { useAuthStore } from '../store/auth.store';
import { RoyalLoadingScreen } from '../components/common/RoyalLoadingScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 3, // 3 minutes
    },
  },
});

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  // Bundle and register all approved fonts locally
  const [fontsLoaded] = useFonts({
    'GreatVibes': require('../assets/fonts/GreatVibes-Regular.ttf'),
    'Baloo2-Medium': require('../assets/fonts/Baloo2-Medium.ttf'),
    'Baloo2-SemiBold': require('../assets/fonts/Baloo2-SemiBold.ttf'),
    'Baloo2-Bold': require('../assets/fonts/Baloo2-Bold.ttf'),
    'CormorantGaramond-Regular': require('../assets/fonts/CormorantGaramond-Regular.ttf'),
    'CormorantGaramond-SemiBold': require('../assets/fonts/CormorantGaramond-SemiBold.ttf'),
    'CormorantGaramond-Bold': require('../assets/fonts/CormorantGaramond-Bold.ttf'),
    'CinzelDecorative-Bold': require('../assets/fonts/CinzelDecorative-Bold.ttf'),
    'PlayfairDisplay-Regular': require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
    'PlayfairDisplay-Bold': require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
  });

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (preloaderDone && (fontsLoaded || Platform.OS === 'web')) {
      setAppReady(true);
    }
  }, [preloaderDone, fontsLoaded]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" backgroundColor={Colors.background} />
        <View style={styles.webShell}>
          <View style={styles.mobileContainer}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.background },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false, presentation: 'modal' }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="template/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="editor/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="preview/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="checkout/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="checkout/success" options={{ headerShown: false }} />
              <Stack.Screen name="checkout/failure" options={{ headerShown: false }} />
              <Stack.Screen name="checkout/pending" options={{ headerShown: false }} />
              <Stack.Screen name="checkout/processing" options={{ headerShown: false }} />
            </Stack>

            {/* Zarvion-Style Royal Preloader (0 → 100 Counting Screen) */}
            {!appReady && Platform.OS !== 'web' && (
              <View style={StyleSheet.absoluteFillObject}>
                <RoyalLoadingScreen
                  fullScreen={true}
                  title="YOU ARE MINE"
                  subtitle="DIGITAL INVITATIONS"
                  message="Let's celebrate today and craft your bespoke royal invitation"
                  onFinished={() => setPreloaderDone(true)}
                />
              </View>
            )}
          </View>
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webShell: {
    flex: 1,
    width: '100%',
    height: Platform.OS === 'web' ? '100vh' : '100%',
    backgroundColor: Platform.OS === 'web' ? '#1D0810' : Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 440 : '100%',
    height: '100%',
    maxHeight: Platform.OS === 'web' ? '100vh' : undefined,
    backgroundColor: Colors.background,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#4A1725',
  },
});
