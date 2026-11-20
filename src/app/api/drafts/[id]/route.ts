import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getOrCreateGuestToken, verifyOwnership } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { UpdateDraftSchema } from "@/lib/security/validators";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rl = checkRateLimit(request, "draftOperations");
  if (!rl.success) return createRateLimitResponse(rl);

  try {
    const { id } = await params;
    if (!id || id.length > 100) {
      return NextResponse.json({ success: false, error: "Invalid draft ID" }, { status: 400 });
    }

    const { guestToken } = getOrCreateGuestToken(request);
    const draft = await store.getDraft(id);

    if (!draft) {
      return NextResponse.json({ success: false, error: "Draft not found" }, { status: 404 });
    }

    // IDOR Protection: Verify ownership
    if (!verifyOwnership(draft, guestToken)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: You do not own this draft" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, draft });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rl = checkRateLimit(request, "draftOperations");
  if (!rl.success) return createRateLimitResponse(rl);

  try {
    const { id } = await params;
    if (!id || id.length > 100) {
      return NextResponse.json({ success: false, error: "Invalid draft ID" }, { status: 400 });
    }

    const { guestToken } = getOrCreateGuestToken(request);
    const draft = await store.getDraft(id);

    if (!draft) {
      return NextResponse.json({ success: false, error: "Draft not found" }, { status: 404 });
    }

    // IDOR Protection: Verify ownership
    if (!verifyOwnership(draft, guestToken)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: You do not own this draft" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = UpdateDraftSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid update payload" },
        { status: 400 }
      );
    }

    const validData = parsed.data;
    const updated = await store.saveDraft({
      id: draft.id,
      guestToken: draft.guestToken,
      userId: draft.userId,
      templateId: draft.templateId,
      title: validData.title !== undefined ? validData.title : draft.title,
      fields: validData.fields !== undefined ? validData.fields : draft.fields,
      design: validData.design !== undefined ? validData.design : draft.design,
      customAudioUrl: validData.customAudioUrl !== undefined ? (validData.customAudioUrl || undefined) : draft.customAudioUrl,
      customAudioTitle: validData.customAudioTitle !== undefined ? (validData.customAudioTitle || undefined) : draft.customAudioTitle,
      status: validData.status !== undefined ? validData.status : draft.status,
    });

    return NextResponse.json({ success: true, draft: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
