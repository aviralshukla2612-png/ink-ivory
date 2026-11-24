import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../constants/colors';

export function LotusLogo({ size = 36, color = Colors.champagneGold }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Central Petal */}
      <Path
        d="M12 3C12 3 9 7.5 9 12C9 14.5 10.3 17 12 18C13.7 17 15 14.5 15 12C15 7.5 12 3 12 3Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left Petal */}
      <Path
        d="M9 7C6.5 8.5 4 11.5 4 14.5C4 16.5 5.5 18 7.5 18C9.5 18 10.8 16.5 11.5 15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Petal */}
      <Path
        d="M15 7C17.5 8.5 20 11.5 20 14.5C20 16.5 18.5 18 16.5 18C14.5 18 13.2 16.5 12.5 15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom Base Arc */}
      <Path
        d="M6 19.5C9.5 20.8 14.5 20.8 18 19.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default LotusLogo;
