import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { MoreVertical, ExternalLink, Clock, CheckCircle2 } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

/**
 * Format relative timestamp (e.g., 'Updated 2 hours ago', 'Updated yesterday')
 */
function formatRelativeTime(dateString) {
  if (!dateString) return 'Updated recently';
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 5) return 'Updated just now';
  if (diffMins < 60) return `Updated ${diffMins} mins ago`;
  if (diffHours === 1) return 'Updated 1 hour ago';
  if (diffHours < 24) return `Updated ${diffHours} hours ago`;
  if (diffDays === 1) return 'Updated yesterday';
  if (diffDays < 7) return `Updated ${diffDays} days ago`;
  return `Updated ${past.toLocaleDateString()}`;
}

export function InvitationCard({
  invitation,
  onPress,
  onMorePress,
}) {
  const isPublished = invitation.status === 'PUBLISHED' || Boolean(invitation.slug);
  const title = invitation.title || invitation.fields?.names || 'Bespoke Invitation';
  const occasion = invitation.templateTitle || invitation.category || 'Celebration';
  const thumbnail =
    invitation.fields?.couple_photo ||
    invitation.thumbnail ||
    invitation.previewImage ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailWrapper}>
        <Image
          source={{ uri: thumbnail }}
          style={styles.thumbnail}
          contentFit="cover"
          transition={250}
        />
        <View style={styles.thumbnailBorder} />
      </View>

      {/* Info Column */}
      <View style={styles.infoCol}>
        <View style={styles.titleRow}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Status Badge */}
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.statusBadge,
              isPublished ? styles.publishedBadge : styles.draftBadge,
            ]}
          >
            {isPublished ? (
              <CheckCircle2 size={11} color="#2E7D32" style={styles.badgeIcon} />
            ) : null}
            <Text
              style={[
                styles.statusText,
                isPublished ? styles.publishedText : styles.draftText,
              ]}
            >
              {isPublished ? 'Published' : 'Draft'}
            </Text>
          </View>
          <Text style={styles.occasionText} numberOfLines={1}>
            • {occasion}
          </Text>
        </View>

        {/* Subtitle / Timestamp / Live link */}
        {isPublished ? (
          <View style={styles.liveLinkRow}>
            <Text style={styles.liveLinkText}>Live • View Invitation</Text>
            <ExternalLink size={12} color={Colors.primary} style={styles.liveLinkIcon} />
          </View>
        ) : (
          <View style={styles.timestampRow}>
            <Clock size={11} color={Colors.textSecondary} style={styles.timeIcon} />
            <Text style={styles.timestampText}>
              {formatRelativeTime(invitation.updatedAt)}
            </Text>
          </View>
        )}
      </View>

      {/* 3-dots Menu Button */}
      <TouchableOpacity
        style={styles.moreBtn}
        onPress={onMorePress}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityLabel="More options"
      >
        <MoreVertical size={18} color={Colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(216, 183, 123, 0.4)',
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  thumbnailWrapper: {
    width: 68,
    height: 68,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F7EFE4',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(216, 183, 123, 0.5)',
  },
  infoCol: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  titleRow: {
    marginBottom: 4,
  },
  titleText: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  draftBadge: {
    backgroundColor: 'rgba(116, 30, 50, 0.08)',
    borderColor: 'rgba(116, 30, 50, 0.25)',
  },
  publishedBadge: {
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    borderColor: 'rgba(46, 125, 50, 0.3)',
  },
  badgeIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  draftText: {
    color: Colors.primary,
  },
  publishedText: {
    color: '#2E7D32',
  },
  occasionText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  liveLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  liveLinkIcon: {
    marginLeft: 4,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: 4,
  },
  timestampText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  moreBtn: {
    padding: 8,
    marginLeft: 4,
  },
});

export default InvitationCard;
