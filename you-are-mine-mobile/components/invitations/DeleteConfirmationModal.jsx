import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { AlertTriangle, Trash2, X } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

export function DeleteConfirmationModal({
  visible,
  invitation,
  isDeleting = false,
  onCancel,
  onConfirmDelete,
}) {
  if (!invitation) return null;

  const title = invitation.title || invitation.fields?.names || 'Untitled Draft';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeBtn} onPress={onCancel} disabled={isDeleting}>
            <X size={18} color={Colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.iconBox}>
            <Trash2 size={24} color="#C62828" />
          </View>

          <Text style={styles.modalTitle}>Delete Invitation Draft?</Text>

          <Text style={styles.modalMessage}>
            Are you sure you want to permanently delete{' '}
            <Text style={styles.boldText}>"{title}"</Text>? All customized ceremony dates, venues, photos and typography will be removed.
          </Text>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onCancel}
              disabled={isDeleting}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Keep Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={onConfirmDelete}
              disabled={isDeleting}
              activeOpacity={0.85}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.deleteText}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(31, 25, 22, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(198, 40, 40, 0.3)',
    elevation: 20,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 6,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(198, 40, 40, 0.2)',
  },
  modalTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  deleteBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#C62828',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default DeleteConfirmationModal;
