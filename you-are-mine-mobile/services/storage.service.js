import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Universal Storage Wrapper
 * Uses expo-secure-store on Native (iOS/Android),
 * and localStorage on Web.
 */
export const Storage = {
  async getItemAsync(key) {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
      } catch (e) {
        return null;
      }
      return null;
    }
    return await SecureStore.getItemAsync(key);
  },

  async setItemAsync(key, value) {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
        }
      } catch (e) {
        // Ignore web storage errors
      }
      return;
    }
    return await SecureStore.setItemAsync(key, value);
  },

  async deleteItemAsync(key) {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
      } catch (e) {
        // Ignore web storage errors
      }
      return;
    }
    return await SecureStore.deleteItemAsync(key);
  },
};

export default Storage;
