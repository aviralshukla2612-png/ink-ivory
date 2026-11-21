import { NextRequest, NextResponse } from 'next/server';
import { androidStore } from '@/lib/android-store';

export async function GET(request: NextRequest) {
  try {
    const config = await androidStore.getConfig();

    // Filter only active banners for customer client
    const activeBanners = config.banners
      .filter((b) => b.isActive)
      .sort((a, b) => a.order - b.order);

    return NextResponse.json({
      success: true,
      data: {
        minSupportedVersion: config.minSupportedVersion,
        latestVersion: config.latestVersion,
        forceUpdateRequired: config.forceUpdateRequired,
        forceUpdateMessage: config.forceUpdateMessage,
        playStoreUrl: config.playStoreUrl,
        announcement: config.announcementActive
          ? {
              title: config.announcementTitle,
              body: config.announcementBody,
            }
          : null,
        featuredTemplateIds: config.featuredTemplateIds,
        featuredCollectionSlugs: config.featuredCollectionSlugs,
        hiddenCategorySlugs: config.hiddenCategorySlugs,
        banners: activeBanners,
        latestReleaseNotes: config.releaseNotes[0] || null,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to load app configuration' },
      { status: 500 }
    );
  }
}
