export type OccasionCategory =
  | 'Birthday'
  | 'Wedding'
  | 'Engagement'
  | 'Valentine\'s Day'
  | 'Anniversary'
  | 'Baby Shower'
  | 'Graduation'
  | 'Festivals'
  | 'Thank You'
  | 'Congratulations'
  | 'Housewarming';

export interface WeddingEventItem {
  name: string;
  icon?: string;
  date?: string;
  when?: string;
  time: string;
  venue?: string;
  where?: string;
  map?: string;
  note?: string;
  photo?: string | null;
  description?: string;
}

export interface StoryMilestoneItem {
  title: string;
  date: string;
  description?: string;
  milestone?: string;
  tag?: string;
}

export interface MemoryItem {
  id?: number;
  caption?: string;
  date: string;
}

export interface EditableFields {
  eyebrow?: string;
  headline?: string;
  names: string;
  secondaryName?: string;
  date: string;
  time?: string;
  venue?: string;
  city?: string;
  venueAddress?: string;
  stayInfo?: string;
  mapUrl?: string;
  message: string;
  rsvp?: string;
  host?: string;
  tamilBlessing?: string;
  tamilTagline?: string;
  closingBlessing?: string;
  weddingDate?: string;
  ringsPhoto?: string;
  venuePhoto?: string;
  endPhoto?: string;
  photoUrl?: string;
  photoPositionY?: number;
  photoPositionX?: number;
  photoFit?: 'cover' | 'contain';
  photoScale?: number;
  brideParents?: string;
  groomParents?: string;
  songTitle?: string;
  audioSource?: string;
  audioStartTime?: number;
  letterMessage?: string;
  reasonsText?: string;
  events?: WeddingEventItem[];
  story?: StoryMilestoneItem[];
  memories?: MemoryItem[];
  [key: string]: any;
}

export interface DesignConfig {
  themeColor: string;
  textColor: string;
  accentColor: string;
  secondaryColor?: string;
  fontFamily: 'serif' | 'script' | 'sans' | 'modern';
  orientation: 'portrait' | 'square' | 'landscape';
  borderStyle: 'gold-floral' | 'minimal-gold' | 'ornate' | 'modern-double' | 'botanical' | 'traditional';
  hasPhoto?: boolean;
  bgTexture?: 'ivory-silk' | 'navy-luxury' | 'champagne-linen' | 'emerald-velvet' | 'rose-quartz';
}

export interface Template {
  id: string;
  slug: string;
  title: string;
  occasion: OccasionCategory;
  description: string;
  price: number;
  originalPrice?: number;
  isFree: boolean;
  isFeatured: boolean;
  isTrending?: boolean;
  rating: number;
  reviewsCount: number;
  previewImage: string;
  defaultFields: EditableFields;
  designConfig: DesignConfig;
  tags: string[];
  badge?: string;
  tier?: string;
  photoOption?: string;
  useItFor?: string;
  liveDemoUrl?: string;
}

export interface CartItem {
  template: Template;
  customization?: EditableFields;
  designConfig?: DesignConfig;
  customizedId?: string;
  quantity: number;
  draftId?: string;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  items: {
    templateId: string;
    templateTitle: string;
    price: number;
    customization: EditableFields;
    designConfig: DesignConfig;
    downloadUrlPng?: string;
    downloadUrlPdf?: string;
  }[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentId: string;
  paymentStatus: 'completed' | 'pending' | 'failed';
  downloadCount: number;
}

