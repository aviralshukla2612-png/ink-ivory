import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Heart, Play } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Config } from '../../constants/config';
import { useFavoritesStore } from '../../store/favorites.store';

export function getTemplateShowcaseImage(template) {
  const id = String(template?.id || '').toLowerCase();
  if (id.includes('navy')) return require('../../assets/showcase/navy-wedding.jpg');
  if (id.includes('anniversary') || id.includes('arjun') || id.includes('lake')) return require('../../assets/showcase/arjun-sia.jpg');
  if (id.includes('thirumanam') || id.includes('south-indian') || id.includes('temple') || id.includes('garden-03') || id.includes('indian-05')) return require('../../assets/showcase/thirumanam.jpg');
  if (id.includes('udaipur') || id.includes('paper-palace') || id.includes('palace-04')) return require('../../assets/showcase/udaipur-palace.jpg');
  if (id.includes('birthday')) return require('../../assets/showcase/birthday.jpg');
  if (id.includes('valentine') || id.includes('date-planner')) return require('../../assets/showcase/valentine.jpg');

  if (template?.previewImageUrl && typeof template.previewImageUrl === 'string' && template.previewImageUrl.startsWith('http')) {
    return { uri: template.previewImageUrl };
  }
  return require('../../assets/showcase/navy-wedding.jpg');
}

export function TemplateCard({ template, isHorizontal = false, style }) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  if (!template || !template.id) return null;

  const favorited = isFavorite(template.id);
  const cardImage = getTemplateShowcaseImage(template);

  const handlePress = () => {
    router.push(`/template/${template.id}`);
  };

  const handleOpenDemo = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    router.push(`/preview/${template.id}?mode=demo`);
  };

  const cardWidth = isHorizontal ? 195 : '48%';
  const badgeText = template.badge || (template.tags?.includes('Luxury') ? '🎬 MOVING' : '📖 STORY');
  const coupleName = template.title?.includes('—') ? template.title.split('—')[0].trim() : '';
  const cardTitle = template.title?.includes('—') ? template.title.split('—')[1].trim() : template.title;

  return (
    <View
      style={[
        styles.card,
        { width: cardWidth },
        isHorizontal && { marginBottom: 0 },
        style,
      ]}
    >
      {/* 1. Image Container with Regal Rounded Corners & Bottom Gradient */}
      <View style={styles.imageWrapper}>
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          onPress={handlePress}
          activeOpacity={0.9}
        >
          <Image
            source={cardImage}
            style={styles.image}
            contentFit={template.contentFit || "cover"}
            contentPosition={template.focalPoint || "top center"}
            transition={250}
          />
          {/* Subtle Bottom Vignette to make controls legible */}
          <View style={styles.bottomVignette} />
        </TouchableOpacity>

        {/* Top-Left Status Badge */}
        <View style={styles.badgeContainer} pointerEvents="none">
          <Text style={styles.badgeText} numberOfLines={1}>
            {badgeText}
          </Text>
        </View>

        {/* Top-Right Wishlist Heart Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(template.id)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Heart
            size={14}
            color={favorited ? Colors.primary : '#FFFFFF'}
            fill={favorited ? Colors.primary : 'rgba(0,0,0,0.2)'}
          />
        </TouchableOpacity>

        {/* Refined [▶ Live demo] Floating Pill at Bottom Center */}
        <TouchableOpacity
          style={styles.demoPill}
          onPress={handleOpenDemo}
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.demoPlayCircle}>
            <Play size={8} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 1 }} />
          </View>
          <Text style={styles.demoPillText}>Live demo</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Structured Metadata Block */}
      <TouchableOpacity
        style={styles.infoContainer}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {coupleName ? (
          <Text style={styles.coupleEyebrow} numberOfLines={1}>
            {coupleName}
          </Text>
        ) : null}

        <Text style={styles.title} numberOfLines={1}>
          {cardTitle}
        </Text>

        <View style={styles.priceRow}>
          <View style={styles.priceCol}>
            <Text style={styles.price}>{template.priceDisplay || `₹${template.price || 299}`}</Text>
            {template.originalPriceINR || template.originalPrice ? (
              <Text style={styles.originalPrice}>₹{template.originalPriceINR || template.originalPrice || 999}</Text>
            ) : null}
          </View>

          <View style={styles.occasionChip}>
            <Text style={styles.occasionChipText}>
              {template.occasionBadge || template.occasion || 'Wedding'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 0.8, // Elegant stationery proportion
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
    shadowColor: Colors.deepBurgundy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(10, 15, 26, 0.28)',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  badgeText: {
    color: '#FFFDF9',
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  demoPill: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(216, 183, 123, 0.5)',
  },
  demoPlayCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  demoPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1A0B10',
    letterSpacing: 0.2,
  },
  infoContainer: {
    paddingTop: 8,
    paddingHorizontal: 2,
  },
  coupleEyebrow: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.champagneGold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'serif',
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  priceCol: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  originalPrice: {
    fontSize: 11,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  occasionChip: {
    backgroundColor: Colors.cream,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  occasionChipText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: Colors.primary,
  },
});

export default TemplateCard;
