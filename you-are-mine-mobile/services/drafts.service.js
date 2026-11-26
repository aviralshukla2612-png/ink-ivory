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
    if (!draftId || typeof draftId !== 'string' || draftId.startsWith('tpl-') || draftId.startsWith('tpl_')) {
      return null;
    }
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

  /**
   * Duplicates an existing draft on the backend.
   */
  async duplicateDraft(draftId) {
    try {
      const response = await apiClient.post(`/api/drafts/${draftId}/duplicate`);
      return response.draft;
    } catch (error) {
      console.warn(`Failed to duplicate draft ${draftId}:`, error.message);
      throw error;
    }
  },

  /**
   * Deletes an existing draft on the backend.
   */
  async deleteDraft(draftId) {
    try {
      const response = await apiClient.delete(`/api/drafts/${draftId}`);
      return response.success;
    } catch (error) {
      console.warn(`Failed to delete draft ${draftId}:`, error.message);
      throw error;
    }
  },
};

export default DraftsService;

