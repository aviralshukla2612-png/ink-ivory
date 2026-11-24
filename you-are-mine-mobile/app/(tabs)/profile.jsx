import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/common/Header';
import { Colors } from '../../constants/colors';
import { Config } from '../../constants/config';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  HelpCircle, 
  ExternalLink, 
  Smartphone,
  Trash2
} from 'lucide-react-native';

export default function ProfileScreen() {
  const customer = Config.DEFAULT_CUSTOMER;
  const baseUrl = Config.API_BASE_URL.replace(/\/$/, '');

  const openUrl = async (path, title) => {
    const url = `${baseUrl}${path}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Unable to open link', `Please visit: ${url}`);
      }
    } catch {
      Alert.alert('External Link', `Open in browser:\n${url}`);
    }
  };

  const handleDataDeletionRequest = () => {
    Alert.alert(
      'Data Erasure Request',
      'In accordance with our Privacy Policy and applicable data protection regulations, you may request full erasure of your account, drafts, and uploaded media.\n\nTo proceed, email privacy@youaremine.online with your registered email.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Request Email', 
          onPress: () => Linking.openURL('mailto:privacy@youaremine.online?subject=Data%20Erasure%20Request%20-%20YOU%20ARE%20MINE')
        }
      ]
    );
  };

  const handleSupportContact = () => {
    Linking.openURL('mailto:support@youaremine.online?subject=YOU%20ARE%20MINE%20Support');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Customer Profile" showNotification={false} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Customer Identity Card */}
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <User size={32} color={Colors.surface} />
            </View>
            <View style={styles.identityDetails}>
              <Text style={styles.customerName}>{customer.name}</Text>
              <Text style={styles.customerStatus}>Verified Closed Beta Member</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Mail size={16} color={Colors.primary} />
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{customer.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Phone size={16} color={Colors.primary} />
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{customer.phone}</Text>
          </View>
        </View>

        {/* Application Build & Channel Info */}
        <View style={styles.sectionHeader}>
          <Smartphone size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Application Information</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0 (Build 1)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.settingLabel}>Distribution Channel</Text>
            <Text style={styles.channelBadge}>{Config.DISTRIBUTION_CHANNEL}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.settingLabel}>Environment</Text>
            <Text style={styles.settingValue}>{__DEV__ ? 'Development' : 'Production'}</Text>
          </View>
        </View>

        {/* Legal, Privacy & Compliance */}
        <View style={styles.sectionHeader}>
          <ShieldCheck size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Legal & Privacy Policies</Text>
        </View>

        <View style={styles.menuCard}>
          <TouchableOpacity 
            style={styles.menuRow} 
            onPress={() => openUrl('/privacy', 'Privacy Policy')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconText}>
              <ShieldCheck size={18} color={Colors.primary} />
              <Text style={styles.menuText}>Privacy Policy</Text>
            </View>
            <ExternalLink size={16} color={Colors.gold} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity 
            style={styles.menuRow} 
            onPress={() => openUrl('/terms', 'Terms of Service')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconText}>
              <FileText size={18} color={Colors.primary} />
              <Text style={styles.menuText}>Terms of Service</Text>
            </View>
            <ExternalLink size={16} color={Colors.gold} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity 
            style={styles.menuRow} 
            onPress={() => openUrl('/refund-policy', 'Refund Policy')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconText}>
              <RotateCcw size={18} color={Colors.primary} />
              <Text style={styles.menuText}>Refund & Cancellation Policy</Text>
            </View>
            <ExternalLink size={16} color={Colors.gold} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity 
            style={styles.menuRow} 
            onPress={handleDataDeletionRequest}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconText}>
              <Trash2 size={18} color="#C92A2A" />
              <Text style={[styles.menuText, { color: '#C92A2A' }]}>Request Data Erasure</Text>
            </View>
            <ExternalLink size={16} color="#C92A2A" />
          </TouchableOpacity>
        </View>

        {/* Support & Contact */}
        <View style={styles.sectionHeader}>
          <HelpCircle size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Support & Feedback</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.supportDesc}>
            Need assistance or wish to provide closed-beta feedback on your invitation experience?
          </Text>
          <TouchableOpacity 
            style={styles.supportButton}
            onPress={handleSupportContact}
            activeOpacity={0.8}
          >
            <Mail size={16} color={Colors.surface} />
            <Text style={styles.supportButtonText}>Contact Beta Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerSpacing}>
          <Text style={styles.footerText}>YOU ARE MINE Digital Stationery • All Rights Reserved</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.goldLight,
    marginBottom: 16,
  },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.goldLight,
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  identityDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  customerStatus: {
    fontSize: 12,
    color: Colors.gold,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.goldLight,
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 8,
    marginRight: 6,
  },
  infoValue: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  settingLabel: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  settingValue: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  channelBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.surface,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuIconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
    marginLeft: 12,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.goldLight,
    marginLeft: 46,
  },
  supportDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  supportButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  supportButtonText: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  footerSpacing: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
