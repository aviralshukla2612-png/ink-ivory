import React from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { DraggableElement } from './DraggableElement';
import { DraggableImageElement } from './DraggableImageElement';
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
  const { elements, selectedElementId, deselectElement, template } = useEditorStore();

  const design = template?.designConfig || {};
  const themeHex = String(design.themeColor || '#FFFDF9');
  const accentColor = design.accentColor || Colors.champagneGold;
  const secondaryColor = design.secondaryColor || Colors.mutedGold;

  const templateId = String(template?.id || '');
  const occasion = String(template?.occasion || '').toLowerCase();

  const isDarkNavy = templateId.includes('navy-01');
  const isBirthday = templateId.includes('birthday') || occasion.includes('birthday');
  const isValentine = templateId.includes('valentine') || occasion.includes('valentine') || templateId.includes('date-planner');
  const isTemple = templateId.includes('garden-03') || templateId.includes('south-indian');
  const isPalace = templateId.includes('gold-02') || templateId.includes('palace') || (!isDarkNavy && !isBirthday && !isValentine && !isTemple);

  // Background color matching the active template exactly
  const cardBgColor = isDarkNavy
    ? '#121E35'
    : isBirthday
    ? '#FFF8F3'
    : isValentine
    ? '#FFF5F4'
    : isTemple
    ? (themeHex.startsWith('#0') ? '#08231C' : '#FFFDF7')
    : (themeHex.startsWith('#') ? themeHex : '#FFFDF9');

  const strokeGold = isDarkNavy ? '#D7B875' : accentColor;
  const strokeMuted = isDarkNavy ? 'rgba(215, 184, 117, 0.45)' : secondaryColor;

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
              backgroundColor: cardBgColor,
              borderColor: strokeGold,
            },
          ]}
        >
          {/* Authentic Dynamic Template SVG Artwork Backdrop */}
          <View style={styles.artworkBackdrop}>
            <Svg width="100%" height="100%" viewBox={`0 0 ${CANVAS_LOGICAL_WIDTH} ${CANVAS_LOGICAL_HEIGHT}`}>
              {/* Outer Golden Border Arch */}
              <Path
                d={`M 18 100 Q 18 20 ${CANVAS_LOGICAL_WIDTH / 2} 20 Q ${CANVAS_LOGICAL_WIDTH - 18} 20 ${CANVAS_LOGICAL_WIDTH - 18} 100 L ${CANVAS_LOGICAL_WIDTH - 18} ${CANVAS_LOGICAL_HEIGHT - 24} Q ${CANVAS_LOGICAL_WIDTH - 18} ${CANVAS_LOGICAL_HEIGHT - 12} ${CANVAS_LOGICAL_WIDTH - 30} ${CANVAS_LOGICAL_HEIGHT - 12} L 30 ${CANVAS_LOGICAL_HEIGHT - 12} Q 18 ${CANVAS_LOGICAL_HEIGHT - 12} 18 ${CANVAS_LOGICAL_HEIGHT - 24} Z`}
                stroke={strokeGold}
                strokeWidth="2"
                fill="none"
              />
              {/* Inner Fine Arch */}
              <Path
                d={`M 26 104 Q 26 30 ${CANVAS_LOGICAL_WIDTH / 2} 30 Q ${CANVAS_LOGICAL_WIDTH - 26} 30 ${CANVAS_LOGICAL_WIDTH - 26} 104 L ${CANVAS_LOGICAL_WIDTH - 26} ${CANVAS_LOGICAL_HEIGHT - 28} L 26 ${CANVAS_LOGICAL_HEIGHT - 28} Z`}
                stroke={strokeMuted}
                strokeWidth="1"
                strokeDasharray="4,3"
                fill="none"
              />

              {/* Center Alignment Guide (Visible when element is selected) */}
              {selectedElementId ? (
                <Line
                  x1={CANVAS_LOGICAL_WIDTH / 2}
                  y1="24"
                  x2={CANVAS_LOGICAL_WIDTH / 2}
                  y2={CANVAS_LOGICAL_HEIGHT - 24}
                  stroke="rgba(216, 183, 123, 0.45)"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
              ) : null}

              {/* TEMPLATE AESTHETIC 1: Royal Navy Wedding — Imperial Crown Crest & Starbursts */}
              {isDarkNavy && (
                <>
                  {/* Imperial Crown at Arch Peak */}
                  <Path
                    d={`M ${CANVAS_LOGICAL_WIDTH / 2 - 16} 46 L ${CANVAS_LOGICAL_WIDTH / 2 - 10} 34 L ${CANVAS_LOGICAL_WIDTH / 2} 42 L ${CANVAS_LOGICAL_WIDTH / 2 + 10} 34 L ${CANVAS_LOGICAL_WIDTH / 2 + 16} 46 Z`}
                    stroke={strokeGold}
                    strokeWidth="1.2"
                    fill="none"
                  />
                  <Circle cx={CANVAS_LOGICAL_WIDTH / 2} cy="32" r="2.5" fill={strokeGold} />
                  <Circle cx={CANVAS_LOGICAL_WIDTH / 2 - 10} cy="30" r="2" fill={strokeGold} />
                  <Circle cx={CANVAS_LOGICAL_WIDTH / 2 + 10} cy="30" r="2" fill={strokeGold} />

                  {/* Corner Starburst Accents */}
                  <Circle cx="38" cy="38" r="2" fill={strokeGold} />
                  <Circle cx={CANVAS_LOGICAL_WIDTH - 38} cy="38" r="2" fill={strokeGold} />
                  <Circle cx="38" cy={CANVAS_LOGICAL_HEIGHT - 40} r="2" fill={strokeGold} />
                  <Circle cx={CANVAS_LOGICAL_WIDTH - 38} cy={CANVAS_LOGICAL_HEIGHT - 40} r="2" fill={strokeGold} />

                  {/* Base Imperial Scroll */}
                  <Path
                    d={`M 46 ${CANVAS_LOGICAL_HEIGHT - 42} Q ${CANVAS_LOGICAL_WIDTH / 2} ${CANVAS_LOGICAL_HEIGHT - 60} ${CANVAS_LOGICAL_WIDTH - 46} ${CANVAS_LOGICAL_HEIGHT - 42}`}
                    stroke={strokeGold}
                    strokeWidth="1.2"
                    fill="none"
                  />
                </>
              )}

              {/* TEMPLATE AESTHETIC 2: Golden Birthday Surprise — Festive Stars & Celebration Swags */}
              {isBirthday && (
                <>
                  {/* Celebration Star at Arch Peak */}
                  <Path
                    d={`M ${CANVAS_LOGICAL_WIDTH / 2} 32 L ${CANVAS_LOGICAL_WIDTH / 2 + 3} 40 L ${CANVAS_LOGICAL_WIDTH / 2 + 11} 40 L ${CANVAS_LOGICAL_WIDTH / 2 + 5} 45 L ${CANVAS_LOGICAL_WIDTH / 2 + 7} 53 L ${CANVAS_LOGICAL_WIDTH / 2} 48 L ${CANVAS_LOGICAL_WIDTH / 2 - 7} 53 L ${CANVAS_LOGICAL_WIDTH / 2 - 5} 45 L ${CANVAS_LOGICAL_WIDTH / 2 - 11} 40 L ${CANVAS_LOGICAL_WIDTH / 2 - 3} 40 Z`}
                    stroke={strokeGold}
                    strokeWidth="1"
                    fill={strokeGold}
                  />
                  {/* Confetti & Sparkle Stars */}
                  <Circle cx="64" cy="50" r="2" fill={strokeGold} />
                  <Circle cx={CANVAS_LOGICAL_WIDTH - 64} cy="50" r="2" fill={strokeGold} />
                  <Circle cx="100" cy="42" r="1.5" fill={strokeGold} />
                  <Circle cx={CANVAS_LOGICAL_WIDTH - 100} cy="42" r="1.5" fill={strokeGold} />
                  {/* Festive Swag */}
                  <Path
                    d={`M 35 70 Q 75 88 115 70 Q ${CANVAS_LOGICAL_WIDTH / 2} 88 ${CANVAS_LOGICAL_WIDTH - 115} 70 Q ${CANVAS_LOGICAL_WIDTH - 75} 88 ${CANVAS_LOGICAL_WIDTH - 35} 70`}
                    stroke={strokeMuted}
                    strokeWidth="1"
                    strokeDasharray="2,2"
                    fill="none"
                  />
                </>
              )}

              {/* TEMPLATE AESTHETIC 3: Valentine Celebration — Delicate Hearts & Rose Filigree */}
              {isValentine && (
                <>
                  {/* Heart Motif at Arch Peak */}
                  <Path
                    d={`M ${CANVAS_LOGICAL_WIDTH / 2} 48 C ${CANVAS_LOGICAL_WIDTH / 2 - 14} 34 ${CANVAS_LOGICAL_WIDTH / 2 - 20} 50 ${CANVAS_LOGICAL_WIDTH / 2} 64 C ${CANVAS_LOGICAL_WIDTH / 2 + 20} 50 ${CANVAS_LOGICAL_WIDTH / 2 + 14} 34 ${CANVAS_LOGICAL_WIDTH / 2} 48 Z`}
                    stroke={strokeGold}
                    strokeWidth="1.4"
                    fill="rgba(225, 29, 72, 0.12)"
                  />
                  {/* Hanging Heart Charms */}
                  <Circle cx="70" cy="56" r="3.5" fill={strokeGold} />
                  <Path d="M 70 32 L 70 56" stroke={strokeGold} strokeWidth="1" />
                  <Circle cx={CANVAS_LOGICAL_WIDTH - 70} cy="56" r="3.5" fill={strokeGold} />
                  <Path d={`M ${CANVAS_LOGICAL_WIDTH - 70} 32 L ${CANVAS_LOGICAL_WIDTH - 70} 56`} stroke={strokeGold} strokeWidth="1" />
                  {/* Romantic Bottom Flourish */}
                  <Path
                    d={`M 50 ${CANVAS_LOGICAL_HEIGHT - 40} Q ${CANVAS_LOGICAL_WIDTH / 2} ${CANVAS_LOGICAL_HEIGHT - 60} ${CANVAS_LOGICAL_WIDTH - 50} ${CANVAS_LOGICAL_HEIGHT - 40}`}
                    stroke={strokeGold}
                    strokeWidth="1.2"
                    fill="none"
                  />
                </>
              )}

              {/* TEMPLATE AESTHETIC 4: Thirumanam Temple Wedding — Sacred Bells & Lotus Blossom */}
              {isTemple && (
                <>
                  {/* Decorative Hanging Temple Bells / Lanterns */}
                  <Circle cx="60" cy="55" r="4" fill={strokeGold} />
                  <Path d="M 60 30 L 60 55" stroke={strokeGold} strokeWidth="1" />
                  <Circle cx={CANVAS_LOGICAL_WIDTH - 60} cy="55" r="4" fill={strokeGold} />
                  <Path d={`M ${CANVAS_LOGICAL_WIDTH - 60} 30 L ${CANVAS_LOGICAL_WIDTH - 60} 55`} stroke={strokeGold} strokeWidth="1" />

                  <Circle cx="100" cy="72" r="5" fill={strokeGold} />
                  <Path d="M 100 30 L 100 72" stroke={strokeGold} strokeWidth="1" />
                  <Circle cx={CANVAS_LOGICAL_WIDTH - 100} cy="72" r="5" fill={strokeGold} />
                  <Path d={`M ${CANVAS_LOGICAL_WIDTH - 100} 30 L ${CANVAS_LOGICAL_WIDTH - 100} 72`} stroke={strokeGold} strokeWidth="1" />

                  {/* Central Lotus Motif at Arch Peak */}
                  <Path
                    d={`M ${CANVAS_LOGICAL_WIDTH / 2} 78 C ${CANVAS_LOGICAL_WIDTH / 2 - 10} 65 ${CANVAS_LOGICAL_WIDTH / 2 - 20} 75 ${CANVAS_LOGICAL_WIDTH / 2} 90 C ${CANVAS_LOGICAL_WIDTH / 2 + 20} 75 ${CANVAS_LOGICAL_WIDTH / 2 + 10} 65 ${CANVAS_LOGICAL_WIDTH / 2} 78 Z`}
                    stroke={strokeGold}
                    strokeWidth="1.2"
                    fill="none"
                  />

                  {/* Base Lotus Blossoms & Garlands */}
                  <Path
                    d={`M 40 ${CANVAS_LOGICAL_HEIGHT - 38} Q ${CANVAS_LOGICAL_WIDTH / 2} ${CANVAS_LOGICAL_HEIGHT - 55} ${CANVAS_LOGICAL_WIDTH - 40} ${CANVAS_LOGICAL_HEIGHT - 38}`}
                    stroke={strokeGold}
                    strokeWidth="1.5"
                    fill="none"
                  />
                </>
              )}

              {/* TEMPLATE AESTHETIC 5: Royal Palace Heritage (Udaipur & Classic) — Jharokha Domes */}
              {isPalace && (
                <>
                  {/* Scalloped Palace Arch Ornament at Peak */}
                  <Path
                    d={`M ${CANVAS_LOGICAL_WIDTH / 2 - 24} 45 Q ${CANVAS_LOGICAL_WIDTH / 2 - 12} 32 ${CANVAS_LOGICAL_WIDTH / 2} 45 Q ${CANVAS_LOGICAL_WIDTH / 2 + 12} 32 ${CANVAS_LOGICAL_WIDTH / 2 + 24} 45`}
                    stroke={strokeGold}
                    strokeWidth="1.3"
                    fill="none"
                  />
                  <Circle cx={CANVAS_LOGICAL_WIDTH / 2} cy="30" r="3" fill={strokeGold} />

                  {/* Regal Corner Florets */}
                  <Circle cx="50" cy="48" r="3" fill={strokeGold} />
                  <Circle cx={CANVAS_LOGICAL_WIDTH - 50} cy="48" r="3" fill={strokeGold} />

                  {/* Base Heritage Garland */}
                  <Path
                    d={`M 45 ${CANVAS_LOGICAL_HEIGHT - 40} Q ${CANVAS_LOGICAL_WIDTH / 2} ${CANVAS_LOGICAL_HEIGHT - 58} ${CANVAS_LOGICAL_WIDTH - 45} ${CANVAS_LOGICAL_HEIGHT - 40}`}
                    stroke={strokeGold}
                    strokeWidth="1.3"
                    fill="none"
                  />
                </>
              )}
            </Svg>
          </View>

          {/* Render All Interactive Logical Elements */}
          {Object.values(elements).map((el) => {
            if (el.type === 'image') {
              // If photo is not active and no URL set, never render a placeholder image on canvas
              if (!el.hasPhoto && !el.url) {
                return null;
              }
              return (
                <DraggableImageElement
                  key={el.id}
                  element={el}
                  canvasScale={CANVAS_SCALE}
                />
              );
            }
            return (
              <DraggableElement
                key={el.id}
                element={el}
                canvasScale={CANVAS_SCALE}
              />
            );
          })}
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
