import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { logSecurityEvent } from "./security/logger";

export const GUEST_COOKIE_NAME = "ink_ivory_guest_token";
export const ADMIN_COOKIE_NAME = "ink_ivory_admin_session";

const HMAC_SECRET = process.env.SESSION_SECRET || "ink_ivory_dev_fallback_hmac_secret_2026_salt";
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "ink_ivory_admin_key_replace_with_high_entropy_secret_2026";

/**
 * Creates an HMAC signature for a token to prevent client-side forgery.
 */
export function signToken(token: string): string {
  return crypto.createHmac("sha256", HMAC_SECRET).update(token).digest("hex").slice(0, 16);
}

/**
 * Validates a signed token format: <rawToken>.<sig>
 */
export function verifySignedToken(signedToken: string): string | null {
  const parts = signedToken.split(".");
  if (parts.length !== 2) return null;
  const [rawToken, sig] = parts;
  const expectedSig = signToken(rawToken);

  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expectedSig);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
      return rawToken;
    }
  } catch (e) {
    return null;
  }
  return null;
}

export interface AdminSessionData {
  sessionId: string;
  role: string;
  userId: string;
  email: string;
  expiresAt: number;
}

/**
 * Creates a secure, signed, time-bound admin session token:
 * Supports RBAC staff role and user identification.
 */
export function createAdminSessionToken(options?: {
  role?: string;
  userId?: string;
  email?: string;
  durationMs?: number;
}): { token: string; expiresAt: number; role: string; userId: string } {
  const durationMs = options?.durationMs || 2 * 60 * 60 * 1000;
  const sessionId = "adm_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const role = options?.role || "SUPER_ADMIN";
  const userId = options?.userId || "usr_super_admin";
  const expiresAt = Date.now() + durationMs;

  const payload = `${sessionId}.${role}.${userId}.${expiresAt}`;
  const sig = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex").slice(0, 32);

  return {
    token: `${payload}.${sig}`,
    expiresAt,
    role,
    userId,
  };
}

/**
 * Verifies an admin session token in constant time and returns decoded session data.
 */
export function verifyAdminSessionToken(sessionToken: string): AdminSessionData | null {
  if (!sessionToken || typeof sessionToken !== "string") return null;
  const parts = sessionToken.split(".");

  // 1. RBAC Format: sessionId.role.userId.expiresAt.sig
  if (parts.length === 5) {
    const [sessionId, role, userId, expiresAtStr, sig] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return null;

    const payload = `${sessionId}.${role}.${userId}.${expiresAtStr}`;
    const expectedSig = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex").slice(0, 32);

    try {
      const a = Buffer.from(sig);
      const b = Buffer.from(expectedSig);
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
        return {
          sessionId,
          role,
          userId,
          email: "admin@inkandivory.com",
          expiresAt,
        };
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  // 2. Compatibility Format: sessionId.expiresAt.sig
  if (parts.length === 3) {
    const [sessionId, expiresAtStr, sig] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return null;

    const payload = `${sessionId}.${expiresAtStr}`;
    const expectedSig = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex").slice(0, 32);

    try {
      const a = Buffer.from(sig);
      const b = Buffer.from(expectedSig);
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
        return {
          sessionId,
          role: "SUPER_ADMIN",
          userId: "usr_super_admin",
          email: "admin@inkandivory.com",
          expiresAt,
        };
      }
    } catch (e) {
      return null;
    }
  }

  return null;
}

/**
 * Retrieves the verified admin session from cookies or authorization headers.
 */
export function getAdminSession(request: NextRequest): AdminSessionData | null {
  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (sessionCookie) {
    const verified = verifyAdminSessionToken(sessionCookie);
    if (verified) return verified;
  }

  const headerKey =
    request.headers.get("x-admin-key") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (headerKey) {
    try {
      const a = Buffer.from(headerKey.trim());
      const b = Buffer.from(ADMIN_SECRET.trim());
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
        return {
          sessionId: "adm_master_header",
          role: "SUPER_ADMIN",
          userId: "usr_super_admin",
          email: "admin@inkandivory.com",
          expiresAt: Date.now() + 3600000,
        };
      }
    } catch (e) {
      // Fall through to failure
    }
  }

  return null;
}

