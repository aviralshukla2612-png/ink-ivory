import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createRateLimitResponse } from "@/lib/security/rate-limit-response";
import { validateImageMagicBytes, sanitizeFileName } from "@/lib/security/file-guard";
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
        { success: false, error: "No image file provided" },
        { status: 400 }
      );
    }

    // 2. Size Validation (max 10 MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "Image file too large. Maximum size allowed is 10 MB." },
        { status: 400 }
      );
    }

    // 3. Extension Validation
    const safeName = sanitizeFileName(file.name);
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const lowerName = safeName.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));

    if (!hasValidExt) {
      return NextResponse.json(
        { success: false, error: "Unsupported file extension. Allowed formats: JPG, JPEG, PNG, WEBP." },
        { status: 400 }
      );
    }

    // 4. Magic Byte (File Signature) Inspection
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const magicCheck = validateImageMagicBytes(buffer);

    if (!magicCheck.valid) {
      logSecurityEvent({
        event: "MALICIOUS_UPLOAD_BLOCKED",
        level: "WARN",
        details: { fileName: file.name, size: file.size, reason: magicCheck.error },
      });
      return NextResponse.json(
        { success: false, error: magicCheck.error || "File signature does not match authentic image data." },
        { status: 400 }
      );
    }

    // 5. Safe Storage Write
    const uploadDir = path.join(process.cwd(), "public", "uploads", "images");
    await mkdir(uploadDir, { recursive: true });

    const timestamp = Date.now();
    const fileName = `photo_${timestamp}_${safeName}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/images/${fileName}`;

    logSecurityEvent({
      event: "IMAGE_UPLOADED_SUCCESS",
      level: "INFO",
      details: { fileName, size: file.size },
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
    });
  } catch (error: any) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process image file" },
      { status: 500 }
    );
  }
}
