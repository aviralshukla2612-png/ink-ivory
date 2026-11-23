import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { store } from "@/lib/store";
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
    const customerId = (formData.get("customerId") as string) || "usr_customer_default";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No profile image file provided" },
        { status: 400 }
      );
    }

    // 2. Size Validation (max 5 MB for profile avatar)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "Profile image too large. Maximum size allowed is 5 MB." },
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
        {
          success: false,
          error: "Unsupported file extension. Allowed profile formats: JPG, JPEG, PNG, WEBP.",
        },
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
        {
          success: false,
          error: magicCheck.error || "File signature does not match authentic image data.",
        },
        { status: 400 }
      );
    }

    // 5. Safe Storage Write
    const uploadDir = path.join(process.cwd(), "public", "uploads", "profiles");
    await mkdir(uploadDir, { recursive: true });

    const timestamp = Date.now();
    const cleanExt = path.extname(safeName) || ".webp";
    const fileName = `avatar_${timestamp}_${Math.random().toString(36).substring(2, 8)}${cleanExt}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/profiles/${fileName}`;
    const updatedAt = new Date().toISOString();

    // 6. Persist to customer record in store
    await store.updateCustomer(customerId, {
      profileImageUrl: publicUrl,
      profileImageUpdatedAt: updatedAt,
    });

    logSecurityEvent({
      event: "IMAGE_UPLOADED_SUCCESS",
      level: "INFO",
      details: { customerId, fileName, size: file.size },
    });

    return NextResponse.json({
      success: true,
      profileImageUrl: publicUrl,
      profileImageUpdatedAt: updatedAt,
      fileName,
    });
  } catch (error: any) {
    console.error("Profile image upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process profile image upload" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const rl = checkRateLimit(req, "userApi");
  if (!rl.success) return createRateLimitResponse(rl);

  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId") || "usr_customer_default";

    const updatedAt = new Date().toISOString();
    await store.updateCustomer(customerId, {
      profileImageUrl: "",
      profileImageUpdatedAt: updatedAt,
    });

    return NextResponse.json({
      success: true,
      message: "Profile image removed successfully.",
      profileImageUrl: null,
      profileImageUpdatedAt: updatedAt,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to remove profile image." },
      { status: 500 }
    );
  }
}
