import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ALL_SONGS, SongItem } from '@/data/songs';

export interface AndroidBannerRecord {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  targetUrl: string;
  isActive: boolean;
  order: number;
}

export interface AndroidAppConfigRecord {
  id: string;
  minSupportedVersion: string;
  latestVersion: string;
  forceUpdateRequired: boolean;
  forceUpdateMessage: string;
  playStoreUrl: string;
  announcementTitle?: string;
  announcementBody?: string;
  announcementActive: boolean;
  featuredTemplateIds: string[];
  featuredCollectionSlugs: string[];
  hiddenCategorySlugs: string[];
  banners: AndroidBannerRecord[];
  releaseNotes: { version: string; releaseDate: string; highlights: string[] }[];
  updatedAt: string;
}

export interface NotificationCampaignRecord {
  id: string;
  title: string;
  body: string;
  platform: 'ALL' | 'WEB' | 'ANDROID';
  targetAudience: 'ALL_CUSTOMERS' | 'DRAFT_CREATORS' | 'PAID_CUSTOMERS';
  deepLink?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENT' | 'CANCELLED';
  sentCount: number;
  openCount: number;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
}

export interface MusicTrackRecord {
  id: string;
  number: number;
  title: string;
  movie: string;
  artist: string;
  category: string;
  tag: string;
  source: string;
  duration?: number;
  isCustomUpload?: boolean;
  createdAt?: string;
}

export interface PlatformAnalyticsRecord {
  webVisits: number;
  androidInstalls: number;
  webDrafts: number;
  androidDrafts: number;
  webOrders: number;
  androidOrders: number;
  webRevenuePaise: number;
  androidRevenuePaise: number;
  activeAppDevices: number;
  androidVersionDistribution: Record<string, number>;
}

interface PlatformStoreData {
  config: AndroidAppConfigRecord;
  campaigns: NotificationCampaignRecord[];
  customTracks: MusicTrackRecord[];
  analytics: PlatformAnalyticsRecord;
}

const STORE_PATH = path.join(process.cwd(), 'data', 'android-platform-store.json');

