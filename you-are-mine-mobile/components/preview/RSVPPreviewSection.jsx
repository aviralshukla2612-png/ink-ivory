import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Mail, CheckCircle2, Phone, Calendar, Info, X } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

/**
 * RSVPPreviewSection
 * Renders the RSVP section in full-screen invitation preview with customer notice modal.
 */
export function RSVPPreviewSection({
  rsvpText = 'Kindly RSVP by 10th December 2026',
  hostText = 'Mr. & Mrs. Sharma & Family',
  contactNumber = '+91 98765 43210',
  isPublished = false,
  slug = '',
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Mail size={18} color={Colors.primary} />
        <Text style={styles.sectionTitle}>RSVP & Cordial Welcome</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.hostName}>{hostText}</Text>
      <Text style={styles.rsvpDeadline}>{rsvpText}</Text>

      {contactNumber ? (
        <View style={styles.contactRow}>
          <Phone size={14} color={Colors.gold} style={styles.contactIcon} />
          <Text style={styles.contactText}>Concierge & Inquiries: {contactNumber}</Text>
        </View>
      ) : null}

      {/* Interactive RSVP Preview Pill */}
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
        accessibilityLabel="Preview guest RSVP flow"
      >
        <Text style={styles.actionBtnText}>
          {isPublished ? 'Guest RSVP Active' : 'RSVP Guest Interaction (Preview)'}
        </Text>
      </TouchableOpacity>

      {/* Preview Explanation Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <X size={18} color={Colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.modalIconBox}>
              <Info size={26} color={Colors.primary} />
            </View>

            <Text style={styles.modalTitle}>Guest RSVP Experience</Text>

            <Text style={styles.modalMessage}>
              In this preview mode, RSVP responses are simulated so you can verify the layout and messaging without contaminating your real guest registry.
            </Text>

            <View style={styles.previewInfoBox}>
              <Text style={styles.infoBoxText}>
                ✦ Once published, your guests visiting{' '}
                <Text style={styles.boldText}>
                  {slug ? `youaremine.online/invite/${slug}` : 'your celebration link'}
                </Text>{' '}
                will be able to select Attending / Regrets, submit guest counts, and leave heartfelt wishes.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmBtnText}>Understood</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFDF9',
    borderRadius: 16,
    padding: 20,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(216, 183, 123, 0.45)',
    alignItems: 'center',
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  divider: {
    width: 60,
    height: 1.5,
    backgroundColor: Colors.gold,
    marginVertical: 10,
    opacity: 0.7,
  },
  hostName: {
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  rsvpDeadline: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(216, 183, 123, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  contactIcon: {
    marginRight: 6,
  },
  contactText: {
    fontSize: 11.5,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  actionBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.deepBurgundy,
  },
  actionBtnText: {
    color: Colors.champagne,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(31, 25, 22, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gold,
    elevation: 15,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 6,
  },
  modalIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(116, 30, 50, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  previewInfoBox: {
    backgroundColor: '#FAF5EE',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(216, 183, 123, 0.4)',
    marginBottom: 20,
  },
  infoBoxText: {
    fontSize: 11.5,
    color: '#6A4F3D',
    lineHeight: 17,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.primary,
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 22,
    width: '100%',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: Colors.champagne,
    fontWeight: '700',
    fontSize: 13,
  },
});

export default RSVPPreviewSection;
