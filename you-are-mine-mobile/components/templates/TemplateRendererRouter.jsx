import React from 'react';
import { SharedWebInvitationViewport } from './SharedWebInvitationViewport';
import { UdaipurPaperPalaceEngine } from './engines/UdaipurPaperPalaceEngine';
import { RoyalMultiSlidePresentation } from '../preview/RoyalMultiSlidePresentation';

/**
 * TemplateRendererRouter
 * 
 * Clean, extensible template-selection router dispatching each template
 * identifier to its dedicated visual rendering engine.
 * 
 * - Template 04 (Udaipur Paper Palace) -> Pilot SharedWebInvitationViewport (Option D Hybrid)
 *   Fallback available: UdaipurPaperPalaceEngine
 * - Template 01 (Royal Navy) & baselines -> RoyalMultiSlidePresentation
 */
export function TemplateRendererRouter({
  template,
  draftData,
  onCustomize,
  isEditable = false,
  initialGateOpen = false,
  initialSlide = 0,
}) {
  const templateId = String(
    template?.id ||
    draftData?.templateId ||
    draftData?.id ||
    ''
  ).toLowerCase();

  // Controlled Testing Flag: set preferNativeTemplate01 to true to force native fallback
  const preferNativeTemplate01 = Boolean(
    template?.preferNative || draftData?.preferNative || false
  );

  // Template 01 (Royal Navy Palace) - Hybrid Option D with Instant Native Fallback
  if ((templateId.includes('navy') || templateId === 'tpl-wedding-navy-01') && !preferNativeTemplate01) {
    return (
      <SharedWebInvitationViewport
        template={template}
        draftData={draftData}
        onCustomize={onCustomize}
        isEditable={isEditable}
      />
    );
  }

  // Royal Celebration Templates 02, 03, 04, 05 (Option D - Hybrid Architecture)
  if (
    templateId.includes('palace-04') ||
    templateId.includes('udaipur') ||
    templateId.includes('paper-palace') ||
    templateId.includes('gold-02') ||
    templateId.includes('lake') ||
    templateId.includes('anniversary') ||
    templateId.includes('temple-03') ||
    templateId.includes('thirumanam') ||
    templateId.includes('garden-03') ||
    templateId.includes('south-indian-05') ||
    templateId.includes('indian-05') ||
    templateId.includes('tanjore')
  ) {
    return (
      <SharedWebInvitationViewport
        template={template}
        draftData={draftData}
        onCustomize={onCustomize}
        isEditable={isEditable}
      />
    );
  }

  // Valentine Celebration Template (Option D - Hybrid Architecture)
  if (templateId.includes('valentine') || templateId === 'valentine') {
    return (
      <SharedWebInvitationViewport
        template={template}
        draftData={draftData}
        onCustomize={onCustomize}
        isEditable={isEditable}
      />
    );
  }

  // Birthday Celebration Template (Option D - Hybrid Architecture)
  if (templateId.includes('birthday') || templateId === 'birthday') {
    return (
      <SharedWebInvitationViewport
        template={template}
        draftData={draftData}
        onCustomize={onCustomize}
        isEditable={isEditable}
      />
    );
  }

  // Date Planner Template (Option D - Hybrid Architecture)
  if (templateId.includes('date-planner') || templateId === 'date-planner') {
    return (
      <SharedWebInvitationViewport
        template={template}
        draftData={draftData}
        onCustomize={onCustomize}
        isEditable={isEditable}
      />
    );
  }

  // Baseline Template 01 (Royal Navy) & existing fallback engine
  return (
    <RoyalMultiSlidePresentation
      template={template}
      draftData={draftData}
      onCustomize={onCustomize}
      isEditable={isEditable}
    />
  );
}
