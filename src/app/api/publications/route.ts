import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getOrCreateGuestToken, setGuestTokenCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";

export async function GET(request: NextRequest) {
  const rl = checkRateLimit(request, "draftOperations");
  if (!rl.success) return createRateLimitResponse(rl);

  try {
    const { guestToken } = getOrCreateGuestToken(request);
    
    // List publications owned by this guestToken or userId
    const publications = await store.listPublications({ guestToken });
    const allInvitations = (store as any).data?.invitations || [];
    const allTemplates = (store as any).data?.templates || [];

    // Augment publication with invitation slug and template details
    const augmented = publications.map((pub) => {
      const invitation = allInvitations.find((inv: any) => inv.id === pub.invitationId || inv.draftId === pub.draftId);
      const template = allTemplates.find((t: any) => t.id === pub.templateId);
      return {
        ...pub,
        slug: invitation?.slug || "celebration",
        viewCount: invitation?.viewCount || 0,
        isPublic: invitation?.isPublic ?? true,
        templateTitle: template?.title || pub.snapshotData?.templateTitle || "You Are Mine Bespoke Invitation",
        templateSlug: template?.slug || pub.snapshotData?.templateSlug || "template",
        liveUrl: `/invite/${invitation?.slug || "celebration"}`,
      };
    });

    const response = NextResponse.json({ success: true, publications: augmented });
    setGuestTokenCookie(response, guestToken);
    return response;
  } catch (error: any) {
    console.error("Publications API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
