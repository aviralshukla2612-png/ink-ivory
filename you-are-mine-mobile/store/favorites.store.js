import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const FAVORITES_STORAGE_KEY = 'yam_customer_favorites';

export const useFavoritesStore = create((set, get) => ({
  favorites: [],
  isLoaded: false,

  /**
   * Hydrates favorites from SecureStore on launch.
   */
  loadFavorites: async () => {
    try {
      const stored = await SecureStore.getItemAsync(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          set({ favorites: parsed, isLoaded: true });
          return;
        }
      }
      set({ favorites: [], isLoaded: true });
    } catch (e) {
      set({ favorites: [], isLoaded: true });
    }
  },

  /**
   * Toggles favorite status for a given template ID.
   */
  toggleFavorite: async (templateId) => {
    const current = get().favorites;
    const exists = current.includes(templateId);
    const updated = exists
      ? current.filter((id) => id !== templateId)
      : [...current, templateId];

    set({ favorites: updated });
    try {
      await SecureStore.setItemAsync(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist favorites:', e);
    }
  },

  /**
   * Checks if a template is favorited.
   */
  isFavorite: (templateId) => {
    return get().favorites.includes(templateId);
  },
}));

export default useFavoritesStore;
