/**
 * You Are Mine — Approved Template Renderer Registry
 *
 * Security & Architectural Guard:
 * Decouples database template configurations from executable React components.
 * Only pre-approved application renderers may be assigned or executed.
 * Uploading or executing arbitrary server/client scripts is strictly prohibited.
 */

export interface RendererDefinition {
  id: string;
  name: string;
  category: string;
  tier: "PREMIUM" | "SIGNATURE" | "DELUXE" | "ROYAL";
  description: string;
  targetRoute: string;
  supportedSections: string[];
  defaultPriceINR: number;
  previewThumbnail: string;
  isAvailable: boolean;
}

export const APPROVED_RENDERER_REGISTRY: Record<string, RendererDefinition> = {
  "wedding-imperial-navy": {
    id: "wedding-imperial-navy",
    name: "Imperial Navy Moving Gate",
    category: "Wedding",
    tier: "PREMIUM",
    description: "Moving golden foil entrance doors with live sitar & shehnai soundtrack, events schedule, and family invites.",
    targetRoute: "/template-01",
    supportedSections: ["opening", "hero", "welcome", "story", "events", "venue", "family", "music", "closing"],
    defaultPriceINR: 299,
    previewThumbnail: "/images/templates/royal-navy-wedding-card.jpg",
    isAvailable: true,
  },
  "wedding-lake-palace": {
    id: "wedding-lake-palace",
    name: "Royal Lake Palace Heritage",
    category: "Wedding",
    tier: "SIGNATURE",
    description: "Regal lakeside pavilion aesthetic with lotus motifs, marigold garlands, and 8-section cinematic story timeline.",
    targetRoute: "/template-02",
    supportedSections: ["opening", "hero", "welcome", "story", "events", "venue", "gallery", "music", "closing"],
    defaultPriceINR: 499,
    previewThumbnail: "/images/templates/arjun-sia-heritage-card.jpg",
    isAvailable: true,
  },
  "wedding-temple-thirumanam": {
    id: "wedding-temple-thirumanam",
    name: "Thirumanam South Indian Temple Wedding",
    category: "Wedding",
    tier: "SIGNATURE",
    description: "Traditional temple wedding with auspicious Kanjeevaram silk doors, kolam mandap, and sacred muhurtham schedule.",
    targetRoute: "/template-03",
    supportedSections: ["opening", "hero", "welcome", "story", "events", "muhurtham", "family", "music", "closing"],
    defaultPriceINR: 499,
    previewThumbnail: "/images/templates/thirumanam-temple-card.jpg",
    isAvailable: true,
  },
  "wedding-paper-palace": {
    id: "wedding-paper-palace",
    name: "Paper Palace Pop-Up Wedding Invitation",
    category: "Wedding",
    tier: "ROYAL",
    description: "Interactive 3D opening doors, Kaagaz Mahal pop-up puzzle, scratch-off event reveal, flower garland stringing, and WhatsApp wishes.",
    targetRoute: "/template-04",
    supportedSections: ["opening", "hero", "letter", "palace-puzzle", "countdown", "events", "varmala", "wishes", "music", "closing"],
    defaultPriceINR: 499,
    previewThumbnail: "/images/templates/paper-palace-card.jpg",
    isAvailable: true,
  },
  "birthday-interactive": {
    id: "birthday-interactive",
    name: "Interactive Birthday Surprise",
    category: "Birthday",
    tier: "DELUXE",
    description: "Interactive candle blowing, polaroid memories gallery, wax-sealed personal letter, and 3D gift box opening.",
    targetRoute: "/birthday",
    supportedSections: ["opening", "hero", "candle-blow", "gallery", "letter", "gift-box", "music"],
    defaultPriceINR: 349,
    previewThumbnail: "/images/birthday/birthday-preview-card.jpg",
    isAvailable: true,
  },
  "valentine-proposal": {
    id: "valentine-proposal",
    name: "Will You Be My Valentine? Love Letter",
    category: "Valentine's Day",
    tier: "PREMIUM",
    description: "Romantic digital love letter with interactive YES/NO proposal buttons and custom love story chapters.",
    targetRoute: "/valentine",
    supportedSections: ["opening", "hero", "letter", "proposal-question", "gallery", "music"],
    defaultPriceINR: 399,
    previewThumbnail: "/images/valentine/valentine-preview-card.jpg",
    isAvailable: true,
  },
  "date-planner-interactive": {
    id: "date-planner-interactive",
    name: "Our Date Planner Interactive Experience",
    category: "Valentine's Day",
    tier: "SIGNATURE",
    description: "Interactive romantic date book allowing selection of date, timing, activity, dining, and auto-dispatch to WhatsApp.",
    targetRoute: "/date-planner",
    supportedSections: ["opening", "hero", "calendar", "time-slot", "activity", "cuisine", "vibe", "summary"],
    defaultPriceINR: 349,
    previewThumbnail: "/images/date-planner/sunset-date.jpg",
    isAvailable: true,
  },
};

/**
 * Validates whether a renderer identifier is approved in the registry.
 */
export function isApprovedRenderer(rendererId: string): boolean {
  return Boolean(APPROVED_RENDERER_REGISTRY[rendererId]?.isAvailable);
}

/**
 * Returns all approved renderers as a list for dropdown selectors.
 */
export function getApprovedRenderersList(): RendererDefinition[] {
  return Object.values(APPROVED_RENDERER_REGISTRY);
}

/**
 * Resolves the preview route for a given renderer ID and custom query payload.
 */
export function resolveRendererPreviewUrl(rendererId: string, customParams?: Record<string, string>): string {
  const def = APPROVED_RENDERER_REGISTRY[rendererId];
  const baseUrl = def ? def.targetRoute : "/template-01";

  if (!customParams || Object.keys(customParams).length === 0) {
    return `${baseUrl}?mode=preview`;
  }

  const query = new URLSearchParams({ mode: "preview", ...customParams });
  return `${baseUrl}?${query.toString()}`;
}
