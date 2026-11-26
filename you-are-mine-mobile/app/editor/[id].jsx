import React, { useEffect, useState } from 'react';
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
import { DraftsService } from '../../services/drafts.service';
import { useEditorStore } from '../../store/editor.store';
import { RoyalLoadingScreen } from '../../components/common/RoyalLoadingScreen';
import { RoyalMultiSlidePresentation } from '../../components/preview/RoyalMultiSlidePresentation';
import { TemplateRendererRouter } from '../../components/templates/TemplateRendererRouter';

export default function NativeEditorScreen() {
  const { id } = useLocalSearchParams();
  const targetId = String(id || 'tpl-wedding-navy-01');
  const [viewMode, setViewMode] = useState('website'); // Default: website multi-slide template

  const {
    initEditor,
    isInitializing,
    activeTool,
    template,
    templateId: currentStoreTemplateId,
  } = useEditorStore();

  const isSwitchingTemplate = Boolean(
    targetId &&
    currentStoreTemplateId &&
    targetId !== currentStoreTemplateId &&
    !targetId.startsWith('drf_')
  );

  const {
    data: editorData,
    isLoading: isFetchingData,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['editor-data', targetId],
    queryFn: async () => {
      if (targetId.startsWith('drf_')) {
        let draft = null;
        try {
          draft = await DraftsService.getDraft(targetId);
        } catch (e) {
          console.warn('Could not fetch draft, falling back to local/default:', e.message);
        }
        const templateId = draft?.templateId || 'tpl-wedding-navy-01';
        const tpl = await TemplatesService.getTemplateById(templateId);
        return { template: tpl, draft };
      } else {
        const tpl = await TemplatesService.getTemplateById(targetId);
        return { template: tpl, draft: null };
      }
    },
  });

  // Hydrate editor state when template or draft is loaded
  useEffect(() => {
    if (editorData?.template) {
      initEditor(editorData.template, editorData.draft);
    }
  }, [editorData, initEditor]);

  if (isFetchingData || isInitializing || isSwitchingTemplate) {
    return (
      <RoyalLoadingScreen
        title="BESPOKE ATELIER"
        subtitle="INVITATION CANVAS"
        message="Initializing luxury canvas, typography & royal palette..."
      />
    );
  }

  if (isError || !editorData?.template) {
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

  const activeTemplate = editorData.template;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header with Title, Mode Switcher, Undo, Redo and Save Action */}
      <EditorHeader
        title={activeTemplate?.title?.split('—')[0]?.trim() || 'Edit Invitation'}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode((prev) => (prev === 'website' ? 'canvas' : 'website'))}
      />

      {/* 2. Main Content: Website Template Presentation (Default) OR Canvas Layout */}
      {viewMode === 'website' ? (
        <TemplateRendererRouter
          template={activeTemplate}
          draftData={editorData.draft}
          isEditable={true}
        />
      ) : (
        <>
          {/* Scalable Native Invitation Canvas with Pan Gesture Dragging */}
          <View style={styles.canvasContainer}>
            <InvitationCanvas />
          </View>

          {/* Dynamic Bottom Sheets for Active Tool */}
          {activeTool === 'text' || activeTool === 'style' ? (
            <TextEditingSheet />
          ) : activeTool === 'images' ? (
            <ImageEditingSheet />
          ) : activeTool === 'music' ? (
            <MusicSelectionSheet />
          ) : activeTool === 'sections' ? (
            <SectionManagementSheet />
          ) : null}

          {/* Bottom 5-Tool Toolbar */}
          <EditorToolbar />
        </>
      )}
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
