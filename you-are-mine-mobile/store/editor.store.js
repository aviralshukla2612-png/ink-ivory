import { create } from 'zustand';
import { DraftsService } from '../services/drafts.service.js';
import { Colors } from '../constants/colors.js';

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
    eyebrow: {
      id: 'eyebrow',
      type: 'text',
      label: 'Blessing / Eyebrow',
      text: fields.eyebrow || 'CORDIALLY INVITE YOU TO THEIR',
      x: savedPositions.eyebrow?.x ?? 0,
      y: savedPositions.eyebrow?.y ?? 185,
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
      y: savedPositions.names?.y ?? 215,
      fontSize: savedPositions.names?.fontSize ?? 26,
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
      y: savedPositions.headline?.y ?? 265,
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
      y: savedPositions.date?.y ?? 315,
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
      y: savedPositions.venue?.y ?? 355,
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
      y: savedPositions.city?.y ?? 380,
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
  selectedElementId: null,
  activeTool: null, // 'text' | 'images' | 'music' | 'sections' | 'style'
  saveStatus: 'saved', // 'saved' | 'saving' | 'unsaved' | 'error'
  history: [],
  future: [],
  isInitializing: false,
  error: null,

  /**
   * Initializes the editor state from backend template and draft data.
   */
  initEditor: async (template, existingDraft = null) => {
    try {
      set({ isInitializing: true, error: null });

      let draft = existingDraft;
      if (!draft) {
        // Create a real draft on the backend if starting new
        draft = await DraftsService.createDraft({
          templateId: template.id,
          title: `${template.title} — Invitation`,
          fields: template.defaultFields || {},
          design: template.designConfig || {},
        });
      }

      const elements = createDefaultElements(
        template,
        draft?.fields || {},
        draft?.design || {}
      );

      set({
        draftId: draft?.id,
        templateId: template.id,
        template,
        elements,
        selectedElementId: null,
        activeTool: null,
        saveStatus: 'saved',
        history: [],
        future: [],
        isInitializing: false,
      });
    } catch (err) {
      set({ isInitializing: false, error: err.message });
    }
  },

  /**
   * Selects an element on the canvas.
   */
  selectElement: (id) => {
    set({ selectedElementId: id, activeTool: 'text' });
  },

  /**
   * Deselects current element.
   */
  deselectElement: () => {
    set({ selectedElementId: null, activeTool: null });
  },

  /**
   * Sets active bottom toolbar tool.
   */
  setActiveTool: (tool) => {
    set((state) => ({
      activeTool: state.activeTool === tool ? null : tool,
    }));
  },

  /**
   * Pushes current state snapshot to undo history before a mutation.
   */
  pushHistorySnapshot: () => {
    const currentElements = JSON.parse(JSON.stringify(get().elements));
    const history = [...get().history, currentElements];
    if (history.length > MAX_HISTORY) history.shift();
    set({ history, future: [], saveStatus: 'unsaved' });
  },

  /**
   * Updates text content of a specific element.
   */
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
  },

  /**
   * Updates styling (fontSize, color, align, fontFamily) of an element.
   */
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
  },

  /**
   * Updates element position coordinates during drag gesture.
   */
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
   * Undoes the last action.
   */
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
  },

  /**
   * Redoes the last undone action.
   */
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
  },

  /**
   * Checks undo/redo availability.
   */
  canUndo: () => get().history.length > 0,
  canRedo: () => get().future.length > 0,

  /**
   * Saves current draft to backend.
   */
  saveCurrentDraft: async () => {
    const { draftId, elements, template } = get();
    if (!draftId) return;

    try {
      set({ saveStatus: 'saving' });

      // Map elements back to fields and design positions
      const fields = { ...(template?.defaultFields || {}) };
      const elementPositions = {};

      Object.entries(elements).forEach(([key, el]) => {
        fields[key] = el.text;
        elementPositions[key] = {
          x: el.x,
          y: el.y,
          fontSize: el.fontSize,
          fontFamily: el.fontFamily,
          color: el.color,
          align: el.align,
        };
      });

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

      set({ saveStatus: 'saved' });
      return true;
    } catch (err) {
      console.warn('Draft save error:', err.message);
      set({ saveStatus: 'error' });
      return false;
    }
  },
}));

export default useEditorStore;
