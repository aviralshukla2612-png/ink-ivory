import React, { useRef } from 'react';
import { View, Text, PanResponder, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { useEditorStore, CANVAS_LOGICAL_WIDTH, CANVAS_LOGICAL_HEIGHT } from '../../store/editor.store';

export function DraggableElement({ element, canvasScale = 1 }) {
  const {
    selectedElementId,
    selectElement,
    updateElementPosition,
    pushHistorySnapshot,
  } = useEditorStore();

  const isSelected = selectedElementId === element.id;

  // Track initial logical position before drag starts
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
        startPos.current = { x: element.x, y: element.y };
        hasMoved.current = false;
      },
      onPanResponderMove: (_, gestureState) => {
        hasMoved.current = true;
        // Convert screen touch delta to canvas logical coordinates
        const deltaX = Math.round(gestureState.dx / canvasScale);
        const deltaY = Math.round(gestureState.dy / canvasScale);

        const newX = Math.max(-120, Math.min(120, startPos.current.x + deltaX));
        const newY = Math.max(80, Math.min(CANVAS_LOGICAL_HEIGHT - 60, startPos.current.y + deltaY));

        updateElementPosition(element.id, newX, newY);
      },
      onPanResponderRelease: () => {
        if (hasMoved.current) {
          // Push history snapshot so movement can be undone cleanly
          pushHistorySnapshot();
        }
      },
    })
  ).current;

  const fontStyle = {
    fontFamily: element.fontFamily === 'serif' ? 'serif' : 'sans-serif',
    fontStyle: element.fontFamily === 'script' ? 'italic' : 'normal',
    fontSize: element.fontSize,
    color: element.color || Colors.textPrimary,
    textAlign: element.align || 'center',
    letterSpacing: element.letterSpacing || 0,
    fontWeight: element.id === 'names' ? '700' : '600',
  };

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.elementWrapper,
        {
          top: element.y,
          transform: [{ translateX: element.x }],
        },
        isSelected && styles.selectedWrapper,
      ]}
    >
      <Text style={[styles.text, fontStyle]}>{element.text}</Text>

      {/* Gold Selection Border & 4 Corner Handles */}
      {isSelected ? (
        <>
          <View style={styles.selectionBorder} />
          <View style={[styles.handle, styles.topLeftHandle]} />
          <View style={[styles.handle, styles.topRightHandle]} />
          <View style={[styles.handle, styles.bottomLeftHandle]} />
          <View style={[styles.handle, styles.bottomRightHandle]} />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  elementWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedWrapper: {
    backgroundColor: 'rgba(216, 183, 123, 0.08)',
  },
  text: {
    lineHeight: 30,
  },
  selectionBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.champagneGold,
    borderRadius: 6,
  },
  handle: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: Colors.champagneGold,
    borderColor: Colors.deepBurgundy,
    borderWidth: 1,
    borderRadius: 4,
  },
  topLeftHandle: { top: -4, left: -4 },
  topRightHandle: { top: -4, right: -4 },
  bottomLeftHandle: { bottom: -4, left: -4 },
  bottomRightHandle: { bottom: -4, right: -4 },
});

export default DraggableElement;
