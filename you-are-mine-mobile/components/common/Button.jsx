import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';

export function Button({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'text'
  size = 'medium',    // 'small' | 'medium' | 'large'
  disabled = false,
  loading = false,
  icon = null,
  style = {},
  textStyle = {},
}) {
  const getContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'text':
        return styles.textOnlyContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'text':
        return styles.textOnlyText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.baseContainer,
        getContainerStyle(),
        size === 'small' && styles.smallSize,
        size === 'large' && styles.largeSize,
        disabled && styles.disabledContainer,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.textLight : Colors.primary} size="small" />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.baseText,
              getTextStyle(),
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 22,
    gap: 8,
  },
  primaryContainer: {
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.deepBurgundy,
    elevation: 2,
    shadowColor: Colors.deepBurgundy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  secondaryContainer: {
    backgroundColor: Colors.champagneGold,
    borderWidth: 1,
    borderColor: Colors.mutedGold,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  textOnlyContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  smallSize: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  largeSize: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 28,
  },
  disabledContainer: {
    backgroundColor: '#D1C7BD',
    borderColor: '#C2B7AC',
    elevation: 0,
    shadowOpacity: 0,
  },
  baseText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  primaryText: {
    color: Colors.textLight,
  },
  secondaryText: {
    color: Colors.textPrimary,
  },
  outlineText: {
    color: Colors.primary,
  },
  textOnlyText: {
    color: Colors.primary,
  },
  disabledText: {
    color: '#8E8278',
  },
});

export default Button;
