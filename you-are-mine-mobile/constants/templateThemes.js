/**
 * Canonical Template Themes & Design Tokens
 * 
 * Defines authentic color palettes, typography tokens, border geometries,
 * and aesthetic rules mapped 1:1 to website reference implementations.
 */

export const TemplateThemes = {
  // Template 04: Tara & Kabir — The Grand Udaipur Palace Wedding
  'tpl-wedding-paper-palace-04': {
    id: 'tpl-wedding-paper-palace-04',
    name: 'The Grand Udaipur Palace Wedding',
    colors: {
      desk: '#f4d6cc',          // Blush peach desk background
      bg: '#fff6ea',            // Warm cream paper
      paper: '#fffaf1',         // Card surface
      ink: '#5a3a3a',           // Deep warm ink text
      plum: '#a24a6a',          // Signature plum wine accent
      sage: '#9cb591',          // Sage green door / botanical accent
      peach: '#f4cba9',         // Arch outer rim
      pink: '#eaa9b8',          // Arch middle rim
      mint: '#c9e6dc',          // Secondary pastel accent
      line: '#e6d3b8',          // Delicate paper border
      gold: '#d8b479',          // Shimmering foil highlight
      goldBorder: '#e2c28a',    // Architectural door trim
      doorGreen: '#8fae88',     // Door outer surface
      doorDark: '#5f7f5a',      // Door inner edge
      cardBg: '#fffaf0',        // Invitation card fill
      cardShadow: 'rgba(162, 74, 106, 0.15)',
    },
    fonts: {
      script: 'GreatVibes',                       // Cursive wedding calligraphy
      heading: 'Baloo2-Bold',                     // Modern Indian royal sans
      subheading: 'Baloo2-SemiBold',
      serifHeading: 'CormorantGaramond-Bold',     // Classical editorial serif
      serifBody: 'CormorantGaramond-Regular',
      serifItalic: 'CormorantGaramond-Regular',
      caps: 'Baloo2-Bold',
    },
    borders: {
      archOuterRadius: 999,
      cardRadius: 24,
      pillRadius: 30,
    },
  },

  // Template 01: Aarav & Riya — The Royal Navy Wedding
  'tpl-wedding-navy-01': {
    id: 'tpl-wedding-navy-01',
    name: 'The Royal Navy Wedding',
    colors: {
      desk: '#0F1219',
      bg: '#121E35',            // Imperial Navy
      paper: '#182744',
      ink: '#EDE2CF',           // Champagne Cream text
      plum: '#D7B875',          // Royal Gold
      sage: '#2A3C5E',
      peach: '#B88E4B',
      pink: '#8C6C38',
      mint: '#1C2C4A',
      line: '#D7B875',
      gold: '#D7B875',
      goldBorder: '#D7B875',
      doorGreen: '#121E35',
      doorDark: '#080E1A',
      cardBg: '#121E35',
      cardShadow: 'rgba(0, 0, 0, 0.5)',
    },
    fonts: {
      script: 'CinzelDecorative-Bold',
      heading: 'CormorantGaramond-Bold',
      subheading: 'CormorantGaramond-SemiBold',
      serifHeading: 'CormorantGaramond-Bold',
      serifBody: 'CormorantGaramond-Regular',
      serifItalic: 'CormorantGaramond-Regular',
      caps: 'CormorantGaramond-Bold',
    },
    borders: {
      archOuterRadius: 240,
      cardRadius: 20,
      pillRadius: 999,
    },
  },

  // Template 02: Arjun & Sia — Royal Lake Palace Heritage
  'tpl-anniversary-gold-02': {
    id: 'tpl-anniversary-gold-02',
    name: 'Royal Lake Palace Heritage',
    colors: {
      desk: '#14201a',
      bg: '#22332a',            // Dark Forest Green
      paper: '#f8f2e2',
      ink: '#2a3a2e',
      plum: '#7b1d36',
      sage: '#34473a',
      peach: '#f0a020',
      pink: '#c4244d',
      mint: '#21574a',
      line: '#d9a441',
      gold: '#d9a441',
      goldBorder: '#b9842a',
      doorGreen: '#21574a',
      doorDark: '#10302a',
      cardBg: '#f8f2e2',
      cardShadow: 'rgba(0, 0, 0, 0.4)',
    },
    fonts: {
      script: 'PlayfairDisplay-Bold',
      heading: 'PlayfairDisplay-Bold',
      subheading: 'CormorantGaramond-SemiBold',
      serifHeading: 'CormorantGaramond-Bold',
      serifBody: 'CormorantGaramond-Regular',
      serifItalic: 'CormorantGaramond-Regular',
      caps: 'PlayfairDisplay-Regular',
    },
    borders: {
      archOuterRadius: 200,
      cardRadius: 24,
      pillRadius: 999,
    },
  },

  // Template 03: Thirumanam — South Indian Temple Wedding
  'tpl-wedding-temple-03': {
    id: 'tpl-wedding-temple-03',
    name: 'Thirumanam Temple Wedding',
    colors: {
      desk: '#040d0a',
      bg: '#06201a',            // Emerald Silk Night
      paper: '#fbf5e6',
      ink: '#1f2a1c',
      plum: '#6a0d20',          // Crimson
      sage: '#124a38',
      peach: '#f7de8a',
      pink: '#c92a3e',
      mint: '#0d382c',
      line: '#d9a521',
      gold: '#d9a521',
      goldBorder: '#a87819',
      doorGreen: '#0d382c',
      doorDark: '#061510',
      cardBg: '#fbf5e6',
      cardShadow: 'rgba(0, 0, 0, 0.5)',
    },
    fonts: {
      script: 'CinzelDecorative-Bold',
      heading: 'CinzelDecorative-Bold',
      subheading: 'CormorantGaramond-Bold',
      serifHeading: 'CormorantGaramond-Bold',
      serifBody: 'CormorantGaramond-Regular',
      serifItalic: 'CormorantGaramond-Regular',
      caps: 'CormorantGaramond-Bold',
    },
    borders: {
      archOuterRadius: 200,
      cardRadius: 24,
      pillRadius: 999,
    },
  },
};

/**
 * Resolves theme configuration for any given template ID or draft
 */
export function getTemplateTheme(templateId) {
  const id = String(templateId || '').toLowerCase();

  if (id.includes('palace-04') || id.includes('udaipur') || id.includes('paper-palace')) {
    return TemplateThemes['tpl-wedding-paper-palace-04'];
  }
  if (id.includes('lake') || id.includes('anniversary-gold-02') || id.includes('arjun')) {
    return TemplateThemes['tpl-anniversary-gold-02'];
  }
  if (id.includes('thirumanam') || id.includes('temple') || id.includes('garden-03')) {
    return TemplateThemes['tpl-wedding-temple-03'];
  }
  // Default to Navy Royal
  return TemplateThemes['tpl-wedding-navy-01'];
}
