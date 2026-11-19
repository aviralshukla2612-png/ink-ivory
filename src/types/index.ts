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

export interface EditableFields {
  eyebrow?: string;
  headline?: string;
  names: string;
  secondaryName?: string;
  date: string;
  time?: string;
  venue?: string;
  city?: string;
  message: string;
  rsvp?: string;
  host?: string;
  photoUrl?: string;
  brideParents?: string;
  groomParents?: string;
  songTitle?: string;
  audioStartTime?: number;
}

export interface DesignConfig {
  themeColor: string;
  textColor: string;
  accentColor: string;
  secondaryColor?: string;
  fontFamily: 'serif' | 'script' | 'sans' | 'modern';
  orientation: 'portrait' | 'square' | 'landscape';
  borderStyle: 'gold-floral' | 'minimal-gold' | 'ornate' | 'modern-double' | 'botanical';
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

