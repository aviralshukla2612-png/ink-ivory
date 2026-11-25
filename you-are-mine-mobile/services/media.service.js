import * as ImagePicker from 'expo-image-picker';
import { Config } from '../constants/config';
import * as SecureStore from 'expo-secure-store';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

export const MediaService = {
  /**
   * Requests media library permissions and opens gallery image picker.
   */
  async pickImageFromGallery(options = {}) {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Gallery permission is required to select photos for your invitation.');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.85,
        ...options,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];

      // Validate file size
      if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE_BYTES) {
        throw new Error('Image exceeds 10MB limit. Please select an optimized photo.');
      }

      return {
        uri: asset.uri,
        fileName: asset.fileName || `invitation_${Date.now()}.jpg`,
        type: asset.mimeType || 'image/jpeg',
        width: asset.width,
        height: asset.height,
        fileSize: asset.fileSize,
      };
    } catch (error) {
      console.warn('ImagePicker error:', error.message);
      throw error;
    }
  },

  /**
   * Pick multiple photos for invitation photo gallery or memory carousel.
   */
  async pickMultipleImagesFromGallery(maxImages = 6) {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Gallery permission is required to select photos.');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: maxImages,
        quality: 0.85,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return [];
      }

      return result.assets.map((asset, idx) => ({
        uri: asset.uri,
        fileName: asset.fileName || `gallery_${Date.now()}_${idx}.jpg`,
        type: asset.mimeType || 'image/jpeg',
        width: asset.width,
        height: asset.height,
        fileSize: asset.fileSize,
      }));
    } catch (error) {
      console.warn('Multiple ImagePicker error:', error.message);
      throw error;
    }
  },

  /**
   * Uploads the selected image file to the backend via POST /api/upload/image.
   */
  async uploadImage(imageAsset, onProgress = null) {
    try {
      const guestToken = await SecureStore.getItemAsync(Config.STORAGE_KEYS.GUEST_TOKEN);

      const formData = new FormData();
      const filename = imageAsset.fileName || `photo_${Date.now()}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('file', {
        uri: imageAsset.uri,
        name: filename,
        type: imageAsset.type || type,
      });

      const response = await fetch(`${Config.API_BASE_URL}/api/upload/image`, {
        method: 'POST',
        headers: {
          'x-guest-token': guestToken || '',
          'x-platform': 'mobile-expo',
        },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to upload image to server');
      }

      return {
        success: true,
        url: result.url,
        fileName: result.fileName,
        size: result.size,
      };
    } catch (error) {
      console.warn('Upload error:', error.message);
      throw error;
    }
  },
};

export default MediaService;
