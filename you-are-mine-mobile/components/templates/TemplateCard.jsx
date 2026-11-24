import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { useFavoritesStore } from '../../store/favorites.store';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

export function TemplateCard({ template, isHorizontal = false }) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorited = isFavorite(template.id);

  const handlePress = () => {
    router.push(`/template/${template.id}`);
  };

  const cardWidth = isHorizontal ? 170 : CARD_WIDTH;

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      {/* Image Container with Top Arch */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: template.previewImageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.imageOverlay} />

        {/* Favorite Heart Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(template.id)}
          activeOpacity={0.7}
        >
          <Heart
            size={16}
            color={favorited ? Colors.primary : '#FFFFFF'}
            fill={favorited ? Colors.primary : 'rgba(0,0,0,0.2)'}
          />
        </TouchableOpacity>
      </View>

      {/* Information Row */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {template.title?.split('—')[1]?.trim() || template.title}
        </Text>
        <Text style={styles.price}>{template.priceDisplay || `₹${template.price || 299}`}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  infoContainer: {
    paddingTop: 8,
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: 'serif',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
});

export default TemplateCard;