/**
 * Extracts or generates a cryptographically signed guest token for anonymous customer draft ownership.
 */
export function getOrCreateGuestToken(request: NextRequest): { guestToken: string; isNew: boolean } {
  const existingCookie = request.cookies.get(GUEST_COOKIE_NAME)?.value;
  const headerToken = request.headers.get("x-guest-token");

  // Check signed cookie first
  if (existingCookie) {
    const verified = verifySignedToken(existingCookie);
    if (verified) {
      return { guestToken: verified, isNew: false };
    }
    // Also accept bare uuid in dev if it conforms to safe format
    if (/^gst_[a-zA-Z0-9_-]{16,64}$/.test(existingCookie)) {
      return { guestToken: existingCookie, isNew: false };
    }
  }

  // Check header if present
  if (headerToken) {
    const verified = verifySignedToken(headerToken);
    if (verified) {
      return { guestToken: verified, isNew: false };
    }
    if (/^gst_[a-zA-Z0-9_-]{16,64}$/.test(headerToken)) {
      return { guestToken: headerToken, isNew: false };
    }
  }

  // Generate new cryptographically secure token
  const rawToken = "gst_" + crypto.randomUUID().replace(/-/g, "");
  return { guestToken: rawToken, isNew: true };
}

/**
 * Sets signed guest token cookie on an outgoing response with security flags.
 */
export function setGuestTokenCookie(response: NextResponse, rawToken: string) {
  const signed = `${rawToken}.${signToken(rawToken)}`;
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set({
    name: GUEST_COOKIE_NAME,
    value: signed,
    path: "/",
    httpOnly: false, // Accessible for client-side state hydration
    secure: isProduction,
    maxAge: 365 * 24 * 60 * 60, // 1 year
    sameSite: "lax",
  });
}

/**
 * Verifies that the requester owns the target draft (IDOR Prevention).
 */
export function verifyOwnership(
  draft: { guestToken: string; userId?: string },
  clientGuestToken: string,
  userId?: string
): boolean {
  if (userId && draft.userId === userId) return true;
  if (draft.guestToken && draft.guestToken === clientGuestToken) return true;

  logSecurityEvent({
    event: "IDOR_ATTEMPT_BLOCKED",
    level: "WARN",
    guestToken: clientGuestToken,
    userId,
    details: {
      draftGuestToken: draft.guestToken ? "[MASKED]" : "none",
      draftUserId: draft.userId,
    },
  });

  return false;
}

/**
 * Verifies administrative authorization using:
 * 1. Cryptographically signed, unexpired admin session cookie (SEC-S2-003).
 * 2. Constant-time comparison against ADMIN_SECRET_KEY for CLI/API/Automated Testing.
 */
export function verifyAdminAccess(request: NextRequest): boolean {
  // 1. Check HttpOnly Admin Session Cookie (Browser Admin Console)
  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (sessionCookie && verifyAdminSessionToken(sessionCookie)) {
    return true;
  }

  // 2. Check API Headers (x-admin-key or Authorization Bearer)
  const headerKey =
    request.headers.get("x-admin-key") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (headerKey) {
    try {
      const a = Buffer.from(headerKey.trim());
      const b = Buffer.from(ADMIN_SECRET.trim());

      if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
        return true;
      }
    } catch (e) {
      // Fall through to failure
    }
  }

  logSecurityEvent({
    event: "ADMIN_ACCESS_FAILED",
    level: "WARN",
    details: { reason: "Missing or invalid administrative credentials supplied" },
  });

  return false;
}

/**
 * Validates request Origin and Referer headers against Host to prevent CSRF.
 */
export function verifyCsrfOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
    const referer = request.headers.get("referer");
    if (referer) {
      try {
        const url = new URL(referer);
        return url.host === host;
      } catch (e) {
        return false;
      }
    }
    return true; // Programmatic / CLI API call without browser Origin header
  }

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch (e) {
    return false;
  }
}

