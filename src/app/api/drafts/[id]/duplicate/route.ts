import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getOrCreateGuestToken, setGuestTokenCookie, verifyOwnership } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rl = checkRateLimit(request, "draftOperations");
  if (!rl.success) return createRateLimitResponse(rl);

  try {
    const { id } = await params;
    if (!id || id.length > 100) {
      return NextResponse.json({ success: false, error: "Invalid draft ID" }, { status: 400 });
    }

    const { guestToken } = getOrCreateGuestToken(request);
    const sourceDraft = await store.getDraft(id);

    if (!sourceDraft) {
      return NextResponse.json({ success: false, error: "Source draft not found" }, { status: 404 });
    }

    // IDOR Protection: Verify ownership
    if (!verifyOwnership(sourceDraft, guestToken)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: You do not own this draft" },
        { status: 403 }
      );
    }

    // Create a new duplicate draft
    const duplicated = await store.saveDraft({
      guestToken,
      userId: sourceDraft.userId,
      templateId: sourceDraft.templateId,
      title: `${sourceDraft.title || "Invitation"} (Copy)`,
      fields: JSON.parse(JSON.stringify(sourceDraft.fields || {})),
      design: JSON.parse(JSON.stringify(sourceDraft.design || {})),
      customAudioUrl: sourceDraft.customAudioUrl,
      customAudioTitle: sourceDraft.customAudioTitle,
      status: "DRAFT",
    });

    const response = NextResponse.json({ success: true, draft: duplicated });
    setGuestTokenCookie(response, guestToken);
    return response;
  } catch (error: any) {
    console.error("Duplicate draft error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
