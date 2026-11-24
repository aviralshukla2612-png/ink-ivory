import React from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { DraggableElement } from './DraggableElement';
import {
  useEditorStore,
  CANVAS_LOGICAL_WIDTH,
  CANVAS_LOGICAL_HEIGHT,
} from '../../store/editor.store';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// Available viewport width accounting for outer margins
const CANVAS_DISPLAY_WIDTH = Math.min(windowWidth - 36, 360);
const CANVAS_DISPLAY_HEIGHT = (CANVAS_DISPLAY_WIDTH * CANVAS_LOGICAL_HEIGHT) / CANVAS_LOGICAL_WIDTH;
const CANVAS_SCALE = CANVAS_DISPLAY_WIDTH / CANVAS_LOGICAL_WIDTH;

export function InvitationCanvas() {
  const { elements, deselectElement } = useEditorStore();

  return (
    <TouchableWithoutFeedback onPress={deselectElement}>
      <View style={styles.canvasOuter}>
        {/* The Scalable Invitation Card Container */}
        <View
          style={[
            styles.cardContainer,
            {
              width: CANVAS_DISPLAY_WIDTH,
              height: CANVAS_DISPLAY_HEIGHT,
            },
          ]}
        >
          {/* Ornate Temple Arch & Decorative Bells (SVG Backdrop) */}
          <View style={styles.artworkBackdrop}>
            <Svg width="100%" height="100%" viewBox={`0 0 ${CANVAS_LOGICAL_WIDTH} ${CANVAS_LOGICAL_HEIGHT}`}>
              {/* Outer Golden Border Arch */}
              <Path
                d={`M 18 100 Q 18 20 ${CANVAS_LOGICAL_WIDTH / 2} 20 Q ${CANVAS_LOGICAL_WIDTH - 18} 20 ${CANVAS_LOGICAL_WIDTH - 18} 100 L ${CANVAS_LOGICAL_WIDTH - 18} ${CANVAS_LOGICAL_HEIGHT - 24} Q ${CANVAS_LOGICAL_WIDTH - 18} ${CANVAS_LOGICAL_HEIGHT - 12} ${CANVAS_LOGICAL_WIDTH - 30} ${CANVAS_LOGICAL_HEIGHT - 12} L 30 ${CANVAS_LOGICAL_HEIGHT - 12} Q 18 ${CANVAS_LOGICAL_HEIGHT - 12} 18 ${CANVAS_LOGICAL_HEIGHT - 24} Z`}
                stroke={Colors.champagneGold}
                strokeWidth="2"
                fill="none"
              />
              {/* Inner Fine Arch */}
              <Path
                d={`M 26 104 Q 26 30 ${CANVAS_LOGICAL_WIDTH / 2} 30 Q ${CANVAS_LOGICAL_WIDTH - 26} 30 ${CANVAS_LOGICAL_WIDTH - 26} 104 L ${CANVAS_LOGICAL_WIDTH - 26} ${CANVAS_LOGICAL_HEIGHT - 28} L 26 ${CANVAS_LOGICAL_HEIGHT - 28} Z`}
                stroke={Colors.mutedGold}
                strokeWidth="1"
                strokeDasharray="4,3"
                fill="none"
              />
              {/* Decorative Hanging Temple Bells / Lanterns */}
              <Circle cx="60" cy="55" r="4" fill={Colors.champagneGold} />
              <Path d="M 60 30 L 60 55" stroke={Colors.champagneGold} strokeWidth="1" />
              <Circle cx={CANVAS_LOGICAL_WIDTH - 60} cy="55" r="4" fill={Colors.champagneGold} />
              <Path d={`M ${CANVAS_LOGICAL_WIDTH - 60} 30 L ${CANVAS_LOGICAL_WIDTH - 60} 55`} stroke={Colors.champagneGold} strokeWidth="1" />

              <Circle cx="100" cy="72" r="5" fill={Colors.champagneGold} />
              <Path d="M 100 30 L 100 72" stroke={Colors.champagneGold} strokeWidth="1" />
              <Circle cx={CANVAS_LOGICAL_WIDTH - 100} cy="72" r="5" fill={Colors.champagneGold} />
              <Path d={`M ${CANVAS_LOGICAL_WIDTH - 100} 30 L ${CANVAS_LOGICAL_WIDTH - 100} 72`} stroke={Colors.champagneGold} strokeWidth="1" />

              {/* Central Lotus Motif at Arch Peak */}
              <Path
                d={`M ${CANVAS_LOGICAL_WIDTH / 2} 78 C ${CANVAS_LOGICAL_WIDTH / 2 - 10} 65 ${CANVAS_LOGICAL_WIDTH / 2 - 20} 75 ${CANVAS_LOGICAL_WIDTH / 2} 90 C ${CANVAS_LOGICAL_WIDTH / 2 + 20} 75 ${CANVAS_LOGICAL_WIDTH / 2 + 10} 65 ${CANVAS_LOGICAL_WIDTH / 2} 78 Z`}
                stroke={Colors.champagneGold}
                strokeWidth="1.2"
                fill="none"
              />

              {/* Base Lotus Blossoms & Garlands */}
              <Path
                d={`M 40 ${CANVAS_LOGICAL_HEIGHT - 38} Q ${CANVAS_LOGICAL_WIDTH / 2} ${CANVAS_LOGICAL_HEIGHT - 55} ${CANVAS_LOGICAL_WIDTH - 40} ${CANVAS_LOGICAL_HEIGHT - 38}`}
                stroke={Colors.champagneGold}
                strokeWidth="1.5"
                fill="none"
              />
            </Svg>
          </View>

          {/* Render All Interactive Logical Elements */}
          {Object.values(elements).map((el) => (
            <DraggableElement
              key={el.id}
              element={el}
              canvasScale={CANVAS_SCALE}
            />
          ))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  canvasOuter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  cardContainer: {
    backgroundColor: '#FFFDF9',
    borderRadius: 28,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(216, 183, 123, 0.45)',
    elevation: 6,
    shadowColor: Colors.deepBurgundy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
  },
  artworkBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default InvitationCanvas;
