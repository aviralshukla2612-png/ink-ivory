import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getOrCreateGuestToken, setGuestTokenCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { CreateDraftSchema } from "@/lib/security/validators";

export async function GET(request: NextRequest) {
  // Rate limiting check
  const rl = checkRateLimit(request, "draftOperations");
  if (!rl.success) return createRateLimitResponse(rl);

  try {
    const { guestToken } = getOrCreateGuestToken(request);
    const drafts = await store.listDrafts({ guestToken });
    const response = NextResponse.json({ success: true, drafts });
    setGuestTokenCookie(response, guestToken);
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting check (autosave allowance)
  const rl = checkRateLimit(request, "draftAutosave");
  if (!rl.success) return createRateLimitResponse(rl);

  try {
    const { guestToken } = getOrCreateGuestToken(request);
    const body = await request.json();

    // Input schema validation with Zod
    const parsed = CreateDraftSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid draft payload" },
        { status: 400 }
      );
    }

    const validData = parsed.data;

    const draft = await store.saveDraft({
      id: validData.id,
      guestToken,
      userId: validData.userId,
      templateId: validData.templateId,
      title: validData.title,
      fields: validData.fields,
      design: validData.design,
      customAudioUrl: validData.customAudioUrl || undefined,
      customAudioTitle: validData.customAudioTitle || undefined,
      status: validData.status,
    });

    const response = NextResponse.json({ success: true, draft, guestToken });
    setGuestTokenCookie(response, guestToken);
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
