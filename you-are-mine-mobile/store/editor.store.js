import { create } from 'zustand';
import { DraftsService } from '../services/drafts.service.js';
import { AutosaveService } from '../services/autosave.service.js';
import { Colors } from '../constants/colors.js';
import { Config } from '../constants/config.js';

const MAX_HISTORY = 30;

// Canvas Logical Dimensions (Reference coordinate system)
export const CANVAS_LOGICAL_WIDTH = 340;
export const CANVAS_LOGICAL_HEIGHT = 560;

/**
 * Builds default element dictionary from template fields & design configuration.
 */
function createDefaultElements(template, draftFields = {}, draftDesign = {}) {
  const fields = { ...(template?.defaultFields || {}), ...draftFields };
  const design = { ...(template?.designConfig || {}), ...draftDesign };
  const savedPositions = draftDesign.elementPositions || {};

  const themeHex = String(design.themeColor || '').toLowerCase();
  const isDarkTheme = themeHex.startsWith('#1') || themeHex.startsWith('#0') || themeHex.startsWith('#2');

  const defaultTextColor = design.textColor || (isDarkTheme ? '#EDE2CF' : '#2C1810');
  const defaultAccentColor = design.accentColor || (isDarkTheme ? '#D7B875' : Colors.primary);
  const defaultSecondaryColor = design.secondaryColor || (isDarkTheme ? '#B88E4B' : '#7C6758');
  const defaultFontFamily = design.fontFamily || 'serif';

  // Determine couple names or celebration title dynamically from template
  const defaultNames = fields.names ||
    (template?.title?.includes('—') ? template.title.split('—')[0].trim() : 'Aarav & Riya');

  const defaultHeadline = fields.headline ||
    (template?.occasion === 'Birthday'
      ? 'Birthday Celebration'
      : template?.occasion === 'Valentine'
      ? 'A Story of True Love'
      : 'The Wedding Celebration Of');

  const defaultVenue = fields.venue ||
    (template?.occasion === 'Birthday'
      ? 'The Celebration Lounge'
      : 'The Grand Palace & Gardens');

  const defaultCity = fields.city || (template?.defaultFields?.city || 'Jaipur, Rajasthan');

  const photoOptionStr = String(template?.photoOption || '').toLowerCase();
  const isNoPhotoTemplate = photoOptionStr.includes('no photo');
  const hasPhotoUrl = Boolean(fields.photoUrl || fields.couple_photo);
  const showPhoto = !isNoPhotoTemplate && hasPhotoUrl;

  const resolvedPhotoUrl = fields.photoUrl
    ? (fields.photoUrl.startsWith('http') ? fields.photoUrl : `${Config.API_BASE_URL}${fields.photoUrl}`)
    : (fields.couple_photo
        ? (fields.couple_photo.startsWith('http') ? fields.couple_photo : `${Config.API_BASE_URL}${fields.couple_photo}`)
        : null);

  // Clear vertical flow without overlap:
  // If photo is present, elements stack below it.
  // If no photo (traditional/royal), elements spread elegantly across the full arch.
  const defaultEyebrowY = showPhoto ? 185 : 85;
  const defaultHeadlineY = showPhoto ? 212 : 125;
  const defaultNamesY = showPhoto ? 245 : 175;
  const defaultDateY = showPhoto ? 298 : 248;
  const defaultVenueY = showPhoto ? 342 : 305;
  const defaultCityY = showPhoto ? 382 : 350;

  // Stale-cache healing: prevent text collisions caused by legacy draft coordinates saved in AsyncStorage
  let resolvedEyebrowY = savedPositions.eyebrow?.y ?? defaultEyebrowY;
  let resolvedHeadlineY = savedPositions.headline?.y ?? defaultHeadlineY;
  let resolvedNamesY = savedPositions.names?.y ?? defaultNamesY;
  let resolvedDateY = savedPositions.date?.y ?? defaultDateY;
  let resolvedVenueY = savedPositions.venue?.y ?? defaultVenueY;
  let resolvedCityY = savedPositions.city?.y ?? defaultCityY;

  // If headline was saved below names or on top of date/venue (legacy bug), heal back to pristine default
  if (resolvedHeadlineY >= resolvedNamesY || resolvedHeadlineY >= resolvedDateY - 20) {
    resolvedHeadlineY = defaultHeadlineY;
  }
  if (resolvedNamesY >= resolvedDateY - 15) {
    resolvedNamesY = defaultNamesY;
  }
  if (resolvedDateY >= resolvedVenueY - 15) {
    resolvedDateY = defaultDateY;
  }
  if (resolvedVenueY >= resolvedCityY - 15) {
    resolvedVenueY = defaultVenueY;
  }

  return {
    photo: {
      id: 'photo',
      type: 'image',
      label: 'Celebration Photograph',
      url: showPhoto ? resolvedPhotoUrl : null,
      x: savedPositions.photo?.x ?? 0,
      y: savedPositions.photo?.y ?? 50,
      width: 120,
      height: 120,
      scale: savedPositions.photo?.scale ?? 1.0,
      fit: fields.photoFit || 'cover',
      hasPhoto: showPhoto,
    },
    eyebrow: {
      id: 'eyebrow',
      type: 'text',
      label: 'Blessing / Eyebrow',
      text: fields.eyebrow || (template?.occasion === 'Birthday' ? 'CELEBRATING WITH JOY' : 'TOGETHER WITH THEIR FAMILIES'),
      x: savedPositions.eyebrow?.x ?? 0,
      y: resolvedEyebrowY,
      fontSize: savedPositions.eyebrow?.fontSize ?? (showPhoto ? 10.5 : 11),
      fontFamily: savedPositions.eyebrow?.fontFamily ?? defaultFontFamily,
      color: savedPositions.eyebrow?.color ?? defaultSecondaryColor,
      align: savedPositions.eyebrow?.align ?? 'center',
      letterSpacing: 2,
    },
    headline: {
      id: 'headline',
      type: 'text',
      label: 'Celebration Headline',
      text: defaultHeadline,
      x: savedPositions.headline?.x ?? 0,
      y: resolvedHeadlineY,
      fontSize: savedPositions.headline?.fontSize ?? (showPhoto ? 13 : 13.5),
      fontFamily: savedPositions.headline?.fontFamily ?? defaultFontFamily,
      color: savedPositions.headline?.color ?? defaultTextColor,
      align: savedPositions.headline?.align ?? 'center',
      letterSpacing: 1,
    },
    names: {
      id: 'names',
      type: 'text',
      label: "Names / Title",
      text: defaultNames,
      x: savedPositions.names?.x ?? 0,
      y: resolvedNamesY,
      fontSize: savedPositions.names?.fontSize ?? (showPhoto ? 22 : 26),
      fontFamily: savedPositions.names?.fontFamily ?? defaultFontFamily,
      color: savedPositions.names?.color ?? defaultAccentColor,
      align: savedPositions.names?.align ?? 'center',
      letterSpacing: 0.5,
    },
    date: {
      id: 'date',
      type: 'text',
      label: 'Celebration Date',
      text: fields.date || 'DEC 21 2026',
      x: savedPositions.date?.x ?? 0,
      y: resolvedDateY,
      fontSize: savedPositions.date?.fontSize ?? (showPhoto ? 13 : 14),
      fontFamily: savedPositions.date?.fontFamily ?? 'sans-serif',
      color: savedPositions.date?.color ?? defaultAccentColor,
      align: savedPositions.date?.align ?? 'center',
      letterSpacing: 2,
    },
    venue: {
      id: 'venue',
      type: 'text',
      label: 'Celebration Venue',
      text: defaultVenue,
      x: savedPositions.venue?.x ?? 0,
      y: resolvedVenueY,
      fontSize: savedPositions.venue?.fontSize ?? (showPhoto ? 12.5 : 13.5),
      fontFamily: savedPositions.venue?.fontFamily ?? defaultFontFamily,
      color: savedPositions.venue?.color ?? defaultTextColor,
      align: savedPositions.venue?.align ?? 'center',
      letterSpacing: 1.5,
    },
    city: {
      id: 'city',
      type: 'text',
      label: 'City & State',
      text: defaultCity,
      x: savedPositions.city?.x ?? 0,
      y: resolvedCityY,
      fontSize: savedPositions.city?.fontSize ?? (showPhoto ? 11 : 12),
      fontFamily: savedPositions.city?.fontFamily ?? 'sans-serif',
      color: savedPositions.city?.color ?? defaultSecondaryColor,
      align: savedPositions.city?.align ?? 'center',
      letterSpacing: 0.5,
    },
  };
}

