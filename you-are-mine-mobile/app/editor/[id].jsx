import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Colors } from '../../constants/colors';
import { EditorHeader } from '../../components/editor/EditorHeader';
import { InvitationCanvas } from '../../components/editor/InvitationCanvas';
import { EditorToolbar } from '../../components/editor/EditorToolbar';
import { TextEditingSheet } from '../../components/editor/TextEditingSheet';
import { ImageEditingSheet } from '../../components/editor/ImageEditingSheet';
import { MusicSelectionSheet } from '../../components/editor/MusicSelectionSheet';
import { SectionManagementSheet } from '../../components/editor/SectionManagementSheet';
import { Button } from '../../components/common/Button';
import { TemplatesService } from '../../services/templates.service';
import { useEditorStore } from '../../store/editor.store';

export default function NativeEditorScreen() {
  const { id } = useLocalSearchParams();
  const templateId = String(id || 'tpl-wedding-navy-01');

  const { initEditor, isInitializing, activeTool, template } = useEditorStore();

  const {
    data: templateData,
    isLoading: isFetchingTemplate,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['template-editor', templateId],
    queryFn: () => TemplatesService.getTemplateById(templateId),
  });

  // Hydrate editor state when template is loaded
  useEffect(() => {
    if (templateData) {
      initEditor(templateData);
    }
  }, [templateData, initEditor]);

  if (isFetchingTemplate || isInitializing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Initializing bespoke invitation canvas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !templateData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>Could not load invitation</Text>
          <Text style={styles.errorSubtext}>{error?.message || 'Unable to load template data'}</Text>
          <Button
            title="Retry"
            onPress={() => refetch()}
            variant="outline"
            size="small"
            style={{ marginTop: 14 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header with Title, Undo, Redo and Save Action */}
      <EditorHeader title={templateData?.title?.split('—')[0]?.trim() || 'Edit Invitation'} />

      {/* 2. Scalable Native Invitation Canvas with Pan Gesture Dragging */}
      <View style={styles.canvasContainer}>
        <InvitationCanvas />
      </View>

      {/* 3. Dynamic Bottom Sheets for Active Tool */}
      {activeTool === 'text' || activeTool === 'style' ? (
        <TextEditingSheet />
      ) : activeTool === 'images' ? (
        <ImageEditingSheet />
      ) : activeTool === 'music' ? (
        <MusicSelectionSheet />
      ) : activeTool === 'sections' ? (
        <SectionManagementSheet />
      ) : null}

      {/* 4. Bottom 5-Tool Toolbar */}
      <EditorToolbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  canvasContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  errorTitle: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  errorSubtext: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
