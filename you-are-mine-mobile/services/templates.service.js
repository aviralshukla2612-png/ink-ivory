import { apiClient } from './api';
import { Config } from '../constants/config';

export const TemplatesService = {
  /**
   * Fetches all active templates with real-time pricing and metadata.
   */
  async getTemplates() {
    try {
      const response = await apiClient.get('/api/templates');
      const templates = response.data || [];
      
      // Normalize image URLs and default fields
      return templates.map((tpl) => ({
        ...tpl,
        previewImageUrl: tpl.previewImage?.startsWith('http')
          ? tpl.previewImage
          : `${Config.API_BASE_URL}${tpl.previewImage}`,
        priceDisplay: `₹${tpl.price || 299}`,
        occasionBadge: (tpl.occasion || 'Wedding').replace(/\\/g, ''),
        tierBadge: tpl.tier || 'PREMIUM',
      }));
    } catch (error) {
      console.warn('Failed to fetch templates from /api/templates:', error.message);
      throw error;
    }
  },

  /**
   * Fetches a single template by ID or slug.
   */
  async getTemplateById(id) {
    try {
      const response = await apiClient.get(`/api/templates/${id}`);
      const tpl = response.data;
      if (!tpl) throw new Error('Template not found');

      return {
        ...tpl,
        previewImageUrl: tpl.previewImage?.startsWith('http')
          ? tpl.previewImage
          : `${Config.API_BASE_URL}${tpl.previewImage}`,
        priceDisplay: `₹${tpl.price || 299}`,
        occasionBadge: (tpl.occasion || 'Wedding').replace(/\\/g, ''),
        tierBadge: tpl.tier || 'PREMIUM',
      };
    } catch (error) {
      console.warn(`Failed to fetch template ${id}:`, error.message);
      throw error;
    }
  },
};

export default TemplatesService;