export const useEditorStore = create((set, get) => ({
  draftId: null,
  templateId: null,
  template: null,
  elements: {},
  music: {
    songTitle: 'Royal Celebration Theme',
    audioSource: '/audio/aaj-sajeya.mp3',
    audioStartTime: 0,
    audioClipDuration: 0,
  },
  events: [],
  selectedElementId: null,
  activeTool: null, // 'text' | 'images' | 'music' | 'sections' | 'style'
  saveStatus: 'saved', // 'saved' | 'saving' | 'unsaved' | 'offline' | 'error'
  history: [],
  future: [],
  isInitializing: false,
  error: null,

  /**
   * Initializes editor state, checking local offline cache first.
   */
  initEditor: async (template, existingDraft = null) => {
    try {
      set({ isInitializing: true, error: null });

      let draft = existingDraft;
      if (!draft) {
        // Attempt to create a real draft on the backend, falling back gracefully to local draft
        try {
          draft = await DraftsService.createDraft({
            templateId: template.id,
            title: `${template.title} — Invitation`,
            fields: template.defaultFields || {},
            design: template.designConfig || {},
          });
        } catch (createErr) {
          console.warn('Could not create draft on server, using resilient local draft:', createErr.message);
          draft = {
            id: `drf_local_${template.id}_${Date.now()}`,
            templateId: template.id,
            title: `${template.title} — Invitation`,
            fields: template.defaultFields || {},
            design: template.designConfig || {},
          };
        }
      }

      // Check if there is recoverable offline data for this draft
      const localCached = await AutosaveService.getLocalCache(draft?.id);
      const activeFields = localCached?.fields || draft?.fields || template.defaultFields || {};
      const activeDesign = localCached?.design || draft?.design || template.designConfig || {};

      const elements = createDefaultElements(template, activeFields, activeDesign);

      const startSec = Number(activeFields.audioStartTime ?? activeDesign.audioStartTime) || 0;
      const endSec = Number(activeFields.audioEndTime ?? activeDesign.audioEndTime) || 0;
      const clipDur = Number(activeFields.audioClipDuration ?? activeDesign.audioClipDuration) ||
        (endSec > startSec ? endSec - startSec : 0);

      const defaultSong = template.defaultFields?.songTitle || 'Royal Celebration Theme';
      const defaultAudio = template.defaultFields?.audioSource || '/audio/aaj-sajeya.mp3';

      const music = {
        songTitle: activeFields.songTitle || activeDesign.songTitle || defaultSong,
        audioSource: activeFields.audioSource || activeDesign.audioSource || defaultAudio,
        audioStartTime: startSec,
        audioClipDuration: clipDur,
      };

      const events = activeFields.events && activeFields.events.length > 0
        ? activeFields.events
        : (template.defaultFields?.events && template.defaultFields.events.length > 0
            ? template.defaultFields.events
            : [
                {
                  name: template.occasion === 'Birthday' ? 'Birthday Party Celebration' : 'Celebration Ceremony',
                  date: activeFields.date || template.defaultFields?.date || 'Dec 21, 2026',
                  time: activeFields.time || template.defaultFields?.time || '5:00 PM',
                  venue: activeFields.venue || template.defaultFields?.venue || 'The Grand Venue',
                },
              ]);

      set({
        draftId: draft?.id,
        templateId: template.id,
        template,
        elements,
        music,
        events,
        selectedElementId: null,
        activeTool: null,
        saveStatus: localCached ? 'unsaved' : 'saved',
        history: [],
        future: [],
        isInitializing: false,
      });
    } catch (err) {
      set({ isInitializing: false, error: err.message });
    }
  },

  selectElement: (id) => {
    const isImage = id === 'photo';
    set({
      selectedElementId: id,
      activeTool: isImage ? 'images' : 'text',
    });
  },

  deselectElement: () => {
    set({ selectedElementId: null, activeTool: null });
  },

  setActiveTool: (tool) => {
    set((state) => ({
      activeTool: state.activeTool === tool ? null : tool,
    }));
  },

  pushHistorySnapshot: () => {
    const currentElements = JSON.parse(JSON.stringify(get().elements));
    const history = [...get().history, currentElements];
    if (history.length > MAX_HISTORY) history.shift();
    set({ history, future: [], saveStatus: 'unsaved' });
  },

  triggerDebouncedAutosave: () => {
    const { draftId, elements, music, events, template } = get();
    if (!draftId) return;

    const fields = { ...(template?.defaultFields || {}) };
    const elementPositions = {};

    Object.entries(elements).forEach(([key, el]) => {
      if (el.type === 'text') {
        fields[key] = el.text;
      } else if (el.type === 'image') {
        fields.photoUrl = el.url;
        fields.photoScale = el.scale;
      }
      elementPositions[key] = {
        x: el.x,
        y: el.y,
        fontSize: el.fontSize,
        fontFamily: el.fontFamily,
        color: el.color,
        align: el.align,
        scale: el.scale,
        fontWeight: el.fontWeight,
        letterSpacing: el.letterSpacing,
        zIndex: el.zIndex || 1,
      };
    });

    fields.songTitle = music.songTitle;
    fields.audioSource = music.audioSource;
    fields.audioStartTime = Number(music.audioStartTime) || 0;
    fields.audioClipDuration = Number(music.audioClipDuration) || 0;
    const clipDur = Number(music.audioClipDuration) || 0;
    const startSec = Number(music.audioStartTime) || 0;
    fields.audioEndTime = clipDur > 0 ? startSec + clipDur : 0;
    fields.events = events;

    const design = {
      ...(template?.designConfig || {}),
      elementPositions,
      audioStartTime: startSec,
      audioClipDuration: clipDur,
      audioEndTime: clipDur > 0 ? startSec + clipDur : 0,
      audioSource: music.audioSource,
      songTitle: music.songTitle,
    };

    AutosaveService.triggerAutosave(
      draftId,
      {
        title: fields.names ? `${fields.names} — Invitation` : template?.title,
        fields,
        design,
        status: 'DRAFT',
      },
      (newStatus) => set({ saveStatus: newStatus })
    );
  },

  updateElementText: (id, newText) => {
    get().pushHistorySnapshot();
    set((state) => ({
      elements: {
        ...state.elements,
        [id]: {
          ...state.elements[id],
          text: newText,
        },
      },
      saveStatus: 'unsaved',
    }));
    get().triggerDebouncedAutosave();
  },

  updateElementStyle: (id, styleProps) => {
    get().pushHistorySnapshot();
    set((state) => ({
      elements: {
        ...state.elements,
        [id]: {
          ...state.elements[id],
          ...styleProps,
        },
      },
      saveStatus: 'unsaved',
    }));
    get().triggerDebouncedAutosave();
  },

  updateElementPosition: (id, newX, newY) => {
    set((state) => ({
      elements: {
        ...state.elements,
        [id]: {
          ...state.elements[id],
          x: newX,
          y: newY,
        },
      },
      saveStatus: 'unsaved',
    }));
  },

  /**
   * Layer Ordering (Z-Index)
   */
  reorderElementLayer: (id, direction) => {
    get().pushHistorySnapshot();
    set((state) => {
      const el = state.elements[id];
      if (!el) return state;
      const currentZ = el.zIndex || 1;
      const newZ = direction === 'forward' ? currentZ + 1 : Math.max(1, currentZ - 1);
      return {
        elements: {
          ...state.elements,
          [id]: { ...el, zIndex: newZ },
        },
        saveStatus: 'unsaved',
      };
    });
    get().triggerDebouncedAutosave();
  },

  /**
   * Reset Single Element to Template Default
   */
  resetElementToDefault: (id) => {
    const { template } = get();
    if (!template) return;
    const defaults = createDefaultElements(template, template.defaultFields || {}, template.designConfig || {});
    if (!defaults[id]) return;

    get().pushHistorySnapshot();
    set((state) => ({
      elements: {
        ...state.elements,
        [id]: { ...defaults[id] },
      },
      saveStatus: 'unsaved',
    }));
    get().triggerDebouncedAutosave();
  },

  /**
   * Reset Entire Canvas to Template Defaults
   */
  resetCanvasToDefault: () => {
    const { template } = get();
    if (!template) return;
    const defaults = createDefaultElements(template, template.defaultFields || {}, template.designConfig || {});

    get().pushHistorySnapshot();
    set({
      elements: defaults,
      saveStatus: 'unsaved',
    });
    get().triggerDebouncedAutosave();
  },

  /**
   * Couple Photo Mutations
   */
  updateCouplePhoto: (url) => {
    get().pushHistorySnapshot();
    set((state) => ({
      elements: {
        ...state.elements,
        photo: {
          ...state.elements.photo,
          url,
          hasPhoto: !!url,
        },
      },
      saveStatus: 'unsaved',
    }));
    get().triggerDebouncedAutosave();
  },

  updatePhotoScale: (scale) => {
    get().pushHistorySnapshot();
    set((state) => ({
      elements: {
        ...state.elements,
        photo: {
          ...state.elements.photo,
          scale,
        },
      },
      saveStatus: 'unsaved',
    }));
    get().triggerDebouncedAutosave();
  },

  removeCouplePhoto: () => {
    get().pushHistorySnapshot();
    set((state) => ({
      elements: {
        ...state.elements,
        photo: {
          ...state.elements.photo,
          url: null,
          hasPhoto: false,
        },
      },
      saveStatus: 'unsaved',
    }));
    get().triggerDebouncedAutosave();
  },

  /**
   * Music Selection Mutation
   */
  selectMusicTrack: (track) => {
    get().pushHistorySnapshot();
    set((state) => ({
      music: {
        ...state.music,
        songTitle: track.title,
        audioSource: track.source,
        audioStartTime: 0,
        audioClipDuration: state.music.audioClipDuration || 0,
      },
      saveStatus: 'unsaved',
    }));
    get().triggerDebouncedAutosave();
  },

  /**
   * Instagram-Style Audio Start Time & Clip Duration Timing Mutation
   */
  setMusicTiming: (audioStartTime, audioClipDuration = 0) => {
    get().pushHistorySnapshot();
    set((state) => ({
      music: {
        ...state.music,
        audioStartTime: Number(audioStartTime) || 0,
        audioClipDuration: Number(audioClipDuration) || 0,
      },
      saveStatus: 'unsaved',
    }));
    get().triggerDebouncedAutosave();
  },

  /**
   * Section Timeline Event Mutations
   */
  updateEvent: (index, eventData) => {
    get().pushHistorySnapshot();
    set((state) => {
      const updatedEvents = [...state.events];
      updatedEvents[index] = { ...updatedEvents[index], ...eventData };
      return { events: updatedEvents, saveStatus: 'unsaved' };
    });
    get().triggerDebouncedAutosave();
  },

  addEvent: (eventData) => {
    get().pushHistorySnapshot();
    set((state) => ({
      events: [...state.events, eventData],
      saveStatus: 'unsaved',
    }));
    get().triggerDebouncedAutosave();
  },

  removeEvent: (index) => {
    get().pushHistorySnapshot();
    set((state) => ({
      events: state.events.filter((_, i) => i !== index),
      saveStatus: 'unsaved',
    }));
    get().triggerDebouncedAutosave();
  },

  reorderEvent: (index, direction) => {
    const { events } = get();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= events.length) return;

    get().pushHistorySnapshot();
    const updated = [...events];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    set({ events: updated, saveStatus: 'unsaved' });
    get().triggerDebouncedAutosave();
  },

  undo: () => {
    const { history, elements, future } = get();
    if (history.length === 0) return;

    const previousElements = history[history.length - 1];
    const newHistory = history.slice(0, history.length - 1);
    const newFuture = [JSON.parse(JSON.stringify(elements)), ...future];

    set({
      elements: previousElements,
      history: newHistory,
      future: newFuture,
      saveStatus: 'unsaved',
    });
    get().triggerDebouncedAutosave();
  },

  redo: () => {
    const { future, elements, history } = get();
    if (future.length === 0) return;

    const nextElements = future[0];
    const newFuture = future.slice(1);
    const newHistory = [...history, JSON.parse(JSON.stringify(elements))];

    set({
      elements: nextElements,
      history: newHistory,
      future: newFuture,
      saveStatus: 'unsaved',
    });
    get().triggerDebouncedAutosave();
  },

  canUndo: () => get().history.length > 0,
  canRedo: () => get().future.length > 0,

  saveCurrentDraft: async () => {
    const { draftId, elements, music, events, template } = get();
    if (!draftId) return;

    try {
      set({ saveStatus: 'saving' });

      const fields = { ...(template?.defaultFields || {}) };
      const elementPositions = {};

      Object.entries(elements).forEach(([key, el]) => {
        if (el.type === 'text') {
          fields[key] = el.text;
        } else if (el.type === 'image') {
          fields.photoUrl = el.url;
          fields.photoScale = el.scale;
        }
        elementPositions[key] = {
          x: el.x,
          y: el.y,
          fontSize: el.fontSize,
          fontFamily: el.fontFamily,
          color: el.color,
          align: el.align,
          scale: el.scale,
        };
      });

      fields.songTitle = music.songTitle;
      fields.audioSource = music.audioSource;
      fields.audioStartTime = Number(music.audioStartTime) || 0;
      fields.audioClipDuration = Number(music.audioClipDuration) || 0;
      const clipDur = Number(music.audioClipDuration) || 0;
      const startSec = Number(music.audioStartTime) || 0;
      fields.audioEndTime = clipDur > 0 ? startSec + clipDur : 0;
      fields.events = events;

      const design = {
        ...(template?.designConfig || {}),
        elementPositions,
        audioStartTime: startSec,
        audioClipDuration: clipDur,
        audioEndTime: clipDur > 0 ? startSec + clipDur : 0,
        audioSource: music.audioSource,
        songTitle: music.songTitle,
      };

      await DraftsService.updateDraft(draftId, {
        title: fields.names ? `${fields.names} — Invitation` : template?.title,
        fields,
        design,
        status: 'DRAFT',
      });

      await AutosaveService.clearLocalCache(draftId);
      set({ saveStatus: 'saved' });
      return true;
    } catch (err) {
      console.warn('Manual save notice:', err.message);
      // Cache locally to ensure zero data loss
      await AutosaveService.cacheLocally(draftId, { fields, design });
      set({ saveStatus: 'offline' });
      return false;
    }
  },
}));

export default useEditorStore;
