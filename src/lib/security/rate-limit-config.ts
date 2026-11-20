/**
 * You Are Mine — Centralized Rate Limiting Policy
 *
 * Defines sliding window limits, burst allowances, and target rules across all platform routes.
 */

export interface RateLimitRule {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
  /** Custom error message when limit is exceeded */
  message?: string;
  /** Category identifier */
  category: string;
}

export const RATE_LIMIT_CONFIG: Record<string, RateLimitRule> = {
  // Authentication & Admin
  adminAuth: {
    limit: 5,
    windowMs: 15 * 60 * 1000, // 5 requests / 15 min
    message: "Too many administrative attempts. Access temporarily restricted.",
    category: "admin_auth",
  },
  adminApi: {
    limit: 30,
    windowMs: 60 * 1000, // 30 requests / 1 min
    message: "Administrative request threshold exceeded.",
    category: "admin_api",
  },

  // Payment Security
  createOrder: {
    limit: 5,
    windowMs: 10 * 60 * 1000, // 5 requests / 10 min
    message: "Payment order creation rate limit reached. Please wait before creating another order.",
    category: "payment_order",
  },
  verifyPayment: {
    limit: 10,
    windowMs: 10 * 60 * 1000, // 10 verification requests / 10 min
    message: "Payment verification limit reached. If you were charged, please contact support.",
    category: "payment_verify",
  },
  paymentWebhook: {
    limit: 100,
    windowMs: 60 * 1000, // 100 webhooks / 1 min
    message: "Webhook ingestion rate exceeded.",
    category: "payment_webhook",
  },

  // Media & Uploads
  mediaUpload: {
    limit: 10,
    windowMs: 60 * 1000, // 10 uploads / 1 min
    message: "Upload rate limit exceeded. Please wait a minute before uploading more files.",
    category: "media_upload",
  },

  // Draft Management & Autosave
  draftAutosave: {
    limit: 30,
    windowMs: 60 * 1000, // 30 saves / 1 min
    message: "Autosave frequency limit reached. Changes will sync in a few seconds.",
    category: "draft_autosave",
  },
  draftOperations: {
    limit: 60,
    windowMs: 60 * 1000, // 60 requests / 1 min
    message: "Draft operation rate limit reached.",
    category: "draft_ops",
  },

  // Public Invitations & Guest Access
  publicInvitation: {
    limit: 300,
    windowMs: 60 * 1000, // 300 requests / 1 min (high allowance for guest viral viewing)
    message: "Traffic is exceptionally high. Please refresh in a few moments.",
    category: "public_invitation",
  },

  // General API Global Fallback
  generalApi: {
    limit: 100,
    windowMs: 60 * 1000, // 100 requests / 1 min
    message: "Too many requests. Please slow down and try again.",
    category: "general_api",
  },
};
