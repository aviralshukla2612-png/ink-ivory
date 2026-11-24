import * as ImagePicker from 'expo-image-picker';
import { Config } from '../constants/config';
import * as SecureStore from 'expo-secure-store';

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
