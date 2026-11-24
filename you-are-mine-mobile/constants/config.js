// API & Environment Configuration for YOU ARE MINE Mobile Client
import { Platform } from 'react-native';

export const Config = {
  // Point to local Next.js server in development; can be configured via environment
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
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
