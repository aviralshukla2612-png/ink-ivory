import { apiClient } from './api.js';
import { Config } from '../constants/config.js';
import { FALLBACK_TEMPLATES } from '../constants/templates.data.js';

function normalizeTemplate(tpl) {
  if (!tpl) return null;
  return {
    ...tpl,
    previewImageUrl: tpl.previewImage?.startsWith('http')
      ? tpl.previewImage
      : `${Config.API_BASE_URL}${tpl.previewImage || ''}`,
    priceDisplay: `₹${tpl.price || 299}`,
    occasionBadge: (tpl.occasion || 'Wedding').replace(/\\/g, ''),
    tierBadge: tpl.tier || 'PREMIUM',
  };
}

export const TemplatesService = {
  /**
   * Fetches all active templates with real-time pricing and metadata.
   * Gracefully falls back to offline canonical templates on network errors.
   */
  async getTemplates() {
    try {
      const response = await apiClient.get('/api/templates');
      const templates = response?.data || (Array.isArray(response) ? response : []);

      if (Array.isArray(templates) && templates.length > 0) {
        return templates
          .filter((t) => t.id !== 'tpl-wedding-jharokha-06' && !t.title?.includes('Hardik'))
          .map(normalizeTemplate);
      }
      return FALLBACK_TEMPLATES
        .filter((t) => t.id !== 'tpl-wedding-jharokha-06' && !t.title?.includes('Hardik'))
        .map(normalizeTemplate);
    } catch (error) {
      console.warn('Failed to fetch templates from /api/templates, using offline fallback:', error.message);
      return FALLBACK_TEMPLATES
        .filter((t) => t.id !== 'tpl-wedding-jharokha-06' && !t.title?.includes('Hardik'))
        .map(normalizeTemplate);
    }
  },

  /**
   * Fetches a single template by ID or slug.
   * Gracefully falls back to offline canonical templates on network errors or 404s.
   */
  async getTemplateById(id) {
    const rawId = String(id || '').trim();

    if (rawId === 'tpl-wedding-jharokha-06' || rawId.includes('jharokha')) {
      return normalizeTemplate(FALLBACK_TEMPLATES[0]);
    }

    try {
      const response = await apiClient.get(`/api/templates/${rawId}`);
      const tpl = response?.data || response;
      if (tpl && (tpl.id || tpl.title) && tpl.id !== 'tpl-wedding-jharokha-06') {
        return normalizeTemplate(tpl);
      }
    } catch (error) {
      console.warn(`Failed to fetch template ${rawId} from backend, using fallback:`, error.message);
    }

    // Look for matching template in canonical fallback list
    const fallback = FALLBACK_TEMPLATES.find(
      (t) => t.id === rawId || t.slug === rawId || t.id.toLowerCase() === rawId.toLowerCase()
    );

    if (fallback) {
      return normalizeTemplate(fallback);
    }

    // If ID is unrecognised (or is a draft ID), fall back to the primary canonical template
    return normalizeTemplate(FALLBACK_TEMPLATES[0]);
  },
};

export default TemplatesService;
