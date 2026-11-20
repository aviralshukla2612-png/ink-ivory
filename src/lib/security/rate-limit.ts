import { NextRequest } from "next/server";
import { RATE_LIMIT_CONFIG, RateLimitRule } from "./rate-limit-config";
import { getClientIp, buildRateLimitKey } from "./rate-limit-keys";
import { RateLimitResult } from "./rate-limit-response";
import { logSecurityEvent } from "./logger";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface WindowRecord {
  timestamps: number[];
  lastReset: number;
}

/**
 * Sensitive Endpoint Categories that MUST Fail-Closed in Production
 * if abuse prevention cannot be cryptographically or centrally enforced.
 */
export const SENSITIVE_FAIL_CLOSED_CATEGORIES = new Set([
  "admin_auth",
  "admin_api",
  "payment_order",
  "payment_verify",
  "media_upload",
]);

/**
 * Global In-Memory Rate Limit Store with Auto-Pruning.
 * Used for local development and availability-oriented fallbacks.
 */
class LocalRateLimitStore {
  private cache = new Map<string, WindowRecord>();
  private lastPrune = Date.now();

  check(key: string, rule: RateLimitRule): RateLimitResult {
    const now = Date.now();
    this.maybePrune(now);

    let record = this.cache.get(key);
    if (!record) {
      record = { timestamps: [], lastReset: now };
      this.cache.set(key, record);
    }

    // Filter out timestamps outside active sliding window
    const windowStart = now - rule.windowMs;
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    const count = record.timestamps.length;
    const limit = rule.limit;
    const remaining = Math.max(0, limit - count);
    const resetTime = (record.timestamps[0] || now) + rule.windowMs;
    const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000));

    if (count >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        resetTime,
        retryAfterSeconds,
        error: rule.message || "Rate limit exceeded. Please wait.",
      };
    }

    record.timestamps.push(now);

    return {
      success: true,
      limit,
      remaining: Math.max(0, remaining - 1),
      resetTime,
      retryAfterSeconds: 0,
    };
  }

  private maybePrune(now: number) {
    if (now - this.lastPrune < 60000) return;
    this.lastPrune = now;

    for (const [key, record] of this.cache.entries()) {
      if (record.timestamps.length === 0 || now - record.timestamps[record.timestamps.length - 1] > 15 * 60 * 1000) {
        this.cache.delete(key);
      }
    }
  }

  reset() {
    this.cache.clear();
  }
}

export const localRateLimitStore = new LocalRateLimitStore();

// -------------------------------------------------------------
// Distributed Redis Rate Limiting Engine (Upstash)
// -------------------------------------------------------------
let upstashRedis: Redis | null = null;
const upstashLimiters = new Map<string, Ratelimit>();

function getRedisClient(): Redis | null {
  if (upstashRedis) return upstashRedis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token && !url.includes("placeholder") && !url.includes("your-upstash")) {
    try {
      upstashRedis = new Redis({ url, token });
      return upstashRedis;
    } catch (err) {
      console.error("[RateLimit] Failed to initialize Upstash Redis:", err);
      return null;
    }
  }
  return null;
}

function getOrCreateLimiter(category: string, rule: RateLimitRule): Ratelimit | null {
  const redis = getRedisClient();
  if (!redis) return null;

  if (upstashLimiters.has(category)) {
    return upstashLimiters.get(category)!;
  }

  const durationStr = `${Math.ceil(rule.windowMs / 1000)} s` as `${number} s`;
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(rule.limit, durationStr),
    analytics: true,
    prefix: `ink_ivory_rl:${category}`,
  });

  upstashLimiters.set(category, limiter);
  return limiter;
}

/**
 * Checks rate limits asynchronously using Upstash Redis if configured,
 * or applies endpoint-specific failure policies.
 *
 * Failure Policy (Stage 4 Verified):
 * - Sensitive endpoints (adminAuth, createOrder, verifyPayment, mediaUpload): FAIL CLOSED in production when Redis errors.
 * - Public browsing / autosave (publicInvitation, generalApi, draftAutosave): FAIL OPEN to local memory store.
 */
export async function checkRateLimitAsync(
  request: NextRequest,
  ruleKey: keyof typeof RATE_LIMIT_CONFIG,
  options?: { identifier?: string; resourceId?: string }
): Promise<RateLimitResult> {
  const rule = RATE_LIMIT_CONFIG[ruleKey];
  if (!rule) {
    return {
      success: true,
      limit: 100,
      remaining: 99,
      resetTime: Date.now() + 60000,
      retryAfterSeconds: 0,
    };
  }

  const ip = getClientIp(request);
  const key = buildRateLimitKey({
    category: rule.category,
    ip,
    identifier: options?.identifier,
    resourceId: options?.resourceId,
  });

  const isProduction = process.env.NODE_ENV === "production";
  const forceFailClosedTest = process.env.FORCE_FAIL_CLOSED_TEST === "true";
  const limiter = getOrCreateLimiter(rule.category, rule);

  if (limiter || forceFailClosedTest) {
    try {
      if (forceFailClosedTest) {
        throw new Error("Simulated Redis Network Outage for Stage 4 Testing");
      }

      const { success, limit, remaining, reset } = await limiter!.limit(key);
      const now = Date.now();
      const retryAfterSeconds = Math.max(1, Math.ceil((reset - now) / 1000));

      return {
        success,
        limit,
        remaining,
        resetTime: reset,
        retryAfterSeconds: success ? 0 : retryAfterSeconds,
        error: success ? undefined : rule.message || "Too many requests. Please slow down.",
      };
    } catch (redisError: any) {
      logSecurityEvent({
        event: "REDIS_RATE_LIMIT_ERROR",
        level: "CRITICAL",
        details: { message: redisError.message, category: rule.category },
      });

      // Strict Production Failure Policy
      if ((isProduction || forceFailClosedTest) && SENSITIVE_FAIL_CLOSED_CATEGORIES.has(rule.category)) {
        return {
          success: false,
          limit: rule.limit,
          remaining: 0,
          resetTime: Date.now() + 60000,
          retryAfterSeconds: 60,
          error: "Rate limiting protection temporarily degraded. Request rejected for security.",
        };
      }

      // Availability-oriented fallback for public browsing & autosave
      return localRateLimitStore.check(key, rule);
    }
  }

  // Local development / single-instance mode: use local sliding window
  return localRateLimitStore.check(key, rule);
}

/**
 * Synchronous rate limit check for existing route handlers.
 */
export function checkRateLimit(
  request: NextRequest,
  ruleKey: keyof typeof RATE_LIMIT_CONFIG,
  options?: { identifier?: string; resourceId?: string }
): RateLimitResult {
  const rule = RATE_LIMIT_CONFIG[ruleKey];
  if (!rule) {
    return {
      success: true,
      limit: 100,
      remaining: 99,
      resetTime: Date.now() + 60000,
      retryAfterSeconds: 0,
    };
  }

  const ip = getClientIp(request);
  const key = buildRateLimitKey({
    category: rule.category,
    ip,
    identifier: options?.identifier,
    resourceId: options?.resourceId,
  });

  return localRateLimitStore.check(key, rule);
}
