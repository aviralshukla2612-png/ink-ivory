import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
        </Stack>

      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
