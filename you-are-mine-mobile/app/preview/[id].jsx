import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Share,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  ChevronLeft,
  Share2,
  Edit3,
  Send,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Sparkles,
} from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Config } from '../../constants/config';
import { useEditorStore } from '../../store/editor.store';
import { DraftsService } from '../../services/drafts.service';
import { PublicationsService } from '../../services/publications.service';
import { TemplatesService } from '../../services/templates.service';
import { EnvelopeAnimation } from '../../components/preview/EnvelopeAnimation';
import { GrandEntranceGate } from '../../components/preview/GrandEntranceGate';
import { FloatingAudioPlayer } from '../../components/preview/FloatingAudioPlayer';
import { RSVPPreviewSection } from '../../components/preview/RSVPPreviewSection';
import { CeremonyTimelineSection } from '../../components/preview/CeremonyTimelineSection';
import { RoyalLoadingScreen } from '../../components/common/RoyalLoadingScreen';
import { RoyalMultiSlidePresentation } from '../../components/preview/RoyalMultiSlidePresentation';
import { TemplateRendererRouter } from '../../components/templates/TemplateRendererRouter';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function InvitationPreviewScreen() {
  const { id, slide, gate } = useLocalSearchParams();
  const router = useRouter();

  const store = useEditorStore();
  const [loading, setLoading] = useState(true);
  const [envelopeOpened, setEnvelopeOpened] = useState(gate === 'open' || Boolean(slide));
  const [draftData, setDraftData] = useState(null);
  const [publicationData, setPublicationData] = useState(null);

  const initialGateOpen = gate === 'open' || Boolean(slide);
  const initialSlide = slide ? parseInt(slide, 10) : 0;

  useEffect(() => {
    loadInvitation();
  }, [id]);

  const loadInvitation = async () => {
    setLoading(true);
    try {
      // 1. If currently active in store with same ID, read directly
      if (store.draftId === id && store.fields && Object.keys(store.fields).length > 0) {
        setDraftData({
          id: store.draftId,
          title: store.title || 'Bespoke Wedding Invitation',
          fields: store.fields,
          design: store.design,
          templateId: store.templateId,
          customAudioUrl: store.customAudioUrl || store.fields?.music_url,
          customAudioTitle: store.customAudioTitle || store.fields?.music_title,
          sections: store.sections || [],
          couplePhoto: store.couplePhoto,
          couplePhotoScale: store.couplePhotoScale || 1.0,
        });
        setLoading(false);
        return;
      }

      // 2. If ID is a template, load template directly (Live Demo mode)
      if (typeof id === 'string' && (id.startsWith('tpl-') || id.startsWith('tpl_'))) {
        try {
          const tpl = await TemplatesService.getTemplateById(id);
          if (tpl) {
            const defaultFields = tpl.defaultFields || {};
            const designConfig = tpl.designConfig || {};
            setDraftData({
              id: tpl.id,
              title: tpl.title,
              fields: defaultFields,
              design: designConfig,
              templateId: tpl.id,
              previewImageUrl: tpl.previewImageUrl,
              occasion: tpl.occasion,
              occasionBadge: tpl.occasionBadge || tpl.occasion,
              liveDemoUrl: tpl.liveDemoUrl,
              customAudioUrl: defaultFields.audioSource,
              customAudioTitle: defaultFields.songTitle,
              sections: Array.isArray(defaultFields.events) && defaultFields.events.length > 0
                ? defaultFields.events.map((ev, idx) => ({
                    id: `ev-${idx}`,
                    title: ev.name,
                    date: ev.date,
                    time: ev.time,
                    venue: ev.venue,
                  }))
                : [],
              couplePhoto: null,
              couplePhotoScale: 1.0,
              isDemo: true,
            });
            setLoading(false);
            return;
          }
        } catch (tplErr) {
          console.warn('Failed to load template as live demo:', tplErr.message);
        }
      }

      // 3. Fetch from backend drafts
      try {
        const draft = await DraftsService.getDraft(id);
        if (draft) {
          const fields = draft.fields || {};
          const design = draft.design || {};
          setDraftData({
            id: draft.id,
            title: draft.title,
            fields,
            design,
            templateId: draft.templateId,
            customAudioUrl: draft.customAudioUrl || fields.music_url,
            customAudioTitle: draft.customAudioTitle || fields.music_title,
            sections: design.sections || [],
            couplePhoto: fields.couple_photo || null,
            couplePhotoScale: fields.couple_photo_scale || 1.0,
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        // Not a direct draft or network fallback: check publications
      }

      // 3. Fallback: Check if it's a published invitation
      const pubs = await PublicationsService.getPublications();
      const pub = pubs.find((p) => p.id === id || p.draftId === id || p.slug === id);
      if (pub) {
        setPublicationData(pub);
        const snapshot = pub.snapshotData || {};
        const fields = snapshot.fields || {};
        const design = snapshot.design || {};
        setDraftData({
          id: pub.draftId || pub.id,
          title: snapshot.title || pub.templateTitle || 'Published Invitation',
          fields,
          design,
          templateId: pub.templateId,
          customAudioUrl: snapshot.customAudioUrl || fields.music_url,
          customAudioTitle: snapshot.customAudioTitle || fields.music_title,
          sections: design.sections || [],
          couplePhoto: fields.couple_photo || null,
          couplePhotoScale: fields.couple_photo_scale || 1.0,
          isPublished: true,
          slug: pub.slug,
          liveUrl: pub.liveUrl,
        });
        setLoading(false);
        return;
      }

      // 4. Fallback: Check if it's a template ID (Live Demo mode)
      try {
        const tpl = await TemplatesService.getTemplateById(id);
        if (tpl) {
          const defaultFields = tpl.defaultFields || {};
          const designConfig = tpl.designConfig || {};
          setDraftData({
            id: tpl.id,
            title: tpl.title,
            fields: defaultFields,
            design: designConfig,
            templateId: tpl.id,
            previewImageUrl: tpl.previewImageUrl,
            occasion: tpl.occasion,
            occasionBadge: tpl.occasionBadge || tpl.occasion,
            liveDemoUrl: tpl.liveDemoUrl,
            customAudioUrl: defaultFields.audioSource,
            customAudioTitle: defaultFields.songTitle,
            sections: Array.isArray(defaultFields.events) && defaultFields.events.length > 0
              ? defaultFields.events.map((ev, idx) => ({
                  id: `ev-${idx}`,
                  title: ev.name,
                  date: ev.date,
                  time: ev.time,
                  venue: ev.venue,
                }))
              : [],
            couplePhoto: null,
            couplePhotoScale: 1.0,
            isDemo: true,
          });
        }
      } catch (tplErr) {
        console.warn('Failed to load template as live demo:', tplErr.message);
      }
    } catch (error) {
      console.warn('Failed to load invitation for preview:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (draftData?.slug || publicationData?.slug) {
      const activeSlug = draftData?.slug || publicationData?.slug;
      try {
        await PublicationsService.sharePublishedInvitation({
          slug: activeSlug,
          title: draftData?.title,
          names: draftData?.fields?.names || 'Aarav & Riya',
        });
      } catch (err) {
        Alert.alert('Share', err.message);
      }
    } else {
      Alert.alert(
        'Draft Preview',
        'This invitation is currently in draft mode. Publish your invitation to generate an official shareable celebration link for your guests!'
      );
    }
  };

  const handleEdit = () => {
    const targetDraftId = draftData?.id || id;
    router.push(`/editor/${targetDraftId}`);
  };

  const handlePublish = () => {
    const targetDraftId = draftData?.id || id;
    router.push(`/checkout/${targetDraftId}`);
  };

  if (loading) {
    return (
      <RoyalLoadingScreen
        title="ROYAL SUITE"
        subtitle="IMMERSIVE PREVIEW"
        message="Assembling bespoke celebration and 4-screen interactive suite..."
      />
    );
  }

  const fields = draftData?.fields || {};
  const coupleNames = fields.names ||
    (draftData?.title?.includes('—') ? draftData.title.split('—')[0].trim() : 'Aarav & Riya');
  const tagline = fields.tagline || fields.headline || 'The Wedding Celebration of';
  const ceremonyTitle = fields.eventTitle || 'Wedding Ceremony';
  const eventDate = fields.weddingDate || fields.date || 'December 21, 2026';
  const eventTime = fields.time || '10:30 AM';
  const venueName = fields.venueName || fields.venue || 'The Grand Heritage Palace';
  const couplePhoto = draftData?.couplePhoto || fields.couple_photo;
  const sections = draftData?.sections || [];
  const musicUrl = draftData?.customAudioUrl;
  const musicTitle = draftData?.customAudioTitle || 'Bespoke Soundtrack';
  const isPublished = Boolean(draftData?.isPublished || publicationData);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
          accessibilityLabel="Back"
        >
          <ChevronLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{draftData?.isDemo ? 'Live Demo' : 'Preview'}</Text>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleShare}
          activeOpacity={0.7}
          accessibilityLabel="Share invitation"
        >
          <Share2 size={19} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Bespoke Entrance Gate Experience (Dynamic for Each Template) */}
      {String(draftData?.templateId || id || '').toLowerCase().includes('palace-04') ||
       String(draftData?.templateId || id || '').toLowerCase().includes('udaipur') ||
       String(draftData?.templateId || id || '').toLowerCase().includes('paper-palace') ? (
        <TemplateRendererRouter
          template={draftData}
          draftData={draftData}
          onCustomize={handleEdit}
          initialGateOpen={initialGateOpen}
          initialSlide={initialSlide}
        />
      ) : !envelopeOpened ? (
        <GrandEntranceGate
          coupleNames={coupleNames}
          tagline={fields.headline || tagline}
          message={fields.message || 'Step through to immerse in sacred rituals, joyful festivities, and celebration.'}
          audioUrl={musicUrl}
          audioTitle={musicTitle}
          audioStartTime={fields.audioStartTime || 0}
          templateId={draftData?.templateId || id}
          backgroundImageUrl={draftData?.previewImageUrl}
          badgeText={draftData?.occasionBadge || draftData?.occasion || 'INVITATION'}
          buttonText={
            (draftData?.occasion || '').toLowerCase().includes('birthday')
              ? 'ENTER BIRTHDAY PARTY'
              : (draftData?.occasion || '').toLowerCase().includes('valentine')
              ? 'OPEN VALENTINE CELEBRATION'
              : 'ENTER ROYAL CELEBRATION'
          }
          onGateOpened={() => setEnvelopeOpened(true)}
        />
      ) : (
        /* Full-Screen Multi-Slide Presentation (Exact match to Website template-01) */
        <TemplateRendererRouter
          template={draftData}
          draftData={draftData}
          onCustomize={handleEdit}
        />
      )}

      {/* Floating Audio Player */}
      {musicUrl ? (
        <FloatingAudioPlayer
          trackUrl={musicUrl}
          trackTitle={musicTitle}
          startTime={fields.audioStartTime || 0}
          clipDuration={fields.audioClipDuration || 0}
        />
      ) : null}

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        {draftData?.isDemo ? (
          <TouchableOpacity
            style={styles.customizeDemoBtn}
            onPress={() => router.push(`/editor/${draftData.templateId || id}`)}
            activeOpacity={0.85}
          >
            <Sparkles size={17} color={Colors.champagne} style={styles.btnIcon} />
            <Text style={styles.customizeDemoBtnText}>Customize This Template</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={handleEdit}
              activeOpacity={0.8}
            >
              <Edit3 size={17} color={Colors.textPrimary} style={styles.btnIcon} />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.publishBtn}
              onPress={handlePublish}
              activeOpacity={0.85}
            >
              <Send size={16} color={Colors.champagne} style={styles.btnIcon} />
              <Text style={styles.publishBtnText}>Publish</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'serif',
  },
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 160, // Space for floating audio player and bottom bar
  },
  invitationSheet: {
    backgroundColor: '#FFFDF9',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(216, 183, 123, 0.4)',
    alignItems: 'center',
    position: 'relative',
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  goldCornerTL: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 18,
    height: 18,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: Colors.gold,
  },
  goldCornerTR: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 18,
    height: 18,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.gold,
  },
  goldCornerBL: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 18,
    height: 18,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: Colors.gold,
  },
  goldCornerBR: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 18,
    height: 18,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.gold,
  },
  headerTaglineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  headerTagline: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 2,
  },
  photoFrameWrapper: {
    marginVertical: 12,
  },
  photoGoldArch: {
    width: 180,
    height: 220,
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 2,
    borderColor: Colors.gold,
    overflow: 'hidden',
    backgroundColor: '#F7EFE4',
  },
  coupleImage: {
    width: '100%',
    height: '100%',
  },
  namesSerif: {
    fontFamily: 'serif',
    fontSize: 27,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 34,
    marginVertical: 10,
    paddingHorizontal: 8,
  },
  flourishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 10,
  },
  flourishLine: {
    width: 50,
    height: 1,
    backgroundColor: Colors.gold,
    opacity: 0.7,
  },
  invitationCallout: {
    fontSize: 10.5,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 1.8,
    marginBottom: 6,
  },
  ceremonyTitleSerif: {
    fontFamily: 'serif',
    fontSize: 19,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 18,
  },
  dateTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(216, 183, 123, 0.45)',
    width: '100%',
    maxWidth: 320,
    marginBottom: 16,
  },
  dateCol: {
    alignItems: 'center',
    paddingRight: 14,
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
  },
  dateDay: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  dateYear: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  badgeDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(216, 183, 123, 0.5)',
    marginRight: 14,
  },
  timeVenueCol: {
    flex: 1,
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  infoIcon: {
    marginRight: 6,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  venueNameText: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  quoteBox: {
    marginVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  quoteText: {
    fontFamily: 'serif',
    fontSize: 13,
    fontStyle: 'italic',
    color: '#6F5645',
    textAlign: 'center',
    lineHeight: 19,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 74,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.divider,
    elevation: 12,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  editBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cream,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  publishBtn: {
    flex: 1.4,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.deepBurgundy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.champagne,
    letterSpacing: 0.4,
  },
  btnIcon: {
    marginRight: 8,
  },
  customizeDemoBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.deepBurgundy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customizeDemoBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.champagne,
    letterSpacing: 0.4,
  },
});
