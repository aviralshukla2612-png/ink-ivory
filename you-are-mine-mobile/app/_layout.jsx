import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Platform, View, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { useAuthStore } from '../store/auth.store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 3, // 3 minutes
    },
  },
});

export default function RootLayout() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

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
          </View>
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webShell: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#1D0810' : Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  mobileContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 440 : '100%',
    height: '100%',
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
