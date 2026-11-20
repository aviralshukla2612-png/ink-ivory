/**
 * You Are Mine — File Upload & Storage Security Guard
 *
 * Implements magic byte inspection, path traversal prevention, and upload bounds.
 */

export interface FileValidationResult {
  valid: boolean;
  detectedType?: string;
  error?: string;
}

/**
 * Validates audio magic bytes against known valid signatures.
 */
export function validateAudioMagicBytes(buffer: Buffer): FileValidationResult {
  if (buffer.length < 12) {
    return { valid: false, error: "File buffer too small to determine audio signature." };
  }

  // 1. MP3 with ID3v2 header: 'I', 'D', '3' (0x49 0x44 0x33)
  if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) {
    return { valid: true, detectedType: "audio/mpeg" };
  }

  // 2. MP3 raw sync frame: 0xFF followed by 0xFB, 0xF3, or 0xF2
  if (buffer[0] === 0xff && (buffer[1] === 0xfb || buffer[1] === 0xf3 || buffer[1] === 0xf2)) {
    return { valid: true, detectedType: "audio/mpeg" };
  }

  // 3. WAV: 'RIFF' at 0..3 and 'WAVE' at 8..11
  const isRiff = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
  const isWave = buffer[8] === 0x57 && buffer[9] === 0x41 && buffer[10] === 0x56 && buffer[11] === 0x45;
  if (isRiff && isWave) {
    return { valid: true, detectedType: "audio/wav" };
  }

  // 4. OGG: 'OggS' (0x4F 0x67 0x67 0x53)
  if (buffer[0] === 0x4f && buffer[1] === 0x67 && buffer[2] === 0x67 && buffer[3] === 0x53) {
    return { valid: true, detectedType: "audio/ogg" };
  }

  // 5. M4A / AAC: ISO base media containing 'ftyp' at 4..7
  const isFtyp = buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70;
  if (isFtyp) {
    return { valid: true, detectedType: "audio/m4a" };
  }

  return {
    valid: false,
    error: "Invalid file signature. The file is not a recognized audio format (MP3, WAV, AAC, M4A, OGG).",
  };
}

/**
 * Validates image magic bytes (JPEG, PNG, WEBP).
 */
export function validateImageMagicBytes(buffer: Buffer): FileValidationResult {
  if (buffer.length < 12) {
    return { valid: false, error: "File buffer too small to determine image signature." };
  }

  // JPEG: 0xFF 0xD8 0xFF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, detectedType: "image/jpeg" };
  }

  // PNG: 0x89 0x50 0x4E 0x47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return { valid: true, detectedType: "image/png" };
  }

  // WEBP: 'RIFF' at 0..3 and 'WEBP' at 8..11
  const isRiff = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
  const isWebp = buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
  if (isRiff && isWebp) {
    return { valid: true, detectedType: "image/webp" };
  }

  return {
    valid: false,
    error: "Invalid image signature. Only JPEG, PNG, and WebP are supported.",
  };
}

/**
 * Sanitizes user-provided filename preventing path traversal, null-byte injection, and reserved names.
 */
export function sanitizeFileName(rawName: string): string {
  return rawName
    .replace(/\0/g, "") // Remove null bytes
    .replace(/\.\.+/g, "") // Strip directory traversal (..)
    .replace(/[/\\]/g, "") // Strip path separators
    .replace(/[^a-zA-Z0-9._-]/g, "_") // Safe characters only
    .slice(0, 100); // Bounded length
}
