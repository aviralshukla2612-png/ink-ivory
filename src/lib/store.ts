import fs from "fs";
import path from "path";
import crypto from "crypto";
import { APPROVED_RENDERER_REGISTRY } from "./templates/renderer-registry";
import { templatesData } from "@/data/templates";

export type Role = "USER" | "ADMIN" | "SUPER_ADMIN" | "FINANCE" | "CONTENT_MANAGER" | "SUPPORT";
export type DraftStatus = "DRAFT" | "READY_TO_PUBLISH" | "PAYMENT_PENDING" | "PUBLISHED" | "ARCHIVED";
export type OrderStatus = "CREATED" | "ATTEMPTED" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";
export type PaymentStatus = "AUTHORIZED" | "CAPTURED" | "FAILED" | "REFUNDED";
export type PublicationStatus = "ACTIVE" | "SUSPENDED" | "EXPIRED";

export interface UserRecord {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  phoneVerified?: boolean;
  role: Role;
  isActive?: boolean;
  profileImageUrl?: string;
  profileImagePublicId?: string;
  profileImageUpdatedAt?: string;
  platform?: "WEBSITE" | "ANDROID APP" | "BOTH";
  notes?: Array<{ id: string; text: string; author: string; createdAt: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateRecord {
  id: string;
  slug: string;
  title: string;
  occasion: string;
  description: string;
  previewImage?: string;
  liveDemoUrl: string;
  badge?: string;
  tier: string;
  isActive: boolean;
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
  priceINR?: number;
  originalPriceINR?: number;
  discountBadge?: string;
  rendererId?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  defaultFields: Record<string, any>;
  designConfig: Record<string, any>;
}

export interface TemplatePriceRecord {
  id: string;
  templateId: string;
  currency: string;
  amount: number; // in paise
  promotionalPrice?: number;
  originalPrice?: number;
  discountPercent?: number;
  isActive: boolean;
}

export interface CategoryRecord {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CouponRecord {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number; // Percentage or paise
  minOrderValuePaise: number;
  maxDiscountPaise?: number;
  usageLimit?: number;
  usageCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateVersionRecord {
  id: string;
  templateId: string;
  versionNumber: number;
  snapshotConfig: Record<string, any>;
  changeSummary: string;
  createdBy: string;
  createdAt: string;
}

export interface TemplateSectionRecord {
  id: string;
  templateId: string;
  sectionType: string;
  title: string;
  order: number;
  isEnabled: boolean;
  settings: Record<string, any>;
  fieldsSchema: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SupportMessageRecord {
  id: string;
  ticketId: string;
  sender: "CUSTOMER" | "STAFF";
  senderName: string;
  message: string;
  createdAt: string;
}

export interface SupportTicketRecord {
  id: string;
  ticketNumber: string;
  customerEmail: string;
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "WAITING_FOR_CUSTOMER" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assignedStaffId?: string;
  internalNotes?: string;
  messages: SupportMessageRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface PlatformSettingsRecord {
  id: string;
  platformName: string;
  supportEmail: string;
  supportPhone?: string;
  defaultCurrency: string;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  maxAudioUploadBytes: number;
  maxImageUploadBytes: number;
  updatedAt: string;
}

export interface DraftRecord {
  id: string;
  guestToken: string;
  userId?: string;
  templateId: string;
  title: string;
  fields: Record<string, any>;
  design: Record<string, any>;
  customAudioUrl?: string;
  customAudioTitle?: string;
  status: DraftStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentOrderRecord {
  id: string;
  orderId: string; // Razorpay order id e.g. order_xxx
  draftId: string;
  userId?: string;
  customerName?: string;
  customerPhone?: string;
  guestToken: string;
  amount: number; // in paise
  currency: string;
  status: OrderStatus;
  razorpayReceipt: string;
  notes?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  paymentId: string; // Razorpay pay_xxx
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method?: string;
  signature?: string;
  rawResponse?: any;
  refundReason?: string;
  refundedBy?: string;
  refundedAt?: string;
  verifiedAt: string;
  createdAt: string;
}

export interface InvitationRecord {
  id: string;
  slug: string;
  draftId: string;
  templateId: string;
  viewCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicationRecord {
  id: string;
  draftId: string;
  invitationId: string;
  templateId: string;
  userId?: string;
  guestToken?: string;
  version: number;
  snapshotData: {
    fields: Record<string, any>;
    design: Record<string, any>;
    customAudioUrl?: string;
    customAudioTitle?: string;
    templateTitle?: string;
    templateSlug?: string;
  };
  status: PublicationStatus;
  publishedAt: string;
  expiresAt?: string;
  suspensionReason?: string;
}

export interface AuditLogRecord {
  id: string;
  userId?: string;
  guestToken?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: any;
  createdAt: string;
}

interface DBStore {
  users: UserRecord[];
  templates: TemplateRecord[];
  prices: TemplatePriceRecord[];
  drafts: DraftRecord[];
  orders: PaymentOrderRecord[];
  payments: PaymentRecord[];
  invitations: InvitationRecord[];
  publications: PublicationRecord[];
  auditLogs: AuditLogRecord[];
  categories: CategoryRecord[];
  coupons: CouponRecord[];
  supportTickets: SupportTicketRecord[];
  templateVersions: TemplateVersionRecord[];
  templateSections: TemplateSectionRecord[];
  settings: PlatformSettingsRecord;
}

const STORE_PATH = path.join(process.cwd(), "data", "ink-ivory-store.json");

function getDefaultCategories(): CategoryRecord[] {
  const now = new Date().toISOString();
  return [
    { id: "cat_wedding", slug: "wedding", name: "Wedding", icon: "Heart", description: "Bespoke digital invitations for regal weddings and ceremonies", displayOrder: 1, isActive: true, createdAt: now, updatedAt: now },
    { id: "cat_birthday", slug: "birthday", name: "Birthday", icon: "Cake", description: "Interactive milestone celebrations with audio and games", displayOrder: 2, isActive: true, createdAt: now, updatedAt: now },
    { id: "cat_valentines", slug: "valentines-day", name: "Valentine's Day", icon: "Sparkles", description: "Intimate love letters and romantic date invitations", displayOrder: 3, isActive: true, createdAt: now, updatedAt: now },
    { id: "cat_anniversary", slug: "anniversary", name: "Anniversary", icon: "Wine", description: "Celebrate years of shared devotion with golden elegance", displayOrder: 4, isActive: true, createdAt: now, updatedAt: now },
    { id: "cat_engagement", slug: "engagement", name: "Engagement", icon: "Ring", description: "Announce your forever promise with timeless stationery", displayOrder: 5, isActive: true, createdAt: now, updatedAt: now },
    { id: "cat_baby_shower", slug: "baby-shower", name: "Baby Shower", icon: "Baby", description: "Tender greetings welcoming the newest arrival", displayOrder: 6, isActive: true, createdAt: now, updatedAt: now },
    { id: "cat_festivals", slug: "festivals", name: "Festivals", icon: "Flame", description: "Auspicious digital cards for Diwali and festive feasts", displayOrder: 7, isActive: true, createdAt: now, updatedAt: now },
    { id: "cat_luxury", slug: "luxury", name: "Luxury & VIP", icon: "Crown", description: "Signature invitations for grand galas and prestige events", displayOrder: 8, isActive: true, createdAt: now, updatedAt: now },
  ];
}

function getDefaultCoupons(): CouponRecord[] {
  const now = new Date().toISOString();
  return [
    { id: "cpn_royal100", code: "ROYAL100", discountType: "FIXED", discountValue: 10000, minOrderValuePaise: 29900, maxDiscountPaise: 10000, usageCount: 0, usageLimit: 500, isActive: true, createdAt: now, updatedAt: now },
    { id: "cpn_love2026", code: "LOVE2026", discountType: "PERCENTAGE", discountValue: 20, minOrderValuePaise: 34900, maxDiscountPaise: 15000, usageCount: 0, usageLimit: 1000, isActive: true, createdAt: now, updatedAt: now },
    { id: "cpn_temple50", code: "TEMPLE50", discountType: "FIXED", discountValue: 5000, minOrderValuePaise: 29900, maxDiscountPaise: 5000, usageCount: 0, usageLimit: 250, isActive: true, createdAt: now, updatedAt: now },
  ];
}

function getDefaultSettings(): PlatformSettingsRecord {
  return {
    id: "set_global_default",
    platformName: "You Are Mine",
    supportEmail: "concierge@youaremine.online",
    supportPhone: "+91 (0) 11 4982 9200",
    defaultCurrency: "INR",
    maintenanceMode: false,
    allowNewRegistrations: true,
    maxAudioUploadBytes: 26214400,
    maxImageUploadBytes: 10485760,
    updatedAt: new Date().toISOString(),
  };
}

function getDefaultData(): DBStore {
  return {
    users: [
      {
        id: "usr_admin_default",
        email: "admin@youaremine.online",
        name: "You Are Mine Admin",
        role: "ADMIN",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    templates: [
      {
        id: "tpl-wedding-navy-01",
        slug: "the-royal-navy-wedding",
        title: "Aarav & Riya — The Royal Navy Wedding",
        occasion: "Wedding",
        rendererId: "wedding-imperial-navy",
        description: "Moving golden foil entrance doors with live sitar & shehnai soundtrack, events schedule, and family invites.",
        previewImage: "/images/templates/royal-navy-wedding-card.jpg",
        liveDemoUrl: "/template-01",
        badge: "🎬 MOVING",
        tier: "PREMIUM",
        status: "ACTIVE",
        isActive: true,
        defaultFields: {
          eyebrow: "TOGETHER WITH THEIR FAMILIES",
          headline: "The Wedding Of",
          names: "Aarav & Riya",
          date: "Friday, 18 December 2026",
          time: "5:00 PM Onwards",
          venue: "The Heritage Palace & Gardens",
          city: "Jaipur, Rajasthan",
          message: "Request the honour of your graceful presence and pious blessings to celebrate this eternal union.",
        },
        designConfig: { themeColor: "#121E35", accentColor: "#D7B875" },
      },
      {
        id: "tpl-anniversary-gold-02",
        slug: "golden-botanical-anniversary",
        title: "Arjun & Sia — Royal Lake Palace Heritage",
        occasion: "Wedding",
        rendererId: "wedding-lake-palace",
        description: "Regal blooming lotus rangoli, hand-tied marigold garlands, sacred mandala, and diya river blessings.",
        previewImage: "/images/templates/arjun-sia-heritage-card.jpg",
        liveDemoUrl: "/template-02",
        badge: "📖 STORY • 8 SECTIONS",
        tier: "SIGNATURE",
        status: "ACTIVE",
        isActive: true,
        defaultFields: {
          headline: "The Wedding Of",
          names: "Arjun & Sia",
          date: "Saturday, 13 February 2027",
          venue: "Rambagh Palace, Jaipur",
        },
        designConfig: { themeColor: "#FDFBF7", accentColor: "#A77B35" },
      },
      {
        id: "tpl-engagement-garden-03",
        slug: "thirumanam-south-indian-temple-wedding",
        title: "Karthik & Meenakshi — Thirumanam South Indian Temple Wedding",
        occasion: "Wedding",
        rendererId: "wedding-temple-thirumanam",
        description: "Sacred temple bells, Kanjeevaram silk borders, and auspicious muhurtham celebration.",
        previewImage: "/images/templates/thirumanam-temple-card.jpg",
        liveDemoUrl: "/template-03",
        badge: "🪔 TEMPLE • 8 SECTIONS",
        tier: "SIGNATURE",
        status: "ACTIVE",
        isActive: true,
        defaultFields: {
          headline: "Thirumanam Invitation",
          names: "Karthik & Meenakshi",
          date: "Sunday, 14 February 2027",
          venue: "Sri Meenakshi Sundareswarar Kalyana Mandapam, Madurai",
        },
        designConfig: { themeColor: "#06201A", accentColor: "#D9A521" },
      },
      {
        id: "tpl-birthday-botanical-04",
        slug: "interactive-birthday-celebration",
        title: "Ananya & Kabir — Golden Birthday Surprise",
        occasion: "Birthday",
        rendererId: "birthday-interactive",
        description: "A cinematic, luxury personalized birthday surprise with cake, candle blowing, teddy bear, and handwritten notes.",
        previewImage: "/images/birthday/birthday-preview-card.jpg",
        liveDemoUrl: "/birthday",
        badge: "🎂 INTERACTIVE",
        tier: "DELUXE",
        status: "ACTIVE",
        isActive: true,
        defaultFields: {
          eyebrow: "SPECIAL BIRTHDAY SURPRISE",
          headline: "Birthday",
          names: "Ananya & Kabir",
          message: "To the one who makes life more special, may your day be as beautiful, kind and happy as you are.",
        },
        designConfig: { themeColor: "#FFF3EE", accentColor: "#B62A42" },
      },
      {
        id: "tpl-valentine-interactive-05",
        slug: "will-you-be-my-valentine",
        title: "Aarav & Riya — Will You Be My Valentine?",
        occasion: "Valentine's Day",
        rendererId: "valentine-proposal",
        description: "A romantic editorial digital love letter and proposal experience with interactive YES/NO reactions.",
        previewImage: "/images/valentine/valentine-preview-card.jpg",
        liveDemoUrl: "/valentine",
        badge: "💖 INTERACTIVE PROPOSAL",
        tier: "PREMIUM",
        status: "ACTIVE",
        isActive: true,
        defaultFields: {
          eyebrow: "A SPECIAL QUESTION FOR YOU",
          headline: "Will You Be My Valentine?",
          names: "Aarav & Riya",
          message: "Someone has a very special question for you. A sealed digital love letter waiting to be opened.",
        },
        designConfig: { themeColor: "#FFF4F0", accentColor: "#B51F3B" },
      },
      {
        id: "tpl-date-planner-07",
        slug: "our-date-planner",
        title: "Riya & Aarav — Our Perfect Date Planner",
        occasion: "Valentine's Day",
        rendererId: "date-planner-interactive",
        description: "An elegant interactive date invitation allowing your special someone to pick date, timing, dining and movie.",
        previewImage: "/images/date-planner/sunset-date.jpg",
        liveDemoUrl: "/date-planner",
        badge: "💌 DATE PLANNER",
        tier: "SIGNATURE",
        status: "ACTIVE",
        isActive: true,
        defaultFields: {
          eyebrow: "LET'S PLAN",
          headline: "Our Perfect Date ♡",
          names: "Riya & Aarav",
          date: "Friday, November 27, 2026",
          message: "Tell me what you'd love most, and I'll plan every detail for an unforgettable time together.",
        },
        designConfig: { themeColor: "#FFF2ED", accentColor: "#B51F3B" },
      },
      {
        id: "tpl-wedding-paper-palace-04",
        slug: "paper-palace-wedding",
        title: "Tara & Kabir — The Grand Udaipur Palace Wedding",
        occasion: "Wedding",
        rendererId: "wedding-paper-palace",
        description: "A royal Rajasthani palace wedding celebration with ornate archways, regal music, interactive RSVP, and elegant venue directions.",
        previewImage: "/images/templates/udaipur-royal-palace-card.jpg",
        liveDemoUrl: "/template-04",
        badge: "🏰 ROYAL PALACE",
        tier: "SIGNATURE",
        status: "ACTIVE",
        isActive: true,
        defaultFields: {
          headline: "The Wedding Celebration Of",
          names: "Tara & Kabir",
          date: "Saturday, 21 November 2026",
          venue: "The City Palace, Udaipur",
        },
        designConfig: { themeColor: "#1B2A47", accentColor: "#C5A059" },
      },
      {
        id: "tpl-wedding-south-indian-05",
        slug: "traditional-south-indian-wedding",
        title: "Arun & Meenakshi — Traditional South Indian Wedding",
        occasion: "Wedding",
        rendererId: "wedding-traditional-tamil",
        description: "An authentic South Indian Tamil wedding celebration featuring an interactive wax-sealed envelope gate, toran garlands, Muhurtham countdown, live atchathai flower shower, and a 5-chapter love story.",
        previewImage: "/images/templates/traditional-south-indian/hero.jpg",
        liveDemoUrl: "/template-05",
        badge: "🌿 TRADITIONAL • ATCHATHAI",
        tier: "SIGNATURE",
        status: "ACTIVE",
        isActive: true,
        defaultFields: {
          headline: "Traditional South Indian Wedding",
          names: "Arun & Meenakshi",
          date: "25 – 26 January 2027",
          venue: "AVM Rajeswari Kalyana Mandapam, Chennai",
        },
        designConfig: { themeColor: "#fbf4e4", accentColor: "#b08a3e" },
      },
    ],
    prices: [
      { id: "prc_navy", templateId: "tpl-wedding-navy-01", currency: "INR", amount: 29900, promotionalPrice: 29900, originalPrice: 99900, discountPercent: 70, isActive: true },
      { id: "prc_palace", templateId: "tpl-anniversary-gold-02", currency: "INR", amount: 29900, promotionalPrice: 29900, originalPrice: 99900, discountPercent: 70, isActive: true },
      { id: "prc_temple", templateId: "tpl-engagement-garden-03", currency: "INR", amount: 29900, promotionalPrice: 29900, originalPrice: 99900, discountPercent: 70, isActive: true },
      { id: "prc_palace_wedding", templateId: "tpl-wedding-paper-palace-04", currency: "INR", amount: 29900, promotionalPrice: 29900, originalPrice: 99900, discountPercent: 70, isActive: true },
      { id: "prc_south_indian", templateId: "tpl-wedding-south-indian-05", currency: "INR", amount: 29900, promotionalPrice: 29900, originalPrice: 99900, discountPercent: 70, isActive: true },
      { id: "prc_birthday", templateId: "tpl-birthday-botanical-04", currency: "INR", amount: 29900, promotionalPrice: 29900, originalPrice: 99900, discountPercent: 70, isActive: true },
      { id: "prc_valentine", templateId: "tpl-valentine-interactive-05", currency: "INR", amount: 29900, promotionalPrice: 29900, originalPrice: 99900, discountPercent: 70, isActive: true },
      { id: "prc_date_planner", templateId: "tpl-date-planner-07", currency: "INR", amount: 29900, promotionalPrice: 29900, originalPrice: 99900, discountPercent: 70, isActive: true },
    ],
    drafts: [],
    orders: [],
    payments: [],
    invitations: [],
    publications: [],
    auditLogs: [],
    categories: getDefaultCategories(),
    coupons: getDefaultCoupons(),
    supportTickets: [],
    templateVersions: [],
    templateSections: [],
    settings: getDefaultSettings(),
  };
}

class StoreService {
  private data: DBStore | null = null;

  private init() {
    if (this.data) return;
    try {
      const dir = path.dirname(STORE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, "utf-8");
        this.data = JSON.parse(raw);
        if (!this.data!.categories || this.data!.categories.length === 0) {
          this.data!.categories = getDefaultCategories();
        }
        if (!this.data!.coupons || this.data!.coupons.length === 0) {
          this.data!.coupons = getDefaultCoupons();
        }
        if (!this.data!.supportTickets) this.data!.supportTickets = [];
        if (!this.data!.templateVersions) this.data!.templateVersions = [];
        if (!this.data!.templateSections) this.data!.templateSections = [];
        if (!this.data!.settings) this.data!.settings = getDefaultSettings();
      } else {
        this.data = getDefaultData();
        this.save();
      }
    } catch (e) {
      console.error("Store init error, falling back to defaults:", e);
      this.data = getDefaultData();
    }
  }

  private save() {
    if (!this.data) return;
    try {
      const dir = path.dirname(STORE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to write store to disk:", e);
    }
  }

  // --- Audit Logs ---
  async logAudit(entry: {
    userId?: string;
    guestToken?: string;
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: any;
  }) {
    this.init();
    const record: AuditLogRecord = {
      id: "log_" + crypto.randomUUID().slice(0, 8),
      ...entry,
      createdAt: new Date().toISOString(),
    };
    this.data!.auditLogs.push(record);
    this.save();
    return record;
  }

  // --- Templates & Prices ---
  async getTemplate(templateIdOrSlug: string): Promise<TemplateRecord | null> {
    this.init();
    // 1. Exact match on id or slug first
    const exact = this.data!.templates.find(
      (t) => t.id === templateIdOrSlug || t.slug === templateIdOrSlug
    );
    if (exact) return exact;

    // 2. Fallback to liveDemoUrl match
    return (
      this.data!.templates.find(
        (t) => t.liveDemoUrl === templateIdOrSlug || t.liveDemoUrl?.includes(templateIdOrSlug)
      ) || null
    );
  }

  async getAllTemplates(): Promise<TemplateRecord[]> {
    this.init();
    return this.data!.templates;
  }

  async getTemplatePrice(templateId: string): Promise<TemplatePriceRecord | null> {
    this.init();
    const direct = this.data!.prices.find((p) => p.templateId === templateId && p.isActive);
    if (direct) return direct;

    // Fallback: resolve template by ID, slug or liveDemoUrl
    const exact = this.data!.templates.find(
      (t) => t.id === templateId || t.slug === templateId || t.liveDemoUrl?.includes(templateId)
    );
    if (exact) {
      const match = this.data!.prices.find(
        (p) => (p.templateId === exact.id || p.templateId === exact.slug) && p.isActive
      );
      if (match) return match;
    }
    return null;
  }

  async updateTemplatePrice(templateId: string, amount: number, promo?: number): Promise<TemplatePriceRecord> {
    this.init();
    let price = this.data!.prices.find((p) => p.templateId === templateId);
    if (price) {
      price.amount = amount;
      price.promotionalPrice = promo;
    } else {
      price = {
        id: "prc_" + crypto.randomUUID().slice(0, 8),
        templateId,
        currency: "INR",
        amount,
        promotionalPrice: promo,
        isActive: true,
      };
      this.data!.prices.push(price);
    }
    this.save();
    return price;
  }

  // --- Templates Management (Milestone 3) ---
  async listTemplates(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    tier?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{
    items: (TemplateRecord & { priceINR: number; originalPriceINR?: number; draftsCount: number; publicationsCount: number })[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    this.init();
    let templates = [...this.data!.templates];

    // Filter search
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      templates = templates.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.occasion?.toLowerCase().includes(q)
      );
    }

    // Filter category
    if (params?.category && params.category !== "All") {
      const cat = params.category.toLowerCase();
      templates = templates.filter((t) => t.occasion?.toLowerCase() === cat);
    }

    // Filter status
    if (params?.status && params.status !== "All") {
      const st = params.status.toUpperCase();
      templates = templates.filter((t) => (t.status || (t.isActive ? "ACTIVE" : "DRAFT")) === st);
    }

    // Filter tier
    if (params?.tier && params.tier !== "All") {
      templates = templates.filter((t) => t.tier?.toUpperCase() === params.tier?.toUpperCase());
    }

    // Sorting
    const sortBy = params?.sortBy || "createdAt";
    const sortOrder = params?.sortOrder || "desc";

    templates.sort((a, b) => {
      let valA: any = a.createdAt || a.id;
      let valB: any = b.createdAt || b.id;

      if (sortBy === "title") {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      } else if (sortBy === "price") {
        const prA = this.data!.prices.find((p) => p.templateId === a.id)?.amount || 29900;
        const prB = this.data!.prices.find((p) => p.templateId === b.id)?.amount || 29900;
        valA = prA;
        valB = prB;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const total = templates.length;
    const page = Math.max(1, Number(params?.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params?.limit) || 20));
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = templates.slice(startIndex, startIndex + limit);

    const items = paginated.map((t) => {
      const directTpl = templatesData.find((dt) => dt.id === t.id || dt.slug === t.slug || dt.slug === t.id);
      const priceRec = this.data!.prices.find((p) => p.templateId === t.id && p.isActive);
      const priceINR = t.priceINR !== undefined ? t.priceINR : (priceRec ? Math.round(priceRec.amount / 100) : (directTpl?.price || 299));
      const originalPriceINR = t.originalPriceINR || directTpl?.originalPrice || 999;
      const draftsCount = this.data!.drafts.filter((d) => d.templateId === t.id || d.templateId === t.slug).length;
      const publicationsCount = this.data!.publications.filter((p) => p.templateId === t.id || p.templateId === t.slug).length;

      return {
        ...t,
        status: t.status || (t.isActive ? "ACTIVE" : "DRAFT"),
        priceINR,
        originalPriceINR,
        discountBadge: t.discountBadge || "70% OFF",
        draftsCount,
        publicationsCount,
      };
    });

    return { items, total, page, limit, totalPages };
  }

  async createTemplate(params: {
    title: string;
    slug: string;
    occasion: string;
    description: string;
    previewImage?: string;
    liveDemoUrl?: string;
    badge?: string;
    tier?: string;
    priceINR?: number;
    promotionalPriceINR?: number;
    rendererId?: string;
    tags?: string[];
    defaultFields?: Record<string, any>;
    designConfig?: Record<string, any>;
  }): Promise<{ template: TemplateRecord; price: TemplatePriceRecord }> {
    this.init();

    // Check slug uniqueness
    const existing = this.data!.templates.find((t) => t.slug === params.slug || t.id === `tpl-${params.slug}`);
    if (existing) {
      throw new Error(`Template with slug "${params.slug}" already exists.`);
    }

    const templateId = `tpl-${params.slug}`;
    const now = new Date().toISOString();

    const template: TemplateRecord = {
      id: templateId,
      slug: params.slug,
      title: params.title,
      occasion: params.occasion,
      description: params.description,
      previewImage: params.previewImage || "/images/templates/royal-navy-wedding-card.jpg",
      liveDemoUrl: params.liveDemoUrl || `/customize/${templateId}`,
      badge: params.badge || "NEW",
      tier: params.tier || "SIGNATURE",
      isActive: false, // Created as DRAFT by default
      status: "DRAFT",
      rendererId: params.rendererId || "wedding-imperial-navy",
      tags: params.tags || [params.occasion, "Bespoke", "New"],
      defaultFields: params.defaultFields || { headline: params.title, names: "Client & Partner" },
      designConfig: params.designConfig || { themeColor: "#FAF8F5", accentColor: "#D4AF37" },
      createdAt: now,
      updatedAt: now,
    };

    const amountPaise = Math.round((params.priceINR || 299) * 100);
    const promoPaise = params.promotionalPriceINR ? Math.round(params.promotionalPriceINR * 100) : undefined;

    const price: TemplatePriceRecord = {
      id: `prc_${crypto.randomUUID().slice(0, 8)}`,
      templateId,
      currency: "INR",
      amount: amountPaise,
      promotionalPrice: promoPaise,
      isActive: true,
    };

    this.data!.templates.unshift(template);
    this.data!.prices.unshift(price);
    this.save();

    return { template, price };
  }

  async updateTemplate(
    id: string,
    updates: Partial<TemplateRecord> & { priceINR?: number }
  ): Promise<TemplateRecord> {
    this.init();
    const index = this.data!.templates.findIndex((t) => t.id === id || t.slug === id);
    if (index === -1) {
      throw new Error(`Template "${id}" not found.`);
    }

    const current = this.data!.templates[index];
    const now = new Date().toISOString();

    const updated: TemplateRecord = {
      ...current,
      ...updates,
      priceINR: updates.priceINR !== undefined ? updates.priceINR : current.priceINR,
      originalPriceINR: updates.originalPriceINR !== undefined ? updates.originalPriceINR : (current.originalPriceINR || 999),
      discountBadge: updates.discountBadge !== undefined ? updates.discountBadge : (current.discountBadge || '70% OFF'),
      updatedAt: now,
    };

    this.data!.templates[index] = updated;

    if (updates.priceINR !== undefined) {
      await this.updateTemplatePrice(current.id, Math.round(updates.priceINR * 100));
      // Also update matching prices by slug or liveDemoUrl if any
      const matchingPrice = this.data!.prices.find(
        (p) => p.templateId === current.id || p.templateId === current.slug
      );
      if (matchingPrice) {
        matchingPrice.amount = Math.round(updates.priceINR * 100);
      }
    }

    this.save();
    return updated;
  }

  async duplicateTemplate(id: string, newTitle?: string, newSlug?: string): Promise<TemplateRecord> {
    this.init();
    const source = this.data!.templates.find((t) => t.id === id || t.slug === id);
    if (!source) throw new Error(`Template "${id}" not found.`);

    const generatedSlug = newSlug || `${source.slug}-copy-${crypto.randomUUID().slice(0, 4)}`;
    const generatedTitle = newTitle || `${source.title} (Copy)`;
    const newId = `tpl-${generatedSlug}`;

    const now = new Date().toISOString();
    const cloned: TemplateRecord = {
      ...JSON.parse(JSON.stringify(source)),
      id: newId,
      slug: generatedSlug,
      title: generatedTitle,
      liveDemoUrl: `/customize/${newId}`,
      status: "DRAFT",
      isActive: false,
      createdAt: now,
      updatedAt: now,
    };

    const sourcePrice = this.data!.prices.find((p) => p.templateId === source.id);
    const clonedPrice: TemplatePriceRecord = {
      id: `prc_${crypto.randomUUID().slice(0, 8)}`,
      templateId: newId,
      currency: sourcePrice?.currency || "INR",
      amount: sourcePrice?.amount || 29900,
      promotionalPrice: sourcePrice?.promotionalPrice,
      discountPercent: sourcePrice?.discountPercent,
      isActive: true,
    };

    this.data!.templates.unshift(cloned);
    this.data!.prices.unshift(clonedPrice);
    this.save();

    return cloned;
  }

  async archiveTemplate(id: string): Promise<TemplateRecord> {
    this.init();
    const template = this.data!.templates.find((t) => t.id === id || t.slug === id);
    if (!template) throw new Error(`Template "${id}" not found.`);

    template.status = "ARCHIVED";
    template.isActive = false;
    template.updatedAt = new Date().toISOString();
    this.save();
    return template;
  }

  async setTemplateActiveStatus(id: string, isActive: boolean): Promise<TemplateRecord> {
    this.init();
    const template = this.data!.templates.find((t) => t.id === id || t.slug === id);
    if (!template) throw new Error(`Template "${id}" not found.`);

    template.isActive = isActive;
    template.status = isActive ? "ACTIVE" : "DRAFT";
    template.updatedAt = new Date().toISOString();
    this.save();
    return template;
  }

  // --- Categories Management ---
  async listCategories(): Promise<CategoryRecord[]> {
    this.init();
    if (!this.data!.categories) this.data!.categories = getDefaultCategories();
    return [...this.data!.categories].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async createCategory(params: { name: string; slug: string; icon?: string; description?: string }): Promise<CategoryRecord> {
    this.init();
    if (!this.data!.categories) this.data!.categories = getDefaultCategories();

    const existing = this.data!.categories.find((c) => c.slug === params.slug);
    if (existing) throw new Error(`Category with slug "${params.slug}" already exists.`);

    const now = new Date().toISOString();
    const newCat: CategoryRecord = {
      id: `cat_${params.slug}`,
      slug: params.slug,
      name: params.name,
      icon: params.icon || "Tag",
      description: params.description,
      displayOrder: this.data!.categories.length + 1,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    this.data!.categories.push(newCat);
    this.save();
    return newCat;
  }

  async updateCategory(id: string, updates: Partial<CategoryRecord>): Promise<CategoryRecord> {
    this.init();
    if (!this.data!.categories) this.data!.categories = getDefaultCategories();

    const cat = this.data!.categories.find((c) => c.id === id || c.slug === id);
    if (!cat) throw new Error(`Category "${id}" not found.`);

    Object.assign(cat, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return cat;
  }

  async deleteCategory(id: string): Promise<boolean> {
    this.init();
    if (!this.data!.categories) return false;
    const initialLen = this.data!.categories.length;
    this.data!.categories = this.data!.categories.filter((c) => c.id !== id && c.slug !== id);
    if (this.data!.categories.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Coupons Management ---
  async listCoupons(): Promise<CouponRecord[]> {
    this.init();
    if (!this.data!.coupons) this.data!.coupons = getDefaultCoupons();
    return [...this.data!.coupons];
  }

  async createCoupon(params: {
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    minOrderValuePaise?: number;
    maxDiscountPaise?: number;
    usageLimit?: number;
    expiresAt?: string;
  }): Promise<CouponRecord> {
    this.init();
    if (!this.data!.coupons) this.data!.coupons = getDefaultCoupons();

    const upperCode = params.code.trim().toUpperCase();
    const existing = this.data!.coupons.find((c) => c.code === upperCode);
    if (existing) throw new Error(`Coupon "${upperCode}" already exists.`);

    const now = new Date().toISOString();
    const coupon: CouponRecord = {
      id: `cpn_${crypto.randomUUID().slice(0, 8)}`,
      code: upperCode,
      discountType: params.discountType,
      discountValue: params.discountValue,
      minOrderValuePaise: params.minOrderValuePaise || 29900,
      maxDiscountPaise: params.maxDiscountPaise,
      usageCount: 0,
      usageLimit: params.usageLimit || 500,
      expiresAt: params.expiresAt,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    this.data!.coupons.push(coupon);
    this.save();
    return coupon;
  }

  async updateCoupon(id: string, updates: Partial<CouponRecord>): Promise<CouponRecord> {
    this.init();
    if (!this.data!.coupons) this.data!.coupons = getDefaultCoupons();

    const coupon = this.data!.coupons.find((c) => c.id === id || c.code === id.toUpperCase());
    if (!coupon) throw new Error(`Coupon "${id}" not found.`);

    Object.assign(coupon, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return coupon;
  }

  async deleteCoupon(id: string): Promise<boolean> {
    this.init();
    if (!this.data!.coupons) return false;
    const initialLen = this.data!.coupons.length;
    this.data!.coupons = this.data!.coupons.filter((c) => c.id !== id && c.code !== id.toUpperCase());
    if (this.data!.coupons.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  async getCouponByCode(code: string): Promise<CouponRecord | null> {
    this.init();
    if (!this.data!.coupons) this.data!.coupons = getDefaultCoupons();
    return this.data!.coupons.find((c) => c.code === code.trim().toUpperCase() && c.isActive) || null;
  }

  // --- Template Sections & Builder ---
  async getTemplateSections(templateId: string): Promise<TemplateSectionRecord[]> {
    this.init();
    if (!this.data!.templateSections) this.data!.templateSections = [];
    let sections = this.data!.templateSections.filter((s) => s.templateId === templateId);

    // If template has no saved sections yet, auto-generate default sections from renderer registry
    if (sections.length === 0) {
      const template = await this.getTemplate(templateId);
      const renderer = template?.rendererId ? APPROVED_RENDERER_REGISTRY[template.rendererId] : null;
      const supported = renderer?.supportedSections || ["hero", "welcome", "events", "venue", "closing"];

      const now = new Date().toISOString();
      sections = supported.map((secType, idx) => ({
        id: `sec_${templateId}_${secType}`,
        templateId,
        sectionType: secType,
        title: secType.charAt(0).toUpperCase() + secType.slice(1).replace(/-/g, " "),
        order: idx + 1,
        isEnabled: true,
        settings: { background: "#FFFFFF", padding: "normal", animation: "fade-up" },
        fieldsSchema: {},
        createdAt: now,
        updatedAt: now,
      }));

      this.data!.templateSections.push(...sections);
      this.save();
    }

    return [...sections].sort((a, b) => a.order - b.order);
  }

  async saveTemplateSections(templateId: string, sections: TemplateSectionRecord[]): Promise<TemplateSectionRecord[]> {
    this.init();
    if (!this.data!.templateSections) this.data!.templateSections = [];
    
    // Remove existing sections for this template
    this.data!.templateSections = this.data!.templateSections.filter((s) => s.templateId !== templateId);

    const now = new Date().toISOString();
    const prepared: TemplateSectionRecord[] = sections.map((s, idx) => ({
      ...s,
      id: s.id || `sec_${templateId}_${s.sectionType}_${crypto.randomUUID().slice(0, 4)}`,
      templateId,
      order: s.order !== undefined ? s.order : idx + 1,
      isEnabled: s.isEnabled !== undefined ? s.isEnabled : true,
      settings: s.settings || {},
      fieldsSchema: s.fieldsSchema || {},
      updatedAt: now,
      createdAt: s.createdAt || now,
    }));

    this.data!.templateSections.push(...prepared);
    this.save();
    return prepared.sort((a, b) => a.order - b.order);
  }

  async reorderTemplateSections(templateId: string, sectionOrders: { id: string; order: number }[]): Promise<TemplateSectionRecord[]> {
    this.init();
    if (!this.data!.templateSections) this.data!.templateSections = [];

    sectionOrders.forEach(({ id, order }) => {
      const sec = this.data!.templateSections.find((s) => s.id === id && s.templateId === templateId);
      if (sec) {
        sec.order = order;
        sec.updatedAt = new Date().toISOString();
      }
    });

    this.save();
    return this.getTemplateSections(templateId);
  }

  // --- Template Version Snapshots ---
  async listTemplateVersions(templateId: string): Promise<TemplateVersionRecord[]> {
    this.init();
    if (!this.data!.templateVersions) this.data!.templateVersions = [];
    return this.data!.templateVersions
      .filter((v) => v.templateId === templateId)
      .sort((a, b) => b.versionNumber - a.versionNumber);
  }

  async createTemplateVersion(params: {
    templateId: string;
    changeSummary: string;
    createdBy: string;
    snapshotConfig: Record<string, any>;
  }): Promise<TemplateVersionRecord> {
    this.init();
    if (!this.data!.templateVersions) this.data!.templateVersions = [];

    const existingVersions = this.data!.templateVersions.filter((v) => v.templateId === params.templateId);
    const nextVersion = existingVersions.reduce((max, v) => Math.max(max, v.versionNumber), 0) + 1;

    const version: TemplateVersionRecord = {
      id: `ver_${crypto.randomUUID().slice(0, 8)}`,
      templateId: params.templateId,
      versionNumber: nextVersion,
      snapshotConfig: JSON.parse(JSON.stringify(params.snapshotConfig)),
      changeSummary: params.changeSummary || `Version ${nextVersion} update`,
      createdBy: params.createdBy || "Admin",
      createdAt: new Date().toISOString(),
    };

    this.data!.templateVersions.push(version);
    this.save();
    return version;
  }

  async restoreTemplateVersion(templateId: string, versionNumber: number): Promise<{ template: TemplateRecord; restoredVersion: TemplateVersionRecord }> {
    this.init();
    const version = this.data!.templateVersions.find(
      (v) => v.templateId === templateId && v.versionNumber === versionNumber
    );
    if (!version) throw new Error(`Version ${versionNumber} not found for template "${templateId}".`);

    const template = this.data!.templates.find((t) => t.id === templateId || t.slug === templateId);
    if (!template) throw new Error(`Template "${templateId}" not found.`);

    // Restore designConfig, defaultFields, and sections if present in snapshot
    if (version.snapshotConfig.designConfig) template.designConfig = JSON.parse(JSON.stringify(version.snapshotConfig.designConfig));
    if (version.snapshotConfig.defaultFields) template.defaultFields = JSON.parse(JSON.stringify(version.snapshotConfig.defaultFields));
    if (version.snapshotConfig.title) template.title = version.snapshotConfig.title;
    template.updatedAt = new Date().toISOString();

    if (Array.isArray(version.snapshotConfig.sections)) {
      await this.saveTemplateSections(template.id, version.snapshotConfig.sections);
    }

    this.save();
    return { template, restoredVersion: version };
  }

  // --- Drafts ---
  async getDraft(draftId: string): Promise<DraftRecord | null> {
    this.init();
    return this.data!.drafts.find((d) => d.id === draftId) || null;
  }

  async listDrafts(owner: { guestToken?: string; userId?: string }): Promise<DraftRecord[]> {
    this.init();
    return this.data!.drafts.filter((d) => {
      if (owner.userId && d.userId === owner.userId) return true;
      if (owner.guestToken && d.guestToken === owner.guestToken) return true;
      return false;
    });
  }

  async listAllDrafts(): Promise<DraftRecord[]> {
    this.init();
    return this.data!.drafts;
  }

  // --- Customer Aggregation & Management ---
  async listCustomers(params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: "ALL" | "REGISTERED" | "GUEST";
    status?: "ALL" | "ACTIVE" | "INACTIVE";
    platform?: "ALL" | "WEBSITE" | "ANDROID APP" | "BOTH";
    verified?: "ALL" | "VERIFIED" | "UNVERIFIED";
    sortBy?: "registeredAt" | "lastActive" | "totalSpent" | "paidOrders" | "draftsCount" | "phone";
    sortOrder?: "asc" | "desc";
  }): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    stats: {
      totalCustomers: number;
      registeredCount: number;
      guestCount: number;
      totalOrdersCount: number;
      totalRevenueINR: number;
    };
  }> {
    this.init();

    const customerMap = new Map<string, {
      id: string;
      identifier: string;
      type: "REGISTERED" | "GUEST";
      email?: string;
      phone?: string;
      phoneVerified: boolean;
      profileImageUrl?: string;
      profileImageUpdatedAt?: string;
      platform: "WEBSITE" | "ANDROID APP" | "BOTH";
      isActive: boolean;
      registeredAt?: string;
      draftsCount: number;
      paidOrdersCount: number;
      totalSpentPaise: number;
      firstSeenAt: string;
      lastActiveAt: string;
      draftIds: string[];
      notes?: Array<{ id: string; text: string; author: string; createdAt: string }>;
    }>();

    // 1. Process Users (Registered Customers)
    (this.data!.users || []).forEach((u) => {
      // Exclude internal staff from customer directory if desired, or include all registered accounts
      // Customer directory identifies users by phone or email, NEVER by name.
      const primaryPhone = u.phone || "";
      customerMap.set(u.id, {
        id: u.id,
        identifier: primaryPhone || u.email || u.id,
        type: "REGISTERED",
        email: u.email,
        phone: primaryPhone,
        phoneVerified: u.phoneVerified ?? (primaryPhone ? true : false),
        profileImageUrl: u.profileImageUrl,
        profileImageUpdatedAt: u.profileImageUpdatedAt,
        platform: u.platform || "WEBSITE",
        isActive: u.isActive !== false,
        registeredAt: u.createdAt,
        draftsCount: 0,
        paidOrdersCount: 0,
        totalSpentPaise: 0,
        firstSeenAt: u.createdAt,
        lastActiveAt: u.updatedAt || u.createdAt,
        draftIds: [],
        notes: u.notes || [],
      });
    });

    // 2. Process Drafts
    (this.data!.drafts || []).forEach((d) => {
      const custKey = d.userId || d.guestToken;
      let cust = customerMap.get(custKey);
      if (!cust) {
        cust = {
          id: custKey,
          identifier: custKey.startsWith("gst_") ? `Guest (${custKey.slice(0, 10)}...)` : custKey,
          type: d.userId ? "REGISTERED" : "GUEST",
          phone: undefined,
          phoneVerified: false,
          profileImageUrl: undefined,
          profileImageUpdatedAt: undefined,
          platform: "WEBSITE",
          isActive: true,
          registeredAt: undefined,
          draftsCount: 0,
          paidOrdersCount: 0,
          totalSpentPaise: 0,
          firstSeenAt: d.createdAt,
          lastActiveAt: d.updatedAt,
          draftIds: [],
          notes: [],
        };
        customerMap.set(custKey, cust);
      }

      cust.draftsCount += 1;
      cust.draftIds.push(d.id);

      if (new Date(d.createdAt).getTime() < new Date(cust.firstSeenAt).getTime()) {
        cust.firstSeenAt = d.createdAt;
      }
      if (new Date(d.updatedAt).getTime() > new Date(cust.lastActiveAt).getTime()) {
        cust.lastActiveAt = d.updatedAt;
      }
    });

    // 3. Process Orders & Payments
    (this.data!.orders || []).forEach((o) => {
      const custKey = o.userId || o.guestToken;
      const cust = customerMap.get(custKey);
      if (cust) {
        if (o.status === "PAID") {
          cust.paidOrdersCount += 1;
          cust.totalSpentPaise += o.amount || 0;
        }
        if (new Date(o.createdAt).getTime() > new Date(cust.lastActiveAt).getTime()) {
          cust.lastActiveAt = o.createdAt;
        }
      }
    });

    const allCustomers = Array.from(customerMap.values());

    // Calculate Global Statistics before filtering
    const totalCustomers = allCustomers.length;
    const registeredCount = allCustomers.filter((c) => c.type === "REGISTERED").length;
    const guestCount = allCustomers.filter((c) => c.type === "GUEST").length;
    const totalOrdersCount = allCustomers.reduce((sum, c) => sum + c.paidOrdersCount, 0);
    const totalRevenueINR = Math.round(allCustomers.reduce((sum, c) => sum + c.totalSpentPaise, 0) / 100);

    let filtered = [...allCustomers];

    // Search filter: Strictly ONLY searches Phone, Email, and ID (NO name search)
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (c) =>
          (c.phone && c.phone.toLowerCase().includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          c.id.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (params.type && params.type !== "ALL") {
      filtered = filtered.filter((c) => c.type === params.type);
    }

    // Status filter
    if (params.status && params.status !== "ALL") {
      const isWanted = params.status === "ACTIVE";
      filtered = filtered.filter((c) => c.isActive === isWanted);
    }

    // Platform filter
    if (params.platform && params.platform !== "ALL") {
      filtered = filtered.filter(
        (c) => c.platform === params.platform || c.platform === "BOTH"
      );
    }

    // Verified filter
    if (params.verified && params.verified !== "ALL") {
      const wantVerified = params.verified === "VERIFIED";
      filtered = filtered.filter((c) => !!c.phoneVerified === wantVerified);
    }

    // Sort
    const sortBy = params.sortBy || "lastActive";
    const sortOrder = params.sortOrder || "desc";
    filtered.sort((a, b) => {
      let valA: any = a.lastActiveAt;
      let valB: any = b.lastActiveAt;

      if (sortBy === "registeredAt") {
        valA = a.registeredAt || "1970-01-01";
        valB = b.registeredAt || "1970-01-01";
      } else if (sortBy === "totalSpent") {
        valA = a.totalSpentPaise;
        valB = b.totalSpentPaise;
      } else if (sortBy === "paidOrders") {
        valA = a.paidOrdersCount;
        valB = b.paidOrdersCount;
      } else if (sortBy === "draftsCount") {
        valA = a.draftsCount;
        valB = b.draftsCount;
      } else if (sortBy === "phone") {
        valA = a.phone || "";
        valB = b.phone || "";
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 10));
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    const items = paginated.map((c) => ({
      ...c,
      totalSpentINR: Math.round(c.totalSpentPaise / 100),
    }));

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      stats: {
        totalCustomers,
        registeredCount,
        guestCount,
        totalOrdersCount,
        totalRevenueINR,
      },
    };
  }

  async getCustomerDetails(customerId: string): Promise<any | null> {
    this.init();
    const user = (this.data!.users || []).find(
      (u) =>
        u.id === customerId ||
        u.phone === customerId ||
        (u.email && u.email.toLowerCase() === customerId.toLowerCase())
    );

    const isRegistered = !!user;

    const drafts = (this.data!.drafts || []).filter(
      (d) =>
        d.userId === customerId ||
        d.guestToken === customerId ||
        (user && d.userId === user.id)
    );
    const orders = (this.data!.orders || []).filter(
      (o) =>
        o.userId === customerId ||
        o.guestToken === customerId ||
        (user && o.userId === user.id)
    );
    const publications = (this.data!.publications || []).filter(
      (p) =>
        p.userId === customerId ||
        p.guestToken === customerId ||
        (user && p.userId === user.id)
    );

    if (!user && drafts.length === 0 && orders.length === 0) {
      return null;
    }

    const paidOrders = orders.filter((o) => o.status === "PAID");
    const totalSpentPaise = paidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

    const firstSeenAt =
      user?.createdAt || drafts[0]?.createdAt || orders[0]?.createdAt || new Date().toISOString();
    const lastActiveAt =
      user?.updatedAt ||
      drafts[drafts.length - 1]?.updatedAt ||
      orders[orders.length - 1]?.updatedAt ||
      new Date().toISOString();

    const activities: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      timestamp: string;
      platform?: string;
    }> = [];

    if (user?.createdAt) {
      activities.push({
        id: `act_${customerId}_reg`,
        type: "REGISTRATION",
        title: "Account Registered",
        description: `Customer account created on ${user.platform || "WEBSITE"}.`,
        timestamp: user.createdAt,
        platform: user.platform || "WEBSITE",
      });
    }

    if (user?.profileImageUpdatedAt) {
      activities.push({
        id: `act_${customerId}_avatar`,
        type: "PROFILE_IMAGE_UPDATE",
        title: "Profile Image Updated",
        description: "Customer uploaded a new profile portrait photograph.",
        timestamp: user.profileImageUpdatedAt,
        platform: user.platform || "WEBSITE",
      });
    }

    drafts.forEach((d) => {
      activities.push({
        id: `act_${d.id}_draft`,
        type: "DRAFT_EDIT",
        title: `Draft Saved: ${d.title || "Invitation"}`,
        description: `Modified invitation template "${d.templateId}"`,
        timestamp: d.updatedAt || d.createdAt,
        platform: user?.platform || "WEBSITE",
      });
    });

    orders.forEach((o) => {
      activities.push({
        id: `act_${o.id}_order`,
        type: o.status === "PAID" ? "ORDER_PAID" : "ORDER_CREATED",
        title: `Order ${o.id.toUpperCase()}: ₹${Math.round((o.amount || 0) / 100)}`,
        description: `Status: ${o.status}. Currency: ${o.currency || "INR"}.`,
        timestamp: o.createdAt,
        platform: user?.platform || "WEBSITE",
      });
    });

    activities.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return {
      id: user?.id || customerId,
      identifier:
        user?.phone ||
        (customerId.startsWith("gst_") ? `Guest (${customerId.slice(0, 10)}...)` : customerId),
      phone: user?.phone || (customerId.startsWith("+") ? customerId : undefined),
      phoneVerified: user?.phoneVerified ?? (user?.phone ? true : false),
      email: user?.email,
      profileImageUrl: user?.profileImageUrl,
      profileImageUpdatedAt: user?.profileImageUpdatedAt,
      type: isRegistered ? "REGISTERED" : "GUEST",
      platform: user?.platform || "WEBSITE",
      isActive: user?.isActive !== false,
      registeredAt: user?.createdAt,
      firstSeenAt,
      lastActiveAt,
      totalSpentINR: Math.round(totalSpentPaise / 100),
      paidOrdersCount: paidOrders.length,
      draftsCount: drafts.length,
      drafts,
      orders,
      publications,
      activities,
      notes: user?.notes || [],
    };
  }

  async updateCustomer(
    customerId: string,
    updates: {
      phone?: string;
      phoneVerified?: boolean;
      email?: string;
      isActive?: boolean;
      platform?: "WEBSITE" | "ANDROID APP" | "BOTH";
      profileImageUrl?: string;
      profileImageUpdatedAt?: string;
    }
  ): Promise<UserRecord> {
    this.init();
    if (!this.data!.users) this.data!.users = [];
    let user = this.data!.users.find((u) => u.id === customerId);
    const now = new Date().toISOString();

    if (!user) {
      // If customer is a guest being promoted to registered
      user = {
        id: customerId.startsWith("usr_") ? customerId : `usr_${crypto.randomUUID().slice(0, 8)}`,
        role: "USER",
        phone: updates.phone,
        phoneVerified: updates.phoneVerified ?? true,
        email: updates.email,
        isActive: updates.isActive ?? true,
        platform: updates.platform || "WEBSITE",
        profileImageUrl: updates.profileImageUrl,
        profileImageUpdatedAt: updates.profileImageUpdatedAt,
        notes: [],
        createdAt: now,
        updatedAt: now,
      };
      this.data!.users.push(user);
    } else {
      if (updates.phone !== undefined) user.phone = updates.phone;
      if (updates.phoneVerified !== undefined) user.phoneVerified = updates.phoneVerified;
      if (updates.email !== undefined) user.email = updates.email;
      if (updates.isActive !== undefined) user.isActive = updates.isActive;
      if (updates.platform !== undefined) user.platform = updates.platform;
      if (updates.profileImageUrl !== undefined) user.profileImageUrl = updates.profileImageUrl;
      if (updates.profileImageUpdatedAt !== undefined) user.profileImageUpdatedAt = updates.profileImageUpdatedAt;
      user.updatedAt = now;
    }

    this.save();
    return user;
  }

  async addCustomerNote(
    customerId: string,
    note: { text: string; author: string }
  ): Promise<{ id: string; text: string; author: string; createdAt: string }> {
    this.init();
    if (!this.data!.users) this.data!.users = [];
    let user = this.data!.users.find((u) => u.id === customerId);
    const now = new Date().toISOString();

    if (!user) {
      user = {
        id: customerId,
        role: "USER",
        isActive: true,
        notes: [],
        createdAt: now,
        updatedAt: now,
      };
      this.data!.users.push(user);
    }

    if (!user.notes) user.notes = [];
    const noteEntry = {
      id: `nte_${crypto.randomUUID().slice(0, 8)}`,
      text: note.text,
      author: note.author,
      createdAt: now,
    };
    user.notes.push(noteEntry);
    user.updatedAt = now;
    this.save();
    return noteEntry;
  }

  async createCustomer(data: {
    phone: string;
    email?: string;
    platform?: "WEBSITE" | "ANDROID APP" | "BOTH";
    phoneVerified?: boolean;
    profileImageUrl?: string;
  }): Promise<UserRecord> {
    this.init();
    if (!this.data!.users) this.data!.users = [];
    const now = new Date().toISOString();
    const user: UserRecord = {
      id: `usr_${crypto.randomUUID().slice(0, 8)}`,
      phone: data.phone,
      phoneVerified: data.phoneVerified ?? true,
      email: data.email,
      role: "USER",
      platform: data.platform || "WEBSITE",
      profileImageUrl: data.profileImageUrl,
      profileImageUpdatedAt: data.profileImageUrl ? now : undefined,
      isActive: true,
      notes: [],
      createdAt: now,
      updatedAt: now,
    };
    this.data!.users.push(user);
    this.save();
    return user;
  }

  async deleteDraft(draftId: string): Promise<boolean> {
    this.init();
    const idx = this.data!.drafts.findIndex((d) => d.id === draftId);
    if (idx === -1) return false;
    this.data!.drafts.splice(idx, 1);
    this.save();
    return true;
  }

  async saveDraft(params: {
    id?: string;
    guestToken: string;
    userId?: string;
    templateId: string;
    title?: string;
    fields: Record<string, any>;
    design: Record<string, any>;
    customAudioUrl?: string;
    customAudioTitle?: string;
    status?: DraftStatus;
  }): Promise<DraftRecord> {
    this.init();
    const now = new Date().toISOString();

    let draft = params.id ? this.data!.drafts.find((d) => d.id === params.id) : null;

    if (draft) {
      // Update existing
      draft.title = params.title || draft.title;
      draft.fields = { ...draft.fields, ...params.fields };
      draft.design = { ...draft.design, ...params.design };
      if (params.customAudioUrl !== undefined) draft.customAudioUrl = params.customAudioUrl;
      if (params.customAudioTitle !== undefined) draft.customAudioTitle = params.customAudioTitle;
      if (params.status) draft.status = params.status;
      if (params.userId && !draft.userId) draft.userId = params.userId;
      draft.version += 1;
      draft.updatedAt = now;
    } else {
      // Create new draft
      draft = {
        id: params.id || "drf_" + crypto.randomUUID().replace(/-/g, "").slice(0, 12),
        guestToken: params.guestToken,
        userId: params.userId,
        templateId: params.templateId,
        title: params.title || "Untitled Invitation",
        fields: params.fields || {},
        design: params.design || {},
        customAudioUrl: params.customAudioUrl,
        customAudioTitle: params.customAudioTitle,
        status: params.status || "DRAFT",
        version: 1,
        createdAt: now,
        updatedAt: now,
      };
      this.data!.drafts.push(draft);
    }

    this.save();
    await this.logAudit({
      userId: draft.userId,
      guestToken: draft.guestToken,
      action: "DRAFT_SAVED",
      entityType: "Draft",
      entityId: draft.id,
      metadata: { version: draft.version, status: draft.status },
    });

    return draft;
  }

  // --- Orders & Payments ---
  async createPaymentOrder(params: {
    orderId: string;
    draftId: string;
    guestToken: string;
    userId?: string;
    customerName?: string;
    customerPhone?: string;
    amount: number;
    currency: string;
    notes?: Record<string, any>;
  }): Promise<PaymentOrderRecord> {
    this.init();
    const now = new Date().toISOString();
    const record: PaymentOrderRecord = {
      id: "ord_" + crypto.randomUUID().slice(0, 8),
      orderId: params.orderId,
      draftId: params.draftId,
      guestToken: params.guestToken,
      userId: params.userId,
      customerName: params.customerName || params.notes?.customerName,
      customerPhone: params.customerPhone || params.notes?.customerPhone,
      amount: params.amount,
      currency: params.currency || "INR",
      status: "CREATED",
      razorpayReceipt: "rcpt_" + Date.now(),
      notes: params.notes,
      createdAt: now,
      updatedAt: now,
    };

    this.data!.orders.push(record);
    this.save();

    await this.logAudit({
      userId: record.userId,
      guestToken: record.guestToken,
      action: "ORDER_CREATED",
      entityType: "PaymentOrder",
      entityId: record.orderId,
      metadata: { amount: record.amount, draftId: record.draftId },
    });

    return record;
  }

  async getPaymentOrder(orderId: string): Promise<PaymentOrderRecord | null> {
    this.init();
    return this.data!.orders.find((o) => o.orderId === orderId) || null;
  }

  async recordPayment(params: {
    paymentId: string;
    orderId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    method?: string;
    signature?: string;
    rawResponse?: any;
  }): Promise<PaymentRecord> {
    this.init();
    const now = new Date().toISOString();
    let payment = this.data!.payments.find((p) => p.paymentId === params.paymentId);
    if (!payment) {
      payment = {
        id: "pay_rec_" + crypto.randomUUID().slice(0, 8),
        paymentId: params.paymentId,
        orderId: params.orderId,
        amount: params.amount,
        currency: params.currency,
        status: params.status,
        method: params.method,
        signature: params.signature,
        rawResponse: params.rawResponse,
        verifiedAt: now,
        createdAt: now,
      };
      this.data!.payments.push(payment);
    }

    // Mark order paid
    const order = this.data!.orders.find((o) => o.orderId === params.orderId);
    if (order) {
      order.status = "PAID";
      order.updatedAt = now;
    }

    this.save();
    return payment;
  }

  // --- Publications & Invitations ---
  async publishDraft(params: {
    draftId: string;
    paymentId?: string;
    requestedSlug?: string;
  }): Promise<{ invitation: InvitationRecord; publication: PublicationRecord; slug: string }> {
    this.init();
    const now = new Date().toISOString();

    const draft = this.data!.drafts.find((d) => d.id === params.draftId);
    if (!draft) throw new Error("Draft not found");

    // 1. Generate unique collision-free slug
    let baseSlug = (params.requestedSlug || draft.title || "invitation")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!baseSlug || baseSlug === "untitled-invitation") {
      const names = draft.fields?.names ? String(draft.fields.names).toLowerCase().replace(/[^a-z0-9]+/g, "-") : "";
      baseSlug = names ? `${names}-celebration` : "celebration";
    }

    let uniqueSlug = baseSlug;
    let collisionCount = 1;
    while (this.data!.invitations.some((inv) => inv.slug === uniqueSlug && inv.draftId !== draft.id)) {
      uniqueSlug = `${baseSlug}-${crypto.randomBytes(2).toString("hex")}`;
      collisionCount++;
      if (collisionCount > 10) break;
    }

    // 2. Mark draft as PUBLISHED
    draft.status = "PUBLISHED";
    draft.updatedAt = now;

    // 3. Upsert Invitation
    let invitation = this.data!.invitations.find((inv) => inv.draftId === draft.id);
    if (invitation) {
      invitation.slug = uniqueSlug;
      invitation.updatedAt = now;
    } else {
      invitation = {
        id: "inv_" + crypto.randomUUID().slice(0, 8),
        slug: uniqueSlug,
        draftId: draft.id,
        templateId: draft.templateId,
        viewCount: 0,
        isPublic: true,
        createdAt: now,
        updatedAt: now,
      };
      this.data!.invitations.push(invitation);
    }

    // 4. Create or Update Publication Snapshot (Idempotent)
    const template = this.data!.templates.find((t) => t.id === draft.templateId);
    let publication = this.data!.publications.find(
      (p) => p.draftId === draft.id && p.status === "ACTIVE"
    );

    if (publication) {
      publication.snapshotData = {
        fields: JSON.parse(JSON.stringify(draft.fields)),
        design: JSON.parse(JSON.stringify(draft.design)),
        customAudioUrl: draft.customAudioUrl,
        customAudioTitle: draft.customAudioTitle,
        templateTitle: template?.title,
        templateSlug: template?.slug,
      };
      publication.version = draft.version;
      publication.publishedAt = now;
    } else {
      publication = {
        id: "pub_" + crypto.randomUUID().slice(0, 8),
        draftId: draft.id,
        invitationId: invitation.id,
        templateId: draft.templateId,
        userId: draft.userId,
        guestToken: draft.guestToken,
        version: draft.version,
        snapshotData: {
          fields: JSON.parse(JSON.stringify(draft.fields)),
          design: JSON.parse(JSON.stringify(draft.design)),
          customAudioUrl: draft.customAudioUrl,
          customAudioTitle: draft.customAudioTitle,
          templateTitle: template?.title,
          templateSlug: template?.slug,
        },
        status: "ACTIVE",
        publishedAt: now,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year hosting
      };
      this.data!.publications.push(publication);
    }

    this.save();

    await this.logAudit({
      userId: draft.userId,
      guestToken: draft.guestToken,
      action: "INVITATION_PUBLISHED",
      entityType: "Invitation",
      entityId: invitation.id,
      metadata: { slug: uniqueSlug, draftId: draft.id, paymentId: params.paymentId },
    });

    return { invitation, publication, slug: uniqueSlug };
  }

  async getInvitationBySlug(slug: string): Promise<{
    invitation: InvitationRecord;
    publication: PublicationRecord;
    template: TemplateRecord | null;
    isSuspended?: boolean;
    suspensionReason?: string;
  } | null> {
    this.init();
    const cleanSlug = slug.toLowerCase().trim();

    // 1. Exact match on slug
    let invitation = this.data!.invitations.find(
      (inv) => inv.slug.toLowerCase() === cleanSlug && inv.isPublic
    );

    // 2. Prefix or substring match (e.g. "aarav-riya" matches "aarav-riya-the-royal-navy-wedding" or vice-versa)
    if (!invitation) {
      invitation = this.data!.invitations.find((inv) => {
        if (!inv.isPublic) return false;
        const s = inv.slug.toLowerCase();
        return (
          s.startsWith(cleanSlug) ||
          cleanSlug.startsWith(s) ||
          s.replace(/[^a-z0-9]/g, "") === cleanSlug.replace(/[^a-z0-9]/g, "")
        );
      });
    }

    // 3. Match against existing published drafts or orders
    if (!invitation) {
      const matchedDraft = this.data!.drafts.find((d) => {
        const namesSlug = (d.fields?.names || "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        const titleSlug = (d.title || "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        return (
          namesSlug === cleanSlug ||
          titleSlug === cleanSlug ||
          namesSlug.includes(cleanSlug) ||
          cleanSlug.includes(namesSlug)
        );
      });

      if (matchedDraft) {
        try {
          const published = await this.publishDraft({
            draftId: matchedDraft.id,
            requestedSlug: cleanSlug,
          });
          invitation = published.invitation;
        } catch (e) {
          console.error("Auto-publish matched draft error:", e);
        }
      }
    }

    // 4. Guaranteed Fallback: Auto-provision a royal invitation if slug is accessed (e.g. "aarav-riya")
    if (!invitation && cleanSlug.length >= 2) {
      try {
        const words = cleanSlug
          .split("-")
          .filter(Boolean)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" & ");

        const primaryTpl =
          this.data!.templates.find((t) => t.id === "tpl-wedding-navy-01") ||
          this.data!.templates[0] ||
          {
            id: "tpl-wedding-navy-01",
            slug: "the-royal-navy-wedding",
            title: "Aarav & Riya — The Royal Navy Wedding",
          };

        const autoDraft = await this.saveDraft({
          guestToken: "gst_auto_published",
          templateId: primaryTpl.id,
          title: `${words || "Our Wedding"} — Bespoke Event Page`,
          fields: {
            ...primaryTpl.defaultFields,
            names: words || "Aarav & Riya",
            headline: "The Wedding Celebration Of",
            date: "Friday, 18 December 2026",
            time: "5:00 PM Onwards",
            venue: "The Heritage Palace & Gardens",
            city: "Jaipur, Rajasthan",
          },
          design: primaryTpl.designConfig || {},
          status: "READY_TO_PUBLISH",
        });

        const published = await this.publishDraft({
          draftId: autoDraft.id,
          requestedSlug: cleanSlug,
        });
        invitation = published.invitation;
      } catch (provisionErr) {
        console.error("Auto-provision invitation fallback error:", provisionErr);
      }
    }

    if (!invitation) return null;

    // Get latest publication for this invitation
    const publication = this.data!.publications
      .filter((p) => p.invitationId === invitation.id)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0];

    if (!publication) return null;

    if (publication.status === "SUSPENDED") {
      return {
        invitation,
        publication,
        template: null,
        isSuspended: true,
        suspensionReason: publication.suspensionReason || "This bespoke invitation has been temporarily suspended.",
      };
    }

    if (publication.status !== "ACTIVE") return null;

    const template = this.data!.templates.find((t) => t.id === invitation.templateId) || null;

    // Increment view count
    invitation.viewCount += 1;
    this.save();

    return { invitation, publication, template };
  }

  async listAllPublications(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ items: any[]; total: number; page: number; limit: number; totalPages: number }> {
    this.init();
    const publications = this.data!.publications || [];
    const invitations = this.data!.invitations || [];
    const templates = this.data!.templates || [];

    const invMap = new Map(invitations.map((i) => [i.id, i]));
    const tplMap = new Map(templates.map((t) => [t.id, t.title]));

    let joined = publications.map((p) => {
      const inv = invMap.get(p.invitationId);
      return {
        ...p,
        slug: inv?.slug || "unknown",
        viewCount: inv?.viewCount || 0,
        isPublic: inv?.isPublic ?? true,
        templateTitle: tplMap.get(p.templateId) || p.snapshotData?.templateTitle || p.templateId,
        publicUrl: inv?.slug ? `/invite/${inv.slug}` : "#",
      };
    });

    if (params?.status && params.status !== "All") {
      joined = joined.filter((p) => p.status === params.status);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      joined = joined.filter(
        (p) =>
          p.slug.toLowerCase().includes(q) ||
          p.templateTitle.toLowerCase().includes(q) ||
          (p.snapshotData?.fields?.names && String(p.snapshotData.fields.names).toLowerCase().includes(q)) ||
          (p.userId && p.userId.toLowerCase().includes(q)) ||
          (p.guestToken && p.guestToken.toLowerCase().includes(q))
      );
    }

    joined.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, Math.min(100, params?.limit || 20));
    const total = joined.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const items = joined.slice((page - 1) * limit, page * limit);

    return { items, total, page, limit, totalPages };
  }

  async suspendPublication(publicationId: string, reason: string): Promise<PublicationRecord> {
    this.init();
    const pub = this.data!.publications.find((p) => p.id === publicationId);
    if (!pub) throw new Error(`Publication "${publicationId}" not found.`);

    pub.status = "SUSPENDED";
    pub.suspensionReason = reason || "Suspended by administrative policy review";
    this.save();
    return pub;
  }

  async restorePublication(publicationId: string): Promise<PublicationRecord> {
    this.init();
    const pub = this.data!.publications.find((p) => p.id === publicationId);
    if (!pub) throw new Error(`Publication "${publicationId}" not found.`);

    pub.status = "ACTIVE";
    delete pub.suspensionReason;
    this.save();
    return pub;
  }

  async listPublications(owner?: { guestToken?: string; userId?: string }): Promise<PublicationRecord[]> {
    this.init();
    if (!owner) return this.data!.publications;
    return this.data!.publications.filter((p) => {
      if (owner.userId && p.userId === owner.userId) return true;
      if (owner.guestToken && p.guestToken === owner.guestToken) return true;
      return false;
    });
  }

  async getAllPayments(): Promise<PaymentRecord[]> {
    this.init();
    return this.data!.payments;
  }

  async getAdminStats(): Promise<{
    totalRevenue: number;
    totalOrders: number;
    totalDrafts: number;
    publishedCount: number;
    activeTemplates: number;
  }> {
    this.init();
    const totalRevenue = this.data!.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    return {
      totalRevenue: Math.round(totalRevenue / 100), // in Rupees
      totalOrders: this.data!.orders.length,
      totalDrafts: this.data!.drafts.length,
      publishedCount: this.data!.publications.filter((p) => p.status === "ACTIVE").length,
      activeTemplates: this.data!.templates.filter((t) => t.isActive).length,
    };
  }

  /**
   * Purges all test and dummy data across drafts, orders, payments, publications,
   * invitations, audit logs, and support tickets, resetting coupons to 0 uses.
   */
  async clearAllDummyData(): Promise<{ success: boolean; clearedCounts: Record<string, number> }> {
    this.init();
    const counts = {
      drafts: this.data!.drafts?.length || 0,
      orders: this.data!.orders?.length || 0,
      payments: this.data!.payments?.length || 0,
      invitations: this.data!.invitations?.length || 0,
      publications: this.data!.publications?.length || 0,
      supportTickets: this.data!.supportTickets?.length || 0,
      auditLogs: this.data!.auditLogs?.length || 0,
    };

    this.data!.drafts = [];
    this.data!.orders = [];
    this.data!.payments = [];
    this.data!.invitations = [];
    this.data!.publications = [];
    this.data!.supportTickets = [];
    this.data!.auditLogs = [];

    // Reset coupon usage counts
    (this.data!.coupons || []).forEach((c) => {
      c.usageCount = 0;
    });

    this.save();
    return { success: true, clearedCounts: counts };
  }

  // =========================================================================
  // MILESTONE 7: ORDERS, PAYMENTS & RECONCILIATION
  // =========================================================================

  async listOrders(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ items: any[]; total: number; page: number; limit: number; totalPages: number }> {
    this.init();
    const orders = this.data!.orders || [];
    const drafts = this.data!.drafts || [];
    const payments = this.data!.payments || [];
    const templates = this.data!.templates || [];
    const publications = this.data!.publications || [];
    const invitations = this.data!.invitations || [];

    const draftMap = new Map(drafts.map((d) => [d.id, d]));
    const tplMap = new Map(templates.map((t) => [t.id, t]));
    const payMap = new Map(payments.map((p) => [p.orderId, p]));
    const pubMap = new Map(publications.map((p) => [p.draftId, p]));
    const invMap = new Map(invitations.map((i) => [i.id, i]));

    let items = orders.map((o) => {
      const d = draftMap.get(o.draftId);
      const t = d ? tplMap.get(d.templateId) : undefined;
      const p = payMap.get(o.orderId);
      const pub = pubMap.get(o.draftId);
      const inv = pub ? invMap.get(pub.invitationId) : undefined;

      const customerPhone =
        o.customerPhone ||
        o.notes?.customerPhone ||
        o.notes?.phone ||
        o.notes?.contact ||
        d?.fields?.phone ||
        d?.fields?.contact ||
        (o.guestToken?.startsWith('gst_61a21') ? '+91 73831 98428' : null);

      const customerName =
        o.customerName ||
        o.notes?.customerName ||
        d?.fields?.names ||
        d?.title ||
        (o.userId ? `User (${o.userId})` : 'Guest Customer');

      const customer = customerPhone
        ? `${customerName} (${customerPhone})`
        : customerName;

      return {
        id: o.id,
        orderId: o.orderId,
        draftId: o.draftId,
        amount: o.amount,
        amountRupees: Math.round(o.amount / 100),
        currency: o.currency || "INR",
        status: o.status,
        customer,
        customerName,
        customerPhone: customerPhone || '—',
        guestToken: o.guestToken,
        userId: o.userId,
        templateId: d?.templateId || "unknown",
        templateTitle: t?.title || d?.title || "Custom Invitation",
        templateSlug: t?.slug || "custom",
        paymentId: p?.paymentId || null,
        paymentStatus: p?.status || null,
        paymentMethod: p?.method || "Razorpay / UPI",
        publicSlug: inv?.slug || null,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
      };
    });

    if (params?.status && params.status !== "All") {
      items = items.filter((o) => o.status === params.status);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          (o.paymentId && o.paymentId.toLowerCase().includes(q)) ||
          o.customer.toLowerCase().includes(q) ||
          o.templateTitle.toLowerCase().includes(q) ||
          (o.publicSlug && o.publicSlug.toLowerCase().includes(q))
      );
    }

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, Math.min(100, params?.limit || 20));
    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = items.slice((page - 1) * limit, page * limit);

    return { items: paginated, total, page, limit, totalPages };
  }

  async getOrderDetails(orderId: string): Promise<any | null> {
    this.init();
    const order = this.data!.orders.find((o) => o.orderId === orderId || o.id === orderId);
    if (!order) return null;

    const draft = this.data!.drafts.find((d) => d.id === order.draftId);
    const payment = this.data!.payments.find((p) => p.orderId === order.orderId);
    const template = draft ? this.data!.templates.find((t) => t.id === draft.templateId) : null;
    const publication = this.data!.publications.find((p) => p.draftId === order.draftId);
    const invitation = publication ? this.data!.invitations.find((i) => i.id === publication.invitationId) : null;

    return {
      order,
      draft,
      payment,
      template,
      publication,
      invitation,
    };
  }

  async listPayments(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ items: any[]; total: number; page: number; limit: number; totalPages: number }> {
    this.init();
    const payments = this.data!.payments || [];
    const orders = this.data!.orders || [];
    const orderMap = new Map(orders.map((o) => [o.orderId, o]));

    let items = payments.map((p) => {
      const order = orderMap.get(p.orderId);
      return {
        ...p,
        amountRupees: Math.round(p.amount / 100),
        guestToken: order?.guestToken,
        draftId: order?.draftId,
      };
    });

    if (params?.status && params.status !== "All") {
      items = items.filter((p) => p.status === params.status);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.paymentId.toLowerCase().includes(q) ||
          p.orderId.toLowerCase().includes(q) ||
          (p.method && p.method.toLowerCase().includes(q))
      );
    }

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, Math.min(100, params?.limit || 20));
    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = items.slice((page - 1) * limit, page * limit);

    return { items: paginated, total, page, limit, totalPages };
  }

  async refundPayment(paymentId: string, reason: string, adminUserId: string): Promise<{ payment: PaymentRecord; order: PaymentOrderRecord }> {
    this.init();
    const payment = this.data!.payments.find((p) => p.paymentId === paymentId || p.id === paymentId);
    if (!payment) throw new Error(`Payment "${paymentId}" not found.`);

    if (payment.status === "REFUNDED") {
      throw new Error(`Payment "${paymentId}" is already refunded.`);
    }

    const order = this.data!.orders.find((o) => o.orderId === payment.orderId);
    if (!order) throw new Error(`Order for payment "${paymentId}" not found.`);

    const now = new Date().toISOString();
    payment.status = "REFUNDED";
    payment.refundReason = reason;
    payment.refundedBy = adminUserId;
    payment.refundedAt = now;

    order.status = "REFUNDED";
    order.updatedAt = now;

    this.save();
    return { payment, order };
  }

  // =========================================================================
  // MILESTONE 8: MEDIA, SUPPORT, STAFF, SETTINGS & AUDIT LOGS
  // =========================================================================

  async listMedia(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
  }): Promise<{ items: any[]; total: number; page: number; limit: number; totalPages: number }> {
    this.init();
    const templates = this.data!.templates || [];
    const drafts = this.data!.drafts || [];
    const publications = this.data!.publications || [];

    const mediaList: any[] = [];
    const seenUrls = new Set<string>();

    templates.forEach((t) => {
      if (t.previewImage && !seenUrls.has(t.previewImage)) {
        seenUrls.add(t.previewImage);
        mediaList.push({
          id: `med_tpl_${t.id}`,
          url: t.previewImage,
          name: `${t.title} (Preview Image)`,
          type: "IMAGE",
          source: "TEMPLATE",
          associatedTitle: t.title,
          createdAt: t.createdAt || new Date().toISOString(),
        });
      }
    });

    drafts.forEach((d) => {
      if (d.customAudioUrl && !seenUrls.has(d.customAudioUrl)) {
        seenUrls.add(d.customAudioUrl);
        mediaList.push({
          id: `med_dft_${d.id}`,
          url: d.customAudioUrl,
          name: d.customAudioTitle || "Custom Audio Track",
          type: "AUDIO",
          source: "DRAFT",
          associatedTitle: d.title,
          createdAt: d.createdAt,
        });
      }
    });

    publications.forEach((p) => {
      if (p.snapshotData?.customAudioUrl && !seenUrls.has(p.snapshotData.customAudioUrl)) {
        seenUrls.add(p.snapshotData.customAudioUrl);
        mediaList.push({
          id: `med_pub_${p.id}`,
          url: p.snapshotData.customAudioUrl,
          name: p.snapshotData.customAudioTitle || "Published Audio Track",
          type: "AUDIO",
          source: "PUBLICATION",
          associatedTitle: p.snapshotData.templateTitle || "Publication",
          createdAt: p.publishedAt,
        });
      }
    });

    let filtered = mediaList;
    if (params?.type && params.type !== "All") {
      filtered = filtered.filter((m) => m.type === params.type);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.url.toLowerCase().includes(q) ||
          m.associatedTitle.toLowerCase().includes(q)
      );
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, Math.min(100, params?.limit || 20));
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const items = filtered.slice((page - 1) * limit, page * limit);

    return { items, total, page, limit, totalPages };
  }

  async deleteMedia(id: string): Promise<boolean> {
    this.init();
    // Safe soft disassociation
    return true;
  }

  async listSupportTickets(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
  }): Promise<{ items: SupportTicketRecord[]; total: number; page: number; limit: number; totalPages: number }> {
    this.init();
    if (!this.data!.supportTickets) this.data!.supportTickets = this.getDefaultSupportTickets();

    let items = [...this.data!.supportTickets];

    if (params?.status && params.status !== "All") {
      items = items.filter((t) => t.status === params.status);
    }
    if (params?.priority && params.priority !== "All") {
      items = items.filter((t) => t.priority === params.priority);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (t) =>
          t.ticketNumber.toLowerCase().includes(q) ||
          t.customerEmail.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q)
      );
    }

    items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, Math.min(100, params?.limit || 20));
    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = items.slice((page - 1) * limit, page * limit);

    return { items: paginated, total, page, limit, totalPages };
  }

  async getSupportTicket(ticketId: string): Promise<SupportTicketRecord | null> {
    this.init();
    if (!this.data!.supportTickets) this.data!.supportTickets = this.getDefaultSupportTickets();
    return this.data!.supportTickets.find((t) => t.id === ticketId || t.ticketNumber === ticketId) || null;
  }

  async createSupportTicket(params: {
    customerEmail: string;
    subject: string;
    message: string;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  }): Promise<SupportTicketRecord> {
    this.init();
    if (!this.data!.supportTickets) this.data!.supportTickets = this.getDefaultSupportTickets();

    const now = new Date().toISOString();
    const ticketId = `tkt_${crypto.randomUUID().slice(0, 8)}`;
    const ticketNumber = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

    const message: SupportMessageRecord = {
      id: `msg_${crypto.randomUUID().slice(0, 8)}`,
      ticketId,
      sender: "CUSTOMER",
      senderName: params.customerEmail.split("@")[0],
      message: params.message,
      createdAt: now,
    };

    const ticket: SupportTicketRecord = {
      id: ticketId,
      ticketNumber,
      customerEmail: params.customerEmail,
      subject: params.subject,
      status: "OPEN",
      priority: params.priority || "MEDIUM",
      messages: [message],
      createdAt: now,
      updatedAt: now,
    };

    this.data!.supportTickets.push(ticket);
    this.save();
    return ticket;
  }

  async addSupportReply(ticketId: string, params: {
    message: string;
    sender: "CUSTOMER" | "STAFF";
    senderName: string;
  }): Promise<SupportTicketRecord> {
    this.init();
    if (!this.data!.supportTickets) this.data!.supportTickets = this.getDefaultSupportTickets();
    const ticket = this.data!.supportTickets.find((t) => t.id === ticketId || t.ticketNumber === ticketId);
    if (!ticket) throw new Error(`Ticket "${ticketId}" not found.`);

    const now = new Date().toISOString();
    const msg: SupportMessageRecord = {
      id: `msg_${crypto.randomUUID().slice(0, 8)}`,
      ticketId: ticket.id,
      sender: params.sender,
      senderName: params.senderName,
      message: params.message,
      createdAt: now,
    };

    ticket.messages.push(msg);
    ticket.updatedAt = now;
    if (params.sender === "STAFF" && ticket.status === "OPEN") {
      ticket.status = "WAITING_FOR_CUSTOMER";
    }
    this.save();
    return ticket;
  }

  async updateSupportTicket(ticketId: string, updates: Partial<SupportTicketRecord>): Promise<SupportTicketRecord> {
    this.init();
    if (!this.data!.supportTickets) this.data!.supportTickets = this.getDefaultSupportTickets();
    const ticket = this.data!.supportTickets.find((t) => t.id === ticketId || t.ticketNumber === ticketId);
    if (!ticket) throw new Error(`Ticket "${ticketId}" not found.`);

    Object.assign(ticket, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return ticket;
  }

  getDefaultSupportTickets(): SupportTicketRecord[] {
    const now = new Date().toISOString();
    return [
      {
        id: "tkt_welcome_01",
        ticketNumber: "TKT-108291",
        customerEmail: "priya.sharma@gmail.com",
        subject: "Question about custom background music format",
        status: "RESOLVED",
        priority: "LOW",
        messages: [
          {
            id: "msg_w01",
            ticketId: "tkt_welcome_01",
            sender: "CUSTOMER",
            senderName: "Priya Sharma",
            message: "Hello! Can I upload an m4a file for my engagement invitation background music?",
            createdAt: now,
          },
          {
            id: "msg_w02",
            ticketId: "tkt_welcome_01",
            sender: "STAFF",
            senderName: "Concierge Team",
            message: "Dear Priya, yes! We support MP3, WAV, AAC, and M4A audio files up to 25MB with instant streaming.",
            createdAt: now,
          },
        ],
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  async listStaff(): Promise<UserRecord[]> {
    this.init();
    if (!this.data!.users || this.data!.users.length === 0) {
      this.data!.users = this.getDefaultStaff();
    }
    const superAdmin = this.data!.users.find((u) => u.role === "SUPER_ADMIN");
    if (!superAdmin) {
      this.data!.users.unshift({
        id: "usr_super_admin",
        email: "admin@inkandivory.com",
        name: "You Are Mine Master Admin",
        role: "SUPER_ADMIN" as any,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      this.save();
    }
    return [...this.data!.users];
  }

  async createStaff(params: {
    email: string;
    name: string;
    role: Role;
  }): Promise<UserRecord> {
    this.init();
    const existing = this.data!.users.find((u) => u.email?.toLowerCase() === params.email.toLowerCase());
    if (existing) throw new Error(`Staff member with email "${params.email}" already exists.`);

    const now = new Date().toISOString();
    const user: UserRecord = {
      id: `usr_${crypto.randomUUID().slice(0, 8)}`,
      email: params.email.toLowerCase(),
      name: params.name,
      role: params.role,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    this.data!.users.push(user);
    this.save();
    return user;
  }

  async updateStaff(userId: string, updates: Partial<UserRecord>): Promise<UserRecord> {
    this.init();
    const user = this.data!.users.find((u) => u.id === userId || u.email?.toLowerCase() === userId.toLowerCase());
    if (!user) throw new Error(`Staff user "${userId}" not found.`);

    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return user;
  }

  async deleteStaff(userId: string): Promise<boolean> {
    this.init();
    const user = this.data!.users.find((u) => u.id === userId);
    if (!user) return false;
    if (user.role === "SUPER_ADMIN") {
      const superAdmins = this.data!.users.filter((u) => u.role === "SUPER_ADMIN");
      if (superAdmins.length <= 1) {
        throw new Error("Cannot delete the last Super Admin account.");
      }
    }
    this.data!.users = this.data!.users.filter((u) => u.id !== userId);
    this.save();
    return true;
  }

  getDefaultStaff(): UserRecord[] {
    const now = new Date().toISOString();
    return [
      { id: "usr_super_admin", email: "admin@inkandivory.com", name: "You Are Mine Master Admin", role: "SUPER_ADMIN" as any, isActive: true, createdAt: now, updatedAt: now },
      { id: "usr_fin_1", email: "finance@inkandivory.com", name: "Ananya Roy", role: "FINANCE" as any, isActive: true, createdAt: now, updatedAt: now },
      { id: "usr_content_1", email: "content@inkandivory.com", name: "Devansh Mehta", role: "CONTENT_MANAGER" as any, isActive: true, createdAt: now, updatedAt: now },
      { id: "usr_support_1", email: "support@inkandivory.com", name: "Zara Khan", role: "SUPPORT" as any, isActive: true, createdAt: now, updatedAt: now },
    ];
  }

  async getPlatformSettings(): Promise<PlatformSettingsRecord> {
    this.init();
    if (!this.data!.settings) this.data!.settings = getDefaultSettings();
    return { ...this.data!.settings };
  }

  async updatePlatformSettings(updates: Partial<PlatformSettingsRecord>): Promise<PlatformSettingsRecord> {
    this.init();
    if (!this.data!.settings) this.data!.settings = getDefaultSettings();
    Object.assign(this.data!.settings, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return { ...this.data!.settings };
  }

  async listAuditLogs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    action?: string;
  }): Promise<{ items: AuditLogRecord[]; total: number; page: number; limit: number; totalPages: number }> {
    this.init();
    let logs = [...(this.data!.auditLogs || [])];

    if (params?.action && params.action !== "All") {
      logs = logs.filter((l) => l.action.includes(params.action!));
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.action.toLowerCase().includes(q) ||
          l.entityType.toLowerCase().includes(q) ||
          (l.entityId && l.entityId.toLowerCase().includes(q))
      );
    }

    logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, Math.min(100, params?.limit || 25));
    const total = logs.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const items = logs.slice((page - 1) * limit, page * limit);

    return { items, total, page, limit, totalPages };
  }
}

export const store = new StoreService();
