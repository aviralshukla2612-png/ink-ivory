// YOU ARE MINE — PublicationSuccessScreen Component
// Celebrates published invitation with live URL, Copy Link, Native Share, and View Live Invitation.

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Share,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { useQueryClient } from '@tanstack/react-query';
import { Sparkles, CheckCircle, Copy, Share2, ExternalLink, ArrowRight, Heart } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

export default function PublicationSuccessScreen({ params: propParams }) {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const params = propParams || searchParams || {};

  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  const slug = params.slug || 'celebration';
  const invitationUrl = params.invitationUrl || `https://youaremine.online/invite/${slug}`;
  const title = params.title || 'Bespoke Invitation';

  // Invalidate queries so My Invitations immediately reflects PUBLISHED status
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['drafts'] });
    queryClient.invalidateQueries({ queryKey: ['publications'] });
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  }, [queryClient]);

  // Copy URL to Clipboard
  const handleCopyLink = async () => {
    try {
      await Clipboard.setStringAsync(invitationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      Alert.alert('Copy Failed', 'Unable to copy URL to clipboard.');
    }
  };

  // Native Device Share
  const handleShare = async () => {
    try {
      await Share.share({
        title: `You Are Cordially Invited: ${title}`,
        message: `✨ You are cordially invited to celebrate with us! View our bespoke digital invitation: ${invitationUrl}`,
        url: invitationUrl,
      });
    } catch (err) {
      console.warn('Share dismissed or failed:', err);
    }
  };

  // Open Live Invitation in Web Browser
  const handleViewLive = () => {
    Linking.openURL(invitationUrl).catch(() => {
      Alert.alert('Link', `Could not open ${invitationUrl}`);
    });
  };

  // Navigate to My Invitations Tab
  const handleGoToMyInvitations = () => {
    router.replace('/(tabs)/my-invitations');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Golden Celebration Icon */}
        <View style={styles.celebrationWrapper}>
          <View style={styles.outerGlow}>
            <View style={styles.innerSeal}>
              <Sparkles size={38} color={Colors.champagneGold} />
            </View>
          </View>
        </View>

        {/* Success Headings */}
        <Text style={styles.tagline}>OFFICIAL PUBLICATION COMPLETE</Text>
        <Text style={styles.mainTitle}>Your Invitation is Live!</Text>
        <Text style={styles.subtitle}>
          Your bespoke digital invitation for <Text style={styles.boldTitle}>{title}</Text> has been successfully published to the cloud.
        </Text>

        {/* Live Invitation URL Card */}
        <View style={styles.urlCard}>
          <View style={styles.urlHeader}>
            <CheckCircle size={14} color={Colors.success} />
            <Text style={styles.urlHeaderStatus}>Active Live Link</Text>
          </View>
          <Text style={styles.urlText} numberOfLines={1}>
            {invitationUrl}
          </Text>

          <View style={styles.cardActionsRow}>
            <TouchableOpacity style={styles.pillAction} onPress={handleCopyLink} activeOpacity={0.75}>
              <Copy size={13} color={Colors.textPrimary} />
              <Text style={styles.pillActionText}>{copied ? 'COPIED!' : 'COPY LINK'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pillAction} onPress={handleShare} activeOpacity={0.75}>
              <Share2 size={13} color={Colors.textPrimary} />
              <Text style={styles.pillActionText}>SHARE GUESTS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pillActionGold} onPress={handleViewLive} activeOpacity={0.75}>
              <ExternalLink size={13} color={Colors.primary} />
              <Text style={styles.pillActionGoldText}>VIEW LIVE</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation CTAs */}
        <View style={styles.footerCtas}>
          <TouchableOpacity
            style={styles.primaryCta}
            onPress={handleGoToMyInvitations}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryCtaText}>Go to My Invitations</Text>
            <ArrowRight size={17} color="#FFF9F2" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  celebrationWrapper: {
    marginBottom: 20,
  },
  outerGlow: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(216, 183, 123, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerSeal: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.champagneGold,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.mutedGold,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  mainTitle: {
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  boldTitle: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  urlCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(216, 183, 123, 0.45)',
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 28,
  },
  urlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  urlHeaderStatus: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
    letterSpacing: 0.5,
  },
  urlText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 14,
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pillAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cream,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActionText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  pillActionGold: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF5ED',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.champagneGold,
  },
  pillActionGoldText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.primary,
  },
  footerCtas: {
    width: '100%',
  },
  primaryCta: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryCtaText: {
    color: '#FFF9F2',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
