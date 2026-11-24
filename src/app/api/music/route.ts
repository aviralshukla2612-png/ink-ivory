import { NextRequest, NextResponse } from "next/server";
import { ALL_SONGS, SONG_CATEGORIES, SongCategory } from "@/data/songs";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const rl = checkRateLimit(request, "publicApi");
  if (!rl.success) return createRateLimitResponse(rl);

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = (searchParams.get("search") || "").trim().toLowerCase();

    let tracks = ALL_SONGS;

    if (category && category !== "All") {
      tracks = tracks.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      tracks = tracks.filter(
        (s) =>
          s.title.toLowerCase().includes(search) ||
          s.movie.toLowerCase().includes(search) ||
          s.artist.toLowerCase().includes(search) ||
          s.tag.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      categories: SONG_CATEGORIES,
      total: tracks.length,
      data: tracks,
    });
  } catch (error: any) {
    console.error("GET /api/music error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load soundtrack library" },
      { status: 500 }
    );
  }
}
