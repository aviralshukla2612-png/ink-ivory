'use client';

import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Share } from '@capacitor/share';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Network } from '@capacitor/network';
import { PushNotifications } from '@capacitor/push-notifications';

export const isNativePlatform = () => {
  return typeof window !== 'undefined' && Capacitor.isNativePlatform();
};

export const isAndroid = () => {
  return typeof window !== 'undefined' && Capacitor.getPlatform() === 'android';
};

/**
 * Initializes Android native hardware features, safe areas, status bar and back button listener.
 */
export async function initializeNativeApp(handlers?: {
  onBackPress?: () => boolean | void;
  onNetworkChange?: (connected: boolean) => void;
}) {
  if (!isNativePlatform()) return;

  try {
    // 1. Hide Splash Screen smoothly once React hydration finishes
    await SplashScreen.hide();

    // 2. Set Status Bar aesthetic to luxury dark theme matching brand
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#14110E' });

    // 3. Android Hardware Back Button listener
    App.addListener('backButton', ({ canGoBack }) => {
      if (handlers?.onBackPress) {
        const handled = handlers.onBackPress();
        if (handled) return;
      }

      if (window.history.length > 1 && canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });

    // 4. Network status listener
    Network.addListener('networkStatusChange', (status) => {
      handlers?.onNetworkChange?.(status.connected);
    });

    // 5. Setup Push Notifications permissions if on native device
    initPushNotifications();
  } catch (err) {
    console.warn('Native platform initialization notice:', err);
  }
}

/**
 * Native Android Share Sheet — shares invitation URL to WhatsApp, Messages, etc.
 */
export async function shareInvitationNative(params: {
  title: string;
  text: string;
  url: string;
  dialogTitle?: string;
}): Promise<boolean> {
  if (isNativePlatform()) {
    try {
      await Share.share({
        title: params.title,
        text: params.text,
        url: params.url,
        dialogTitle: params.dialogTitle || 'Share Your Invitation',
      });
      return true;
    } catch (e) {
      console.warn('Native share dismissed or failed:', e);
      return false;
    }
  }

  // Fallback for Web browser
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: params.title,
        text: params.text,
        url: params.url,
      });
      return true;
    } catch (e) {
      // User cancelled
    }
  }

  // Fallback to Clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(params.url);
    alert('Invitation link copied to clipboard!');
    return true;
  }

  return false;
}

/**
 * Initializes and registers device token for Push Notifications
 */
export async function initPushNotifications(): Promise<string | null> {
  if (!isNativePlatform()) return null;

  try {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      return null;
    }

    await PushNotifications.register();

    return new Promise((resolve) => {
      PushNotifications.addListener('registration', (token) => {
        resolve(token.value);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.warn('Push registration error:', error);
        resolve(null);
      });
    });
  } catch (e) {
    console.warn('Push notification registration not supported in environment:', e);
    return null;
  }
}
