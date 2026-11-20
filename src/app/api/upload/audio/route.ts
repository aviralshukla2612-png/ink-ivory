import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { validateAudioMagicBytes, sanitizeFileName } from "@/lib/security/file-guard";
import { logSecurityEvent } from "@/lib/security/logger";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // 1. Rate Limiting Check
  const rl = checkRateLimit(req, "mediaUpload");
  if (!rl.success) return createRateLimitResponse(rl);

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No audio file provided" },
        { status: 400 }
      );
    }

    // 2. Size Validation (max 25 MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "Audio file too large. Maximum size allowed is 25 MB." },
        { status: 400 }
      );
    }

    // 3. Extension Validation
    const safeName = sanitizeFileName(file.name);
    const validExtensions = [".mp3", ".wav", ".aac", ".m4a", ".ogg"];
    const lowerName = safeName.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));

    if (!hasValidExt) {
      return NextResponse.json(
        { success: false, error: "Unsupported file extension. Allowed formats: MP3, WAV, AAC, M4A, OGG." },
        { status: 400 }
      );
    }

    // 4. Magic Byte (File Signature) Inspection
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const magicCheck = validateAudioMagicBytes(buffer);

    if (!magicCheck.valid) {
      logSecurityEvent({
        event: "MALICIOUS_UPLOAD_BLOCKED",
        level: "WARN",
        details: { fileName: file.name, size: file.size, reason: magicCheck.error },
      });
      return NextResponse.json(
        { success: false, error: magicCheck.error || "File signature does not match authentic audio data." },
        { status: 400 }
      );
    }

    // 5. Safe Storage Write
    const uploadDir = path.join(process.cwd(), "public", "uploads", "audio");
    await mkdir(uploadDir, { recursive: true });

    const timestamp = Date.now();
    const fileName = `song_${timestamp}_${safeName}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/audio/${fileName}`;
    const cleanTitle = safeName.replace(/\.[^/.]+$/, "");

    logSecurityEvent({
      event: "AUDIO_UPLOADED_SUCCESS",
      level: "INFO",
      details: { fileName, size: file.size },
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      title: cleanTitle,
      size: file.size,
      originalName: safeName,
    });
  } catch (error: any) {
    console.error("Audio upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process audio file" },
      { status: 500 }
    );
  }
}
