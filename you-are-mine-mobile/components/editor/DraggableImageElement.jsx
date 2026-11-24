import React, { useRef } from 'react';
import { View, PanResponder, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Camera, Sparkles } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { useEditorStore, CANVAS_LOGICAL_WIDTH, CANVAS_LOGICAL_HEIGHT } from '../../store/editor.store';

export function DraggableImageElement({ element, canvasScale = 1 }) {
  const {
    selectedElementId,
    selectElement,
    updateElementPosition,
    pushHistorySnapshot,
    setActiveTool,
  } = useEditorStore();

  const isSelected = selectedElementId === element.id;

  const startPos = useRef({ x: element.x, y: element.y });
  const hasMoved = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
      },
      onPanResponderGrant: () => {
        selectElement(element.id);
        setActiveTool('images');
        startPos.current = { x: element.x, y: element.y };
        hasMoved.current = false;
      },
      onPanResponderMove: (_, gestureState) => {
        hasMoved.current = true;
        const deltaX = Math.round(gestureState.dx / canvasScale);
        const deltaY = Math.round(gestureState.dy / canvasScale);

        const newX = Math.max(-100, Math.min(100, startPos.current.x + deltaX));
        const newY = Math.max(30, Math.min(CANVAS_LOGICAL_HEIGHT - 180, startPos.current.y + deltaY));

        updateElementPosition(element.id, newX, newY);
      },
      onPanResponderRelease: () => {
        if (hasMoved.current) {
          pushHistorySnapshot();
        }
      },
    })
  ).current;

  const photoWidth = (element.width || 130) * (element.scale || 1.0);
  const photoHeight = (element.height || 130) * (element.scale || 1.0);

  const defaultPlaceholder =
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80';

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.outerContainer,
        {
          top: element.y,
          transform: [{ translateX: element.x }],
        },
      ]}
    >
      {/* Arched Photo Frame with Gold Border */}
      <View
        style={[
          styles.archFrame,
          {
            width: photoWidth,
            height: photoHeight,
            borderRadius: photoWidth / 2,
          },
        ]}
      >
        <Image
          source={{ uri: element.url || defaultPlaceholder }}
          style={styles.image}
          contentFit={element.fit || 'cover'}
          transition={250}
        />
        <View style={styles.imageTint} />
      </View>

      {/* Selection Border & Corner Handles */}
      {isSelected ? (
        <View
          style={[
            styles.selectionOverlay,
            {
              width: photoWidth + 8,
              height: photoHeight + 8,
              borderRadius: (photoWidth + 8) / 2,
            },
          ]}
        >
          <View style={[styles.handle, styles.topHandle]} />
          <View style={[styles.handle, styles.bottomHandle]} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  archFrame: {
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.champagneGold,
    backgroundColor: Colors.cream,
    elevation: 3,
    shadowColor: Colors.deepBurgundy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(74, 23, 37, 0.04)',
  },
  selectionOverlay: {
    position: 'absolute',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.champagneGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.champagneGold,
    borderWidth: 1,
    borderColor: Colors.deepBurgundy,
  },
  topHandle: { top: -4 },
  bottomHandle: { bottom: -4 },
});

export default DraggableImageElement;
