import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Linking, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import {
  Edit3,
  Eye,
  Copy,
  Trash2,
  ExternalLink,
  Share2,
  X,
  Sparkles,
} from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { PublicationsService } from '../../services/publications.service';

export function InvitationActionModal({
  visible,
  invitation,
  onClose,
  onEdit,
  onPreview,
  onDuplicate,
  onDeletePrompt,
}) {
  if (!invitation) return null;

  const isPublished = invitation.status === 'PUBLISHED' || Boolean(invitation.slug);
  const title = invitation.title || invitation.fields?.names || 'Bespoke Invitation';
  const liveUrl = invitation.slug ? PublicationsService.getPublicUrl(invitation.slug) : '';

  const handleCopyLink = async () => {
    if (!liveUrl) return;
    try {
      await Clipboard.setStringAsync(liveUrl);
      Alert.alert('Link Copied', 'Your live invitation link has been copied to clipboard!');
      onClose();
    } catch (err) {
      console.warn('Copy link error:', err.message);
    }
  };

  const handleShareLink = async () => {
    if (!invitation.slug) return;
    try {
      await PublicationsService.sharePublishedInvitation({
        slug: invitation.slug,
        title: invitation.title,
        names: invitation.fields?.names,
      });
      onClose();
    } catch (err) {
      console.warn('Share link error:', err.message);
    }
  };

  const handleViewLive = () => {
    if (liveUrl) {
      Linking.openURL(liveUrl).catch((err) => {
        Alert.alert('Error', 'Unable to open browser link.');
      });
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.dismissOverlay} onPress={onClose} activeOpacity={1} />

        <View style={styles.sheetCard}>
          {/* Top Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleInfo}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.statusSubtitle}>
                {isPublished ? '✦ Live Published Celebration' : '✦ In-Progress Draft'}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Action List */}
          <View style={styles.actionsList}>
            {/* Common: Preview */}
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                onClose();
                onPreview(invitation);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconBox}>
                <Eye size={18} color={Colors.primary} />
              </View>
              <View style={styles.actionTextBox}>
                <Text style={styles.actionTitle}>Preview Invitation</Text>
                <Text style={styles.actionDesc}>View full animated card and audio</Text>
              </View>
            </TouchableOpacity>

            {/* Common: Edit */}
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                onClose();
                onEdit(invitation);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconBox}>
                <Edit3 size={18} color={Colors.primary} />
              </View>
              <View style={styles.actionTextBox}>
                <Text style={styles.actionTitle}>Continue Editing</Text>
                <Text style={styles.actionDesc}>Customize text, couple portrait & music</Text>
              </View>
            </TouchableOpacity>

            {/* Published-Specific Actions */}
            {isPublished && (
              <>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={handleViewLive}
                  activeOpacity={0.7}
                >
                  <View style={styles.actionIconBox}>
                    <ExternalLink size={18} color="#2E7D32" />
                  </View>
                  <View style={styles.actionTextBox}>
                    <Text style={[styles.actionTitle, { color: '#2E7D32' }]}>
                      View Live Website
                    </Text>
                    <Text style={styles.actionDesc}>Open guest celebration URL in browser</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={handleShareLink}
                  activeOpacity={0.7}
                >
                  <View style={styles.actionIconBox}>
                    <Share2 size={18} color={Colors.primary} />
                  </View>
                  <View style={styles.actionTextBox}>
                    <Text style={styles.actionTitle}>Share Invitation Link</Text>
                    <Text style={styles.actionDesc}>Send to family & guests via WhatsApp, Mail, etc.</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={handleCopyLink}
                  activeOpacity={0.7}
                >
                  <View style={styles.actionIconBox}>
                    <Copy size={18} color={Colors.primary} />
                  </View>
                  <View style={styles.actionTextBox}>
                    <Text style={styles.actionTitle}>Copy URL</Text>
                    <Text style={styles.actionDesc}>Copy direct celebration link to clipboard</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}

            {/* Draft-Specific Actions */}
            {!isPublished && (
              <>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => {
                    onClose();
                    onDuplicate(invitation);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.actionIconBox}>
                    <Copy size={18} color={Colors.primary} />
                  </View>
                  <View style={styles.actionTextBox}>
                    <Text style={styles.actionTitle}>Duplicate Draft</Text>
                    <Text style={styles.actionDesc}>Create an independent copy with same details</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionItem, styles.deleteItem]}
                  onPress={() => {
                    onClose();
                    onDeletePrompt(invitation);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.actionIconBox, styles.deleteIconBox]}>
                    <Trash2 size={18} color="#C62828" />
                  </View>
                  <View style={styles.actionTextBox}>
                    <Text style={styles.deleteTitle}>Delete Draft</Text>
                    <Text style={styles.actionDesc}>Permanently remove this draft</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(31, 25, 22, 0.65)',
    justifyContent: 'flex-end',
  },
  dismissOverlay: {
    flex: 1,
  },
  sheetCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1.5,
    borderTopColor: Colors.gold,
    elevation: 20,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleInfo: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 11.5,
    color: Colors.primary,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  closeBtn: {
    padding: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 14,
  },
  actionsList: {
    gap: 4,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionTextBox: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 11.5,
    color: Colors.textSecondary,
  },
  deleteItem: {
    marginTop: 6,
  },
  deleteIconBox: {
    backgroundColor: '#FFEBEE',
    borderColor: 'rgba(198, 40, 40, 0.25)',
  },
  deleteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C62828',
    marginBottom: 2,
  },
});

export default InvitationActionModal;
