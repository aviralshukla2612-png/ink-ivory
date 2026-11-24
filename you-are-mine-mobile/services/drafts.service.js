import { apiClient } from './api.js';

export const DraftsService = {
  /**
   * Retrieves all drafts owned by the current customer.
   */
  async getDrafts() {
    try {
      const response = await apiClient.get('/api/drafts');
      return response.drafts || [];
    } catch (error) {
      console.warn('Failed to retrieve customer drafts:', error.message);
      return [];
    }
  },

  /**
   * Retrieves a specific draft by ID.
   */
  async getDraft(draftId) {
    try {
      const response = await apiClient.get(`/api/drafts/${draftId}`);
      return response.draft;
    } catch (error) {
      console.warn(`Failed to retrieve draft ${draftId}:`, error.message);
      throw error;
    }
  },

  /**
   * Creates a new draft on the backend.
   */
  async createDraft({ templateId, title = 'My Invitation Draft', fields = {}, design = {} }) {
    try {
      const response = await apiClient.post('/api/drafts', {
        templateId,
        title,
        fields,
        design,
        status: 'DRAFT',
      });
      return response.draft;
    } catch (error) {
      console.warn('Failed to create draft:', error.message);
      throw error;
    }
  },

  /**
   * Updates an existing draft on the backend.
   */
  async updateDraft(draftId, { title, fields, design, status = 'DRAFT' }) {
    try {
      const response = await apiClient.put(`/api/drafts/${draftId}`, {
        title,
        fields,
        design,
        status,
      });
      return response.draft;
    } catch (error) {
      console.warn(`Failed to update draft ${draftId}:`, error.message);
      throw error;
    }
  },
};

export default DraftsService;
