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
  const fields = { ...(template.defaultFields || {}), ...draftFields };
  const design = { ...(template.designConfig || {}), ...draftDesign };
  const savedPositions = draftDesign.elementPositions || {};

  return {
    photo: {
      id: 'photo',
      type: 'image',
      label: 'Couple Photograph',
      url: fields.photoUrl
        ? (fields.photoUrl.startsWith('http') ? fields.photoUrl : `${Config.API_BASE_URL}${fields.photoUrl}`)
        : null,
      x: savedPositions.photo?.x ?? 0,
      y: savedPositions.photo?.y ?? 65,
      width: 130,
      height: 130,
      scale: savedPositions.photo?.scale ?? 1.0,
      fit: fields.photoFit || 'cover',
      hasPhoto: !!fields.photoUrl,
    },
    eyebrow: {
      id: 'eyebrow',
      type: 'text',
      label: 'Blessing / Eyebrow',
      text: fields.eyebrow || 'CORDIALLY INVITE YOU TO THEIR',
      x: savedPositions.eyebrow?.x ?? 0,
      y: savedPositions.eyebrow?.y ?? 205,
      fontSize: savedPositions.eyebrow?.fontSize ?? 11,
      fontFamily: savedPositions.eyebrow?.fontFamily ?? 'serif',
      color: savedPositions.eyebrow?.color ?? '#8B7355',
      align: savedPositions.eyebrow?.align ?? 'center',
      letterSpacing: 2,
    },
    names: {
      id: 'names',
      type: 'text',
      label: "Couple's Names",
      text: fields.names || 'Karthik & Meenakshi',
      x: savedPositions.names?.x ?? 0,
      y: savedPositions.names?.y ?? 235,
      fontSize: savedPositions.names?.fontSize ?? 25,
      fontFamily: savedPositions.names?.fontFamily ?? 'serif',
      color: savedPositions.names?.color ?? Colors.primary,
      align: savedPositions.names?.align ?? 'center',
      letterSpacing: 0.5,
    },
    headline: {
      id: 'headline',
      type: 'text',
      label: 'Celebration Headline',
      text: fields.headline || 'Wedding Ceremony',
      x: savedPositions.headline?.x ?? 0,
      y: savedPositions.headline?.y ?? 280,
      fontSize: savedPositions.headline?.fontSize ?? 16,
      fontFamily: savedPositions.headline?.fontFamily ?? 'serif',
      color: savedPositions.headline?.color ?? '#45291F',
      align: savedPositions.headline?.align ?? 'center',
      letterSpacing: 1,
    },
    date: {
      id: 'date',
      type: 'text',
      label: 'Wedding Date',
      text: fields.date || 'DEC 21 2026',
      x: savedPositions.date?.x ?? 0,
      y: savedPositions.date?.y ?? 325,
      fontSize: savedPositions.date?.fontSize ?? 14,
      fontFamily: savedPositions.date?.fontFamily ?? 'sans-serif',
      color: savedPositions.date?.color ?? Colors.primary,
      align: savedPositions.date?.align ?? 'center',
      letterSpacing: 2,
    },
    venue: {
      id: 'venue',
      type: 'text',
      label: 'Sacred Venue',
      text: fields.venue || 'TIRUMANAM TEMPLE',
      x: savedPositions.venue?.x ?? 0,
      y: savedPositions.venue?.y ?? 365,
      fontSize: savedPositions.venue?.fontSize ?? 13,
      fontFamily: savedPositions.venue?.fontFamily ?? 'serif',
      color: savedPositions.venue?.color ?? '#45291F',
      align: savedPositions.venue?.align ?? 'center',
      letterSpacing: 1.5,
    },
    city: {
      id: 'city',
      type: 'text',
      label: 'City & State',
      text: fields.city || 'Chennai, Tamil Nadu',
      x: savedPositions.city?.x ?? 0,
      y: savedPositions.city?.y ?? 390,
      fontSize: savedPositions.city?.fontSize ?? 12,
      fontFamily: savedPositions.city?.fontFamily ?? 'sans-serif',
      color: savedPositions.city?.color ?? '#89756B',
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
    songTitle: 'Kesariya (Soulful Flute Cover)',
    audioSource: '/audio/kesariya-flute.mp3',
    audioStartTime: 0,
    audioClipDuration: 0,
  },
  events: [
    { name: 'Haldi Ceremony', date: 'Thursday, Dec 17 2026', time: '10:00 AM', venue: 'The Courtyard' },
    { name: 'Wedding Ceremony', date: 'Friday, Dec 18 2026', time: '5:00 PM', venue: 'Tirumanam Temple' },
    { name: 'Grand Reception', date: 'Saturday, Dec 19 2026', time: '8:00 PM', venue: 'Palace Grounds' },
  ],
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
        // Attempt to create a real draft on the backend
        draft = await DraftsService.createDraft({
          templateId: template.id,
          title: `${template.title} — Invitation`,
          fields: template.defaultFields || {},
          design: template.designConfig || {},
        });
      }

      // Check if there is recoverable offline data for this draft
      const localCached = await AutosaveService.getLocalCache(draft?.id);
      const activeFields = localCached?.fields || draft?.fields || template.defaultFields || {};
      const activeDesign = localCached?.design || draft?.design || template.designConfig || {};

      const elements = createDefaultElements(template, activeFields, activeDesign);

      const music = {
        songTitle: activeFields.songTitle || 'Kesariya (Soulful Flute Cover)',
        audioSource: activeFields.audioSource || '/audio/kesariya-flute.mp3',
        audioStartTime: Number(activeFields.audioStartTime) || 0,
        audioClipDuration: Number(activeFields.audioClipDuration) || 0,
      };

      const events = activeFields.events && activeFields.events.length > 0
        ? activeFields.events
        : (template.defaultFields?.events || [
            { name: 'Wedding Ceremony', date: activeFields.date || 'Dec 21, 2026', time: '7:30 PM', venue: activeFields.venue || 'Temple Mandapam' },
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
      };
    });

    fields.songTitle = music.songTitle;
    fields.audioSource = music.audioSource;
    fields.audioStartTime = Number(music.audioStartTime) || 0;
    fields.audioClipDuration = Number(music.audioClipDuration) || 0;
    fields.events = events;

    const design = {
      ...(template?.designConfig || {}),
      elementPositions,
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
      fields.events = events;

      const design = {
        ...(template?.designConfig || {}),
        elementPositions,
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
