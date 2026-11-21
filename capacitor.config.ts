import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.youaremine.app',
  appName: 'YOU ARE MINE',
  webDir: 'public',
  server: {
    // Allows loading live Next.js SSR & API endpoints with native Android bridge
    url: process.env.CAPACITOR_SERVER_URL || 'https://youaremine.online',
    cleartext: false,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#14110E',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#C69A50',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#14110E',
      overlaysWebView: false,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
