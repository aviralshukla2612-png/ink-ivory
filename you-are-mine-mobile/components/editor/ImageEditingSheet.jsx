import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Image as ImageIcon, Upload, Trash2, X, ZoomIn, ZoomOut, Check } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { MediaService } from '../../services/media.service';
import { useEditorStore } from '../../store/editor.store';

export function ImageEditingSheet() {
  const {
    elements,
    updateCouplePhoto,
    updatePhotoScale,
    removeCouplePhoto,
    setActiveTool,
  } = useEditorStore();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const photoElement = elements.photo || {};
  const currentScale = photoElement.scale || 1.0;

  const handlePickAndUpload = async () => {
    try {
      const asset = await MediaService.pickImageFromGallery();
      if (!asset) return;

      setIsUploading(true);
      setUploadProgress(40);

      const result = await MediaService.uploadImage(asset);
      setUploadProgress(100);

      if (result && result.url) {
        updateCouplePhoto(result.url);
      }
    } catch (err) {
      Alert.alert('Upload Error', err.message || 'Failed to upload photo to server.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleScaleChange = (delta) => {
    const newScale = Math.max(0.7, Math.min(2.0, Math.round((currentScale + delta) * 10) / 10));
    updatePhotoScale(newScale);
  };

  return (
    <View style={styles.sheetContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <ImageIcon size={18} color={Colors.primary} />
          <Text style={styles.headerTitle}>Couple Photograph</Text>
        </View>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => setActiveTool(null)}
          activeOpacity={0.7}
        >
          <X size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Upload Progress Indicator */}
        {isUploading ? (
          <View style={styles.progressBox}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.progressText}>Uploading photo to server ({uploadProgress}%)...</Text>
          </View>
        ) : null}

        {/* Action Buttons: Pick Photo */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={handlePickAndUpload}
            disabled={isUploading}
            activeOpacity={0.8}
          >
            <Upload size={16} color={Colors.textLight} />
            <Text style={styles.uploadBtnText}>
              {photoElement.hasPhoto ? 'Replace Photograph' : 'Upload From Gallery'}
            </Text>
          </TouchableOpacity>

          {photoElement.hasPhoto ? (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => {
                Alert.alert('Remove Photo', 'Are you sure you want to remove the couple photo?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Remove', style: 'destructive', onPress: removeCouplePhoto },
                ]);
              }}
              activeOpacity={0.7}
            >
              <Trash2 size={16} color={Colors.error} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Zoom & Scale Stepper Controls */}
        <View style={styles.scaleContainer}>
          <Text style={styles.controlLabel}>Photo Zoom: {Math.round(currentScale * 100)}%</Text>
          <View style={styles.scaleControls}>
            <TouchableOpacity
              style={styles.scaleBtn}
              onPress={() => handleScaleChange(-0.1)}
              disabled={currentScale <= 0.7}
            >
              <ZoomOut size={16} color={Colors.textPrimary} />
            </TouchableOpacity>

            <View style={styles.scaleTrack}>
              <View
                style={[
                  styles.scaleFill,
                  { width: `${((currentScale - 0.7) / (2.0 - 0.7)) * 100}%` },
                ]}
              />
            </View>

            <TouchableOpacity
              style={styles.scaleBtn}
              onPress={() => handleScaleChange(0.1)}
              disabled={currentScale >= 2.0}
            >
              <ZoomIn size={16} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: Colors.border,
    elevation: 12,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 22,
    gap: 16,
  },
  progressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.cream,
    padding: 10,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  uploadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 20,
  },
  uploadBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textLight,
  },
  removeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  scaleContainer: {
    gap: 8,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  scaleControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scaleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scaleTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.cream,
    borderRadius: 3,
    overflow: 'hidden',
  },
  scaleFill: {
    height: '100%',
    backgroundColor: Colors.champagneGold,
  },
});

export default ImageEditingSheet;
