// API & Environment Configuration for YOU ARE MINE Mobile Client
import { Platform } from 'react-native';
import Constants from 'expo-constants';

function getDevApiBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // When running on physical device via Expo Go, dynamically resolve computer's LAN IP
  const host =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.debuggerHost;

  if (host) {
    const ip = host.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:3000`;
    }
  }

  // Check linkingUri if present (e.g. exp://192.168.1.6:8081)
  if (Constants.linkingUri) {
    const match = Constants.linkingUri.match(/^[a-z]+:\/\/([^:/]+)/i);
    if (match && match[1] && match[1] !== 'localhost' && match[1] !== '127.0.0.1') {
      return `http://${match[1]}:3000`;
    }
  }

  // On physical mobile devices, localhost points to the phone itself, so use dev computer's LAN IP
  if (Platform.OS !== 'web') {
    return 'http://192.168.1.6:3000';
  }

  return 'http://localhost:3000';
}

export const Config = {
  // Point to local Next.js server in development; can be configured via environment
  API_BASE_URL: getDevApiBaseUrl(),
  APP_NAME: 'YOU ARE MINE',
  TAGLINE: "Digital Invitations for Life's Special Moments",
  
  // Build-time immutable distribution channel: 'PLAY_STORE' | 'DIRECT_APK' | 'APP_STORE' | 'WEB'
  DISTRIBUTION_CHANNEL:
    process.env.EXPO_PUBLIC_DISTRIBUTION_CHANNEL ||
    (Platform.OS === 'ios' ? 'APP_STORE' : (Platform.OS === 'web' ? 'WEB' : 'PLAY_STORE')),

  STORAGE_KEYS: {
    GUEST_TOKEN: 'yam_guest_token',
    CUSTOMER_SESSION: 'yam_customer_session',
    ONBOARDING_COMPLETED: 'yam_onboarding_completed',
  },
  DEFAULT_CUSTOMER: {
    name: 'Srajan Shukla',
    phone: '+91 98765 43210',
    email: 'customer@youaremine.online',
  },
};

export default Config;
