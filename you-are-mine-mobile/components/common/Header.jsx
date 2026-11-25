import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { BrandEmblem } from './BrandEmblem';

export function Header({
  title,
  showBack = false,
  showNotification = true,
  showLogoWithTitle = false,
  rightAction = null,
  onBackPress = null,
}) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Left Slot: Back Button or Empty */}
      <View style={styles.sideSlot}>
        {showBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress || (() => router.back())}
            activeOpacity={0.7}
          >
            <ChevronLeft size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Center Slot: Brand Logo & Title */}
      <View style={styles.centerSlot}>
        {title ? (
          <View style={styles.titleRow}>
            {showLogoWithTitle && (
              <View style={styles.headerEmblemWrap}>
                <BrandEmblem size={22} color={Colors.primary} secondaryColor={Colors.champagneGold} />
              </View>
            )}
            <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
          </View>
        ) : (
          <View style={styles.brandRow}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.brandLogoImage}
              resizeMode="contain"
            />
          </View>
        )}
      </View>

      {/* Right Slot: Notification Bell or Custom Action */}
      <View style={[styles.sideSlot, styles.rightSlot]}>
        {rightAction ? (
          rightAction
        ) : showNotification ? (
          <TouchableOpacity
            style={styles.notificationButton}
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Bell size={20} color={Colors.textPrimary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  sideSlot: {
    width: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  rightSlot: {
    alignItems: 'flex-end',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogoImage: {
    width: 145,
    height: 42,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerEmblemWrap: {
    marginRight: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'serif',
    letterSpacing: 0.5,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notificationDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});

export default Header;
