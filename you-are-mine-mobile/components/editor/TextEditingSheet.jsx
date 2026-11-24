import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { AlignLeft, AlignCenter, AlignRight, X, Check } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { useEditorStore } from '../../store/editor.store';

const COLOR_SWATCHES = [
  { label: 'Deep Burgundy', color: '#741E32' },
  { label: 'Champagne Gold', color: '#D8B77B' },
  { label: 'Dark Charcoal', color: '#45291F' },
  { label: 'Muted Gold', color: '#B99762' },
  { label: 'Classic Black', color: '#1A1412' },
  { label: 'Soft Blush', color: '#C48A80' },
];

const FONTS = [
  { id: 'serif', label: 'Royal Serif' },
  { id: 'sans-serif', label: 'Modern Sans' },
  { id: 'script', label: 'Romantic Script' },
];

export function TextEditingSheet() {
  const {
    selectedElementId,
    elements,
    updateElementText,
    updateElementStyle,
    deselectElement,
    setActiveTool,
  } = useEditorStore();

  if (!selectedElementId || !elements[selectedElementId]) {
    return null;
  }

  const currentElement = elements[selectedElementId];

  return (
    <View style={styles.sheetContainer}>
      {/* Header Bar */}
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Edit {currentElement.label || 'Text'}</Text>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => {
            setActiveTool(null);
          }}
          activeOpacity={0.7}
        >
          <X size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
        {/* Real-time Text Input Field */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={currentElement.text}
            onChangeText={(text) => updateElementText(selectedElementId, text)}
            placeholder="Enter invitation text..."
            placeholderTextColor="#A89B92"
            multiline
            numberOfLines={2}
          />
        </View>

        {/* Font Family Selector */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>Typography Style</Text>
          <View style={styles.fontRow}>
            {FONTS.map((font) => (
              <TouchableOpacity
                key={font.id}
                style={[
                  styles.fontChip,
                  currentElement.fontFamily === font.id && styles.activeFontChip,
                ]}
                onPress={() => updateElementStyle(selectedElementId, { fontFamily: font.id })}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.fontChipText,
                    currentElement.fontFamily === font.id && styles.activeFontChipText,
                  ]}
                >
                  {font.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Font Size & Alignment Steppers */}
        <View style={styles.controlsRow}>
          {/* Font Size */}
          <View style={styles.sizeControl}>
            <Text style={styles.sectionLabel}>Size: {currentElement.fontSize}px</Text>
            <View style={styles.stepperWrapper}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() =>
                  updateElementStyle(selectedElementId, {
                    fontSize: Math.max(10, currentElement.fontSize - 2),
                  })
                }
              >
                <Text style={styles.stepBtnText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.stepValue}>{currentElement.fontSize}</Text>

              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() =>
                  updateElementStyle(selectedElementId, {
                    fontSize: Math.min(42, currentElement.fontSize + 2),
                  })
                }
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Alignment */}
          <View style={styles.alignControl}>
            <Text style={styles.sectionLabel}>Alignment</Text>
            <View style={styles.alignGroup}>
              <TouchableOpacity
                style={[styles.alignBtn, currentElement.align === 'left' && styles.activeAlignBtn]}
                onPress={() => updateElementStyle(selectedElementId, { align: 'left' })}
              >
                <AlignLeft size={16} color={currentElement.align === 'left' ? Colors.primary : Colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.alignBtn, currentElement.align === 'center' && styles.activeAlignBtn]}
                onPress={() => updateElementStyle(selectedElementId, { align: 'center' })}
              >
                <AlignCenter size={16} color={currentElement.align === 'center' ? Colors.primary : Colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.alignBtn, currentElement.align === 'right' && styles.activeAlignBtn]}
                onPress={() => updateElementStyle(selectedElementId, { align: 'right' })}
              >
                <AlignRight size={16} color={currentElement.align === 'right' ? Colors.primary : Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Color Palette Swatches */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>Color Palette</Text>
          <View style={styles.swatchRow}>
            {COLOR_SWATCHES.map((swatch) => {
              const isSelected = currentElement.color === swatch.color;
              return (
                <TouchableOpacity
                  key={swatch.color}
                  style={[
                    styles.swatchCircle,
                    { backgroundColor: swatch.color },
                    isSelected && styles.activeSwatch,
                  ]}
                  onPress={() => updateElementStyle(selectedElementId, { color: swatch.color })}
                  activeOpacity={0.8}
                >
                  {isSelected ? <Check size={14} color="#FFFFFF" strokeWidth={2.5} /> : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: Colors.border,
    maxHeight: 280,
    elevation: 12,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  sheetTitle: {
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 14,
  },
  inputWrapper: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFDF9',
  },
  textInput: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '600',
    minHeight: 40,
  },
  sectionRow: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  fontRow: {
    flexDirection: 'row',
    gap: 8,
  },
  fontChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cream,
  },
  activeFontChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.deepBurgundy,
  },
  fontChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  activeFontChipText: {
    color: Colors.textLight,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sizeControl: {
    gap: 6,
  },
  stepperWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.cream,
  },
  stepBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  stepBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  stepValue: {
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  alignControl: {
    gap: 6,
    alignItems: 'flex-end',
  },
  alignGroup: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.cream,
  },
  alignBtn: {
    width: 34,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  activeAlignBtn: {
    backgroundColor: 'rgba(116, 30, 50, 0.1)',
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  swatchCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  activeSwatch: {
    borderColor: Colors.champagneGold,
    transform: [{ scale: 1.15 }],
  },
});

export default TextEditingSheet;
