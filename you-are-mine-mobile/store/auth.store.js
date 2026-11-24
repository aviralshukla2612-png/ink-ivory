import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { AuthService } from '../services/auth.service';
import { Config } from '../constants/config';

export const useAuthStore = create((set, get) => ({
  guestToken: null,
  isAuthenticated: false,
  customer: Config.DEFAULT_CUSTOMER,
  isOnboardingDone: false,
  isLoading: true,
  error: null,

  /**
   * Initialize state from SecureStore and backend on app launch.
   */
  initializeAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const guestToken = await AuthService.getOrCreateGuestToken();
      const isOnboardingDone = await AuthService.isOnboardingCompleted();
      const sessionJson = await SecureStore.getItemAsync(Config.STORAGE_KEYS.CUSTOMER_SESSION);

      let isAuthenticated = false;
      let customer = Config.DEFAULT_CUSTOMER;

      if (sessionJson) {
        try {
          const parsed = JSON.parse(sessionJson);
          isAuthenticated = true;
          customer = {
            ...customer,
            phone: parsed.phone || customer.phone,
          };
        } catch (e) {
          // ignore corrupted json
        }
      }

      // Attempt to load customer profile from server if reachable
      try {
        const res = await AuthService.getProfile();
        if (res && res.user) {
          customer = { ...customer, ...res.user };
        }
      } catch (e) {
        // Fall back to stored session without blocking app launch
      }

      set({
        guestToken,
        isOnboardingDone,
        isAuthenticated,
        customer,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
    }
  },

  /**
   * Mark onboarding completed and persist to SecureStore.
   */
  completeOnboarding: async () => {
    await AuthService.setOnboardingCompleted();
    set({ isOnboardingDone: true });
  },

  /**
   * Send OTP to customer phone.
   */
  requestOtp: async (phone, name) => {
    set({ error: null });
    try {
      return await AuthService.sendOtp(phone, name);
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  /**
   * Verify OTP and establish authenticated session.
   */
  confirmOtp: async (phone, otp) => {
    set({ error: null });
    try {
      const result = await AuthService.verifyOtp(phone, otp);
      if (result.success) {
        set((state) => ({
          isAuthenticated: true,
          customer: {
            ...state.customer,
            phone: '+91 ' + phone.replace(/\D/g, '').slice(-10),
          },
        }));
      }
      return result;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  /**
   * Logout customer session.
   */
  logout: async () => {
    await AuthService.logout();
    set({
      isAuthenticated: false,
      customer: Config.DEFAULT_CUSTOMER,
    });
  },
}));

export default useAuthStore;
