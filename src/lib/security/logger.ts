/**
 * You Are Mine — Structured Security Logger & Audit System
 *
 * Implements centralized security logging with automated PII masking and credential redaction.
 */

export type SecurityLogLevel = "INFO" | "WARN" | "ERROR" | "CRITICAL";

export interface SecurityEvent {
  event: string;
  level: SecurityLogLevel;
  ip?: string;
  userId?: string;
  guestToken?: string;
  resourceId?: string;
  details?: Record<string, any>;
  timestamp?: string;
}

// Sensitive key patterns to automatically redact
const SENSITIVE_KEYS = [
  "password",
  "secret",
  "token",
  "key",
  "authorization",
  "cookie",
  "signature",
  "card",
  "cvv",
  "razorpay_signature",
  "razorpay_key_secret",
];

/**
 * Recursively deep-redacts sensitive keys and values from logging payloads.
 */
export function sanitizeLogData(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    // Redact Bearer tokens
    if (obj.toLowerCase().startsWith("bearer ")) return "Bearer [REDACTED]";
    // Redact long hex signatures
    if (obj.length > 40 && /^[a-f0-9]+$/i.test(obj)) return "[REDACTED_HASH]";
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeLogData);
  }

  if (typeof obj === "object") {
    const sanitized: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      const lower = key.toLowerCase();
      if (SENSITIVE_KEYS.some((s) => lower.includes(s))) {
        sanitized[key] = "[REDACTED]";
      } else {
        sanitized[key] = sanitizeLogData(val);
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Emits a structured security event.
 */
export function logSecurityEvent(event: SecurityEvent) {
  const payload = {
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
    details: sanitizeLogData(event.details || {}),
  };

  const output = `[SECURITY][${payload.level}][${payload.event}] ${JSON.stringify(payload)}`;

  switch (payload.level) {
    case "CRITICAL":
    case "ERROR":
      console.error(output);
      break;
    case "WARN":
      console.warn(output);
      break;
    default:
      console.log(output);
  }
}
