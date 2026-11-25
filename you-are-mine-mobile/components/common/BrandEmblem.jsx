import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import { Colors } from '../../constants/colors';

/**
 * BrandEmblem
 * Pure vector SVG brand mark for YOU ARE MINE.
 * Perfectly transparent with zero rectangular bounding box artifacts.
 * Scalable to any size with full React Native SVG compatibility.
 */
export function BrandEmblem({
  size = 24,
  color = Colors.champagneGold,
  secondaryColor = Colors.primary,
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Outer Golden Wax Seal Ring */}
      <Circle
        cx="16"
        cy="16"
        r="14"
        stroke={color}
        strokeWidth="1.2"
        strokeDasharray="1.5 1.5"
      />
      <Circle
        cx="16"
        cy="16"
        r="12.5"
        stroke={color}
        strokeWidth="0.8"
      />

      {/* Royal Stationery Envelope Body */}
      <Rect
        x="8"
        y="11"
        width="16"
        height="11"
        rx="1.2"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
      />

      {/* Envelope Flap Fold Lines */}
      <Path
        d="M8.5 11.5L16 17.5L23.5 11.5"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Heart Monogram Medallion */}
      <Circle
        cx="16"
        cy="16"
        r="3"
        fill={secondaryColor}
        stroke={color}
        strokeWidth="0.8"
      />

      {/* Calligraphic Feather Quill Accent */}
      <Path
        d="M17.5 14.5C19.5 13 22 12.5 24 11C23 13.5 21.5 15.5 19 16.5"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default BrandEmblem;
