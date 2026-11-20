import { NextResponse } from "next/server";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number; // Unix epoch ms
  retryAfterSeconds: number;
  error?: string;
}

/**
 * Creates a standard RFC 6585 HTTP 429 Too Many Requests response with appropriate headers.
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  const body = {
    success: false,
    code: "RATE_LIMIT_EXCEEDED",
    message: result.error || "Too many requests. Please try again later.",
    retryAfter: result.retryAfterSeconds,
  };

  const response = NextResponse.json(body, { status: 429 });

  response.headers.set("Retry-After", String(result.retryAfterSeconds));
  response.headers.set("X-RateLimit-Limit", String(result.limit));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetTime / 1000)));

  return response;
}

/**
 * Attaches rate limit tracking headers to an existing successful response.
 */
export function attachRateLimitHeaders(response: NextResponse, result: RateLimitResult): NextResponse {
  response.headers.set("X-RateLimit-Limit", String(result.limit));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetTime / 1000)));
  return response;
}
