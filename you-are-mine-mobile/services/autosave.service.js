import AsyncStorage from '@react-native-async-storage/async-storage';
import { DraftsService } from './drafts.service.js';

const DRAFT_CACHE_PREFIX = 'yam_offline_draft_';

let debounceTimer = null;
let lastSavedSignature = null;
let isSavingInProgress = false;

export const AutosaveService = {
  /**
   * Generates a fast comparison signature of draft fields & design.
   */
  getSignature(fields, design) {
    try {
      return JSON.stringify({ fields, design });
    } catch (e) {
      return '';
    }
  },

  /**
   * Persists draft state to local AsyncStorage for offline recovery.
   */
  async cacheLocally(draftId, draftData) {
    try {
      if (!draftId) return;
      await AsyncStorage.setItem(
        `${DRAFT_CACHE_PREFIX}${draftId}`,
        JSON.stringify({
          ...draftData,
          cachedAt: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.warn('Local draft cache notice:', e);
    }
  },

  /**
   * Restores locally cached draft data if available.
   */
  async getLocalCache(draftId) {
    try {
      if (!draftId) return null;
      const data = await AsyncStorage.getItem(`${DRAFT_CACHE_PREFIX}${draftId}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Clears local draft cache after successful confirmed server sync.
   */
  async clearLocalCache(draftId) {
    try {
      if (draftId) {
        await AsyncStorage.removeItem(`${DRAFT_CACHE_PREFIX}${draftId}`);
      }
    } catch (e) {}
  },

  /**
   * Triggers debounced autosave (1500ms).
   */
  triggerAutosave(draftId, { title, fields, design, status = 'DRAFT' }, onStatusChange) {
    if (!draftId) return;

    const currentSignature = this.getSignature(fields, design);
    if (currentSignature === lastSavedSignature) {
      // Nothing meaningfully changed; avoid unnecessary requests
      return;
    }

    // Save locally immediately to guarantee no data loss on sudden app exit
    this.cacheLocally(draftId, { title, fields, design, status });

    if (onStatusChange) {
      onStatusChange('unsaved');
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(async () => {
      if (isSavingInProgress) {
        // Retry in next tick if a previous save request is currently in-flight
        this.triggerAutosave(draftId, { title, fields, design, status }, onStatusChange);
        return;
      }

      try {
        isSavingInProgress = true;
        if (onStatusChange) onStatusChange('saving');

        await DraftsService.updateDraft(draftId, {
          title,
          fields,
          design,
          status,
        });

        lastSavedSignature = currentSignature;
        if (onStatusChange) onStatusChange('saved');
        await this.clearLocalCache(draftId);
      } catch (error) {
        console.warn('Autosave sync notice:', error.message);
        // Retain local cache and mark offline/error
        if (onStatusChange) onStatusChange('offline');
      } finally {
        isSavingInProgress = false;
      }
    }, 1500);
  },

  /**
   * Cancels any pending debounced save.
   */
  cancelPending() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  },
};

export default AutosaveService;
