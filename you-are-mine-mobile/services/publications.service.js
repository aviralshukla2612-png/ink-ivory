import { Share, Platform } from 'react-native';
import { apiClient } from './api.js';

export const PublicationsService = {
  /**
   * Retrieves all publications owned by the current customer.
   */
  async getPublications() {
    try {
      const response = await apiClient.get('/api/publications');
      return response.publications || [];
    } catch (error) {
      console.warn('Failed to retrieve customer publications:', error.message);
      return [];
    }
  },

  /**
   * Generates the canonical full public invitation URL.
   */
  getPublicUrl(slug) {
    if (!slug) return '';
    const origin = 'https://youaremine.online';
    return `${origin}/invite/${slug}`;
  },

  /**
   * Native device sharing for a verified published invitation.
   */
  async sharePublishedInvitation({ slug, title = 'Bespoke Invitation', names = 'Special Celebration' }) {
    const liveUrl = this.getPublicUrl(slug);
    if (!liveUrl) {
      throw new Error('Cannot share without a verified publication URL');
    }

    try {
      const message = `✨ You are cordially invited to celebrate with us!\n\n${title}\n${names}\n\nOpen your bespoke digital invitation:\n${liveUrl}`;
      const result = await Share.share({
        title: `${names} — ${title}`,
        message,
        url: Platform.OS === 'ios' ? liveUrl : undefined,
      });
      return result;
    } catch (error) {
      console.warn('Error sharing invitation:', error.message);
      throw error;
    }
  },
};

export default PublicationsService;