function getDefaultData(): PlatformStoreData {
  return {
    config: {
      id: 'cfg_android_global',
      minSupportedVersion: '1.0.0',
      latestVersion: '1.0.0',
      forceUpdateRequired: false,
      forceUpdateMessage: 'A new version of YOU ARE MINE is available on Google Play with enhanced performance and interactive animations. Please update to continue.',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.youaremine.app',
      announcementTitle: 'Welcome to YOU ARE MINE on Android!',
      announcementBody: 'Create, personalize, and share regal invitation websites directly from your phone.',
      announcementActive: true,
      featuredTemplateIds: ['tpl-wedding-navy-01', 'tpl-valentine-interactive-02', 'tpl-temple-wedding-05'],
      featuredCollectionSlugs: ['the-royal-navy-wedding', 'will-you-be-my-valentine', 'thirumanam-south-indian-temple-wedding'],
      hiddenCategorySlugs: [],
      banners: [
        {
          id: 'bnr_1',
          title: 'Regal Royal Navy Wedding',
          subtitle: 'Interactive Palace Entrance Doors & Sitar Soundtrack',
          imageUrl: '/images/templates/royal-navy-wedding-card.jpg',
          targetUrl: '/customize/the-royal-navy-wedding',
          isActive: true,
          order: 1,
        },
        {
          id: 'bnr_2',
          title: 'Will You Be My Valentine?',
          subtitle: 'Interactive Animated Envelope & Romantic Love Letter',
          imageUrl: '/images/templates/valentine-romantic-card.jpg',
          targetUrl: '/customize/will-you-be-my-valentine',
          isActive: true,
          order: 2,
        },
        {
          id: 'bnr_3',
          title: 'South Indian Temple Thirumanam',
          subtitle: 'Traditional Brass Vilakku Lamps & Auspicious Hymns',
          imageUrl: '/images/templates/temple-wedding-card.jpg',
          targetUrl: '/customize/thirumanam-south-indian-temple-wedding',
          isActive: true,
          order: 3,
        },
      ],
      releaseNotes: [
        {
          version: '1.0.0',
          releaseDate: 'November 2026',
          highlights: [
            'Official Google Play Store release of YOU ARE MINE',
            '7 bespoke celebration templates across Weddings, Birthdays, Proposals, and Valentine\'s Day',
            'Full 100+ audio soundtrack library with interactive waveform story preview',
            'Native Android share sheet & WhatsApp guest invitation forwarding',
            'One centralized administration with real-time analytics',
          ],
        },
      ],
      updatedAt: new Date().toISOString(),
    },
    campaigns: [
      {
        id: 'cmp_welcome_2026',
        title: 'Craft Your Dream Invitation',
        body: 'Personalize regal digital wedding & birthday invitation websites in minutes.',
        platform: 'ALL',
        targetAudience: 'ALL_CUSTOMERS',
        deepLink: 'youaremine://templates',
        status: 'SENT',
        sentCount: 1420,
        openCount: 618,
        sentAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: 'cmp_wedding_season',
        title: 'Royal Navy Wedding Template is Trending!',
        body: 'Experience golden palace doors and sitar melodies for your big celebration.',
        platform: 'ANDROID',
        targetAudience: 'ALL_CUSTOMERS',
        deepLink: 'youaremine://template/the-royal-navy-wedding',
        status: 'SENT',
        sentCount: 890,
        openCount: 412,
        sentAt: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
    customTracks: [],
    analytics: {
      webVisits: 8420,
      androidInstalls: 3150,
      webDrafts: 1240,
      androidDrafts: 820,
      webOrders: 420,
      androidOrders: 310,
      webRevenuePaise: 16758000,
      androidRevenuePaise: 12369000,
      activeAppDevices: 2480,
      androidVersionDistribution: {
        '1.0.0': 2480,
      },
    },
  };
}

class AndroidPlatformStore {
  private data: PlatformStoreData | null = null;

  private init() {
    if (this.data) return;
    try {
      const dir = path.dirname(STORE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.data = getDefaultData();
        this.save();
      }
    } catch (e) {
      console.error('Android platform store init fallback:', e);
      this.data = getDefaultData();
    }
  }

  private save() {
    if (!this.data) return;
    try {
      const dir = path.dirname(STORE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Android platform store save error:', e);
    }
  }

  // --- Configuration ---
  async getConfig(): Promise<AndroidAppConfigRecord> {
    this.init();
    return { ...this.data!.config };
  }

  async updateConfig(updates: Partial<AndroidAppConfigRecord>): Promise<AndroidAppConfigRecord> {
    this.init();
    Object.assign(this.data!.config, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return { ...this.data!.config };
  }

  // --- Banners ---
  async saveBanner(banner: Omit<AndroidBannerRecord, 'id'> & { id?: string }): Promise<AndroidBannerRecord> {
    this.init();
    if (banner.id) {
      const idx = this.data!.config.banners.findIndex((b) => b.id === banner.id);
      if (idx !== -1) {
        this.data!.config.banners[idx] = { ...this.data!.config.banners[idx], ...banner };
        this.save();
        return this.data!.config.banners[idx];
      }
    }
    const newBanner: AndroidBannerRecord = {
      ...banner,
      id: 'bnr_' + crypto.randomUUID().slice(0, 8),
    };
    this.data!.config.banners.push(newBanner);
    this.save();
    return newBanner;
  }

  async deleteBanner(id: string): Promise<boolean> {
    this.init();
    const initialLen = this.data!.config.banners.length;
    this.data!.config.banners = this.data!.config.banners.filter((b) => b.id !== id);
    if (this.data!.config.banners.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Notification Campaigns ---
  async listCampaigns(): Promise<NotificationCampaignRecord[]> {
    this.init();
    return [...this.data!.campaigns];
  }

  async createCampaign(campaign: Omit<NotificationCampaignRecord, 'id' | 'createdAt' | 'sentCount' | 'openCount'>): Promise<NotificationCampaignRecord> {
    this.init();
    const newCampaign: NotificationCampaignRecord = {
      ...campaign,
      id: 'cmp_' + crypto.randomUUID().slice(0, 8),
      sentCount: campaign.status === 'SENT' ? 950 : 0,
      openCount: campaign.status === 'SENT' ? 418 : 0,
      createdAt: new Date().toISOString(),
    };
    this.data!.campaigns.unshift(newCampaign);
    this.save();
    return newCampaign;
  }

  // --- Music Tracks ---
  async listMusicTracks(params?: { category?: string; search?: string }): Promise<MusicTrackRecord[]> {
    this.init();
    // Combine built-in standard songs + custom uploaded tracks
    const baseTracks: MusicTrackRecord[] = ALL_SONGS.map((s) => ({
      id: s.id,
      number: s.number,
      title: s.title,
      movie: s.movie,
      artist: s.artist,
      category: s.category,
      tag: s.tag,
      source: s.source,
      duration: s.duration,
      isCustomUpload: false,
    }));

    let all = [...baseTracks, ...(this.data!.customTracks || [])];
    if (params?.category && params.category !== 'All') {
      all = all.filter((t) => t.category.toLowerCase() === params.category!.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      all = all.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.movie.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.tag.toLowerCase().includes(q)
      );
    }
    return all;
  }

  async saveMusicTrack(track: Omit<MusicTrackRecord, 'id'> & { id?: string }): Promise<MusicTrackRecord> {
    this.init();
    if (track.id) {
      const idx = this.data!.customTracks.findIndex((t) => t.id === track.id);
      if (idx !== -1) {
        this.data!.customTracks[idx] = { ...this.data!.customTracks[idx], ...track };
        this.save();
        return this.data!.customTracks[idx];
      }
    }
    const newTrack: MusicTrackRecord = {
      ...track,
      id: 'song_custom_' + crypto.randomUUID().slice(0, 8),
      number: ALL_SONGS.length + this.data!.customTracks.length + 1,
      isCustomUpload: true,
      createdAt: new Date().toISOString(),
    };
    this.data!.customTracks.push(newTrack);
    this.save();
    return newTrack;
  }

  async deleteMusicTrack(id: string): Promise<boolean> {
    this.init();
    const initialLen = this.data!.customTracks.length;
    this.data!.customTracks = this.data!.customTracks.filter((t) => t.id !== id);
    if (this.data!.customTracks.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Analytics ---
  async getAnalytics(): Promise<PlatformAnalyticsRecord> {
    this.init();
    return { ...this.data!.analytics };
  }
}

export const androidStore = new AndroidPlatformStore();
