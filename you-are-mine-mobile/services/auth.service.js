import { Storage } from './storage.service';
import { apiClient } from './api';
import { Config } from '../constants/config';

export const AuthService = {
  /**
   * Retrieves or initializes customer guest token from Storage.
   */
  async getOrCreateGuestToken() {
    try {
      let token = await Storage.getItemAsync(Config.STORAGE_KEYS.GUEST_TOKEN);
      if (!token) {
        token = 'gst_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
        await Storage.setItemAsync(Config.STORAGE_KEYS.GUEST_TOKEN, token);
      }
      return token;
    } catch (e) {
      return 'gst_fallback_' + Date.now();
    }
  },

  /**
   * Checks whether the user has completed the onboarding flow.
   */
  async isOnboardingCompleted() {
    try {
      const val = await Storage.getItemAsync(Config.STORAGE_KEYS.ONBOARDING_COMPLETED);
      return val === 'true';
    } catch (e) {
      return false;
    }
  },

  /**
   * Marks onboarding as completed.
   */
  async setOnboardingCompleted() {
    try {
      await Storage.setItemAsync(Config.STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    } catch (e) {
      console.warn('Failed to persist onboarding status:', e);
    }
  },

  /**
   * Dispatches real DLT SMS OTP to customer's 10-digit phone number.
   */
  async sendOtp(phone, name = 'Customer') {
    const cleanedPhone = phone.replace(/\D/g, '').slice(-10);
    return await apiClient.post('/api/auth/send-otp', {
      phone: cleanedPhone,
      name,
    });
  },

  /**
   * Verifies OTP code and binds session.
   */
  async verifyOtp(phone, otp) {
    const cleanedPhone = phone.replace(/\D/g, '').slice(-10);
    const response = await apiClient.post('/api/auth/verify-otp', {
      phone: cleanedPhone,
      otp,
    });

    if (response.success) {
      const sessionData = {
        phone: '+91 ' + cleanedPhone,
        verifiedAt: new Date().toISOString(),
      };
      await Storage.setItemAsync(
        Config.STORAGE_KEYS.CUSTOMER_SESSION,
        JSON.stringify(sessionData)
      );
    }
    return response;
  },

  /**
   * Retrieves customer profile from server.
   */
  async getProfile() {
    return await apiClient.get('/api/user/me');
  },

  /**
   * Logs out the customer and clears session storage.
   */
  async logout() {
    try {
      await Storage.deleteItemAsync(Config.STORAGE_KEYS.CUSTOMER_SESSION);
    } catch (e) {
      console.warn('Logout cleanup notice:', e);
    }
  },
};

export default AuthService;
