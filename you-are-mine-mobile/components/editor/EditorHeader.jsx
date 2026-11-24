import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Undo2, Redo2, Check, AlertCircle } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { useEditorStore } from '../../store/editor.store';

export function EditorHeader({ title = 'Edit Invitation' }) {
  const router = useRouter();
  const {
    saveStatus,
    undo,
    redo,
    canUndo,
    canRedo,
    saveCurrentDraft,
  } = useEditorStore();

  const handleSave = async () => {
    await saveCurrentDraft();
  };

  const undoAvailable = canUndo();
  const redoAvailable = canRedo();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <ChevronLeft size={22} color={Colors.textPrimary} />
      </TouchableOpacity>

      {/* Screen Title */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* Action Controls: Undo, Redo, Save Status & Button */}
      <View style={styles.rightCluster}>
        {/* Undo */}
        <TouchableOpacity
          style={[styles.smallBtn, !undoAvailable && styles.disabledBtn]}
          onPress={undo}
          disabled={!undoAvailable}
          activeOpacity={0.7}
        >
          <Undo2 size={17} color={undoAvailable ? Colors.textPrimary : '#C0B3A8'} />
        </TouchableOpacity>

        {/* Redo */}
        <TouchableOpacity
          style={[styles.smallBtn, !redoAvailable && styles.disabledBtn]}
          onPress={redo}
          disabled={!redoAvailable}
          activeOpacity={0.7}
        >
          <Redo2 size={17} color={redoAvailable ? Colors.textPrimary : '#C0B3A8'} />
        </TouchableOpacity>

        {/* Save Status / Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            saveStatus === 'saved' && styles.savedBtn,
            saveStatus === 'saving' && styles.savingBtn,
          ]}
          onPress={handleSave}
          disabled={saveStatus === 'saving'}
          activeOpacity={0.8}
        >
          {saveStatus === 'saving' ? (
            <ActivityIndicator size="small" color={Colors.textLight} />
          ) : (
            <Text style={styles.saveBtnText}>
              {saveStatus === 'saved' ? 'Saved' : 'Save'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    backgroundColor: Colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.3,
    maxWidth: 150,
  },
  rightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  smallBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disabledBtn: {
    opacity: 0.45,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.deepBurgundy,
    minWidth: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedBtn: {
    backgroundColor: Colors.success,
    borderColor: '#1B5E20',
  },
  savingBtn: {
    backgroundColor: Colors.primary,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textLight,
    letterSpacing: 0.4,
  },
});

export default EditorHeader;
