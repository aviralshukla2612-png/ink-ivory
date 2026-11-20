import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { getOrCreateGuestToken, verifyOwnership } from "@/lib/auth";
import { store } from "@/lib/store";
import { sanitizeFileName } from "@/lib/security/file-guard";
import { logSecurityEvent } from "@/lib/security/logger";

const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "894719283749182";
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "ink_ivory_mock_cloud_secret_test_2026";
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "ink-and-ivory";

export async function POST(request: NextRequest) {
  // 1. Rate Limiting Check
  const rl = checkRateLimit(request, "mediaUpload");
  if (!rl.success) return createRateLimitResponse(rl);

  try {
    const { guestToken } = getOrCreateGuestToken(request);
    const body = await request.json().catch(() => ({}));
    const { draftId, fileName, resourceType = "image" } = body;

    // 2. Draft Ownership Check
    if (draftId) {
      const draft = await store.getDraft(draftId);
      if (draft && !verifyOwnership(draft, guestToken)) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: You do not own this draft." },
          { status: 403 }
        );
      }
    }

    // 3. Allowed Extensions Whitelist
    const cleanName = sanitizeFileName(fileName || "asset");
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".mp3", ".wav"];
    const hasValidExt = allowedExtensions.some((ext) => cleanName.toLowerCase().endsWith(ext));

    if (fileName && !hasValidExt) {
      return NextResponse.json(
        { success: false, error: "Unsupported media format. Allowed: JPG, PNG, WEBP, MP3, WAV." },
        { status: 400 }
      );
    }

    // 4. Generate Cloudinary Upload Parameters
    const timestamp = Math.round(Date.now() / 1000);
    const folder = `ink-ivory/drafts/${draftId ? sanitizeFileName(draftId) : "guest"}`;
    const tags = `ink_ivory,${resourceType}`;

    // Cloudinary signature calculation: SHA1 of sorted parameters + api_secret
    const serializedParams = `folder=${folder}&tags=${tags}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash("sha1").update(serializedParams).digest("hex");

    logSecurityEvent({
      event: "CLOUDINARY_SIGNATURE_GENERATED",
      level: "INFO",
      guestToken,
      details: { draftId, resourceType, folder },
    });

    // 5. Return Signed Payload (Never exposing API Secret)
    return NextResponse.json({
      success: true,
      signature,
      timestamp,
      apiKey: CLOUDINARY_API_KEY,
      cloudName: CLOUDINARY_CLOUD_NAME,
      folder,
      tags,
      uploadUrl: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    });
  } catch (error: any) {
    console.error("Cloudinary sign error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error generating upload signature." },
      { status: 500 }
    );
  }
}
