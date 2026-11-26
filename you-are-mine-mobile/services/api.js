import axios from 'axios';
import { Storage } from './storage.service';
import { Config } from '../constants/config';

// Create Centralized Axios instance
export const apiClient = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach x-guest-token and x-platform headers
apiClient.interceptors.request.use(
  async (config) => {
    try {
      let guestToken = await Storage.getItemAsync(Config.STORAGE_KEYS.GUEST_TOKEN);
      if (!guestToken) {
        // Generate cryptographic-style guest token
        guestToken = 'gst_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        await Storage.setItemAsync(Config.STORAGE_KEYS.GUEST_TOKEN, guestToken);
      }
      config.headers['x-guest-token'] = guestToken;
      config.headers['x-platform'] = 'mobile-expo';
    } catch (e) {
      console.warn('Storage error in request interceptor:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Normalize data and handle unauthorized sessions
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(errorMsg));
  }
);

export default apiClient;
