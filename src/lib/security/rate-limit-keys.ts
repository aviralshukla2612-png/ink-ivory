import { NextRequest } from "next/server";

export type TrustedProxyType = "cloudflare" | "vercel" | "reverse-proxy" | "none" | "auto";

/**
 * You Are Mine — Trusted Proxy & Client IP Extraction Engine
 *
 * Implements strict trusted-proxy boundaries:
 * - Prevents client IP spoofing via arbitrary X-Forwarded-For injection.
 * - Detects environment (Cloudflare, Vercel, Reverse Proxy, or Direct/Local).
 * - Enforces validation of IPv4 and IPv6 syntax.
 */
export function getClientIp(request: NextRequest): string {
  const configuredProxyType = (process.env.TRUSTED_PROXY_TYPE || "auto").toLowerCase() as TrustedProxyType;

  // 1. Cloudflare Mode: cf-connecting-ip is set by Cloudflare edge servers.
  // We only trust it if configured or auto-detected with cf-ray header presence.
  if (configuredProxyType === "cloudflare" || (configuredProxyType === "auto" && request.headers.has("cf-ray"))) {
    const cfIp = request.headers.get("cf-connecting-ip");
    if (cfIp && isValidIp(cfIp)) {
      return cfIp.trim();
    }
  }

  // 2. Vercel Mode: x-vercel-ip or x-real-ip is injected by Vercel edge.
  if (
    configuredProxyType === "vercel" ||
    (configuredProxyType === "auto" && (Boolean(process.env.VERCEL) || request.headers.has("x-vercel-id")))
  ) {
    const vercelIp = request.headers.get("x-vercel-ip") || request.headers.get("x-real-ip");
    if (vercelIp && isValidIp(vercelIp)) {
      return vercelIp.trim();
    }
  }

  // 3. Explicit Trusted Reverse Proxy Mode
  // Only trust X-Forwarded-For if an explicit proxy secret is verified OR if explicitly enabled via configuration
  if (configuredProxyType === "reverse-proxy") {
    const trustedSecret = process.env.TRUSTED_PROXY_SECRET;
    const incomingSecret = request.headers.get("x-proxy-secret");

    // If a shared secret is configured, require match before trusting forwarding headers
    if (!trustedSecret || incomingSecret === trustedSecret) {
      const xForwardedFor = request.headers.get("x-forwarded-for");
      if (xForwardedFor) {
        const ips = xForwardedFor.split(",").map((ip) => ip.trim());
        // In trusted reverse proxy, the client IP is the first entry
        if (ips[0] && isValidIp(ips[0])) {
          return ips[0];
        }
      }
    }
  }

  // 4. In development mode or test environments, check if explicit spoofing test flag is enabled
  if (process.env.NODE_ENV !== "production" && process.env.ALLOW_UNTRUSTED_FORWARDED_IP === "true") {
    const xForwardedFor = request.headers.get("x-forwarded-for");
    if (xForwardedFor) {
      const ips = xForwardedFor.split(",").map((ip) => ip.trim());
      if (ips[0] && isValidIp(ips[0])) return ips[0];
    }
  }

  // 5. Default Secure Stance:
  // Direct origin connections or untrusted clients supplying arbitrary headers
  // are NOT permitted to spoof remote IP addresses.
  // Default to localhost in development, or safe standardized placeholder in staging.
  return "127.0.0.1";
}

/**
 * Validates whether a string is a syntactically valid IPv4 or IPv6 address.
 */
export function isValidIp(ip: string): boolean {
  if (!ip || typeof ip !== "string") return false;
  const trimmed = ip.trim();

  // IPv4 regex (0.0.0.0 to 255.255.255.255)
  const ipv4Regex =
    /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  // Standard IPv6 check
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^::1$/;

  return ipv4Regex.test(trimmed) || ipv6Regex.test(trimmed) || trimmed === "localhost" || trimmed === "127.0.0.1";
}

/**
 * Standardized, collision-resistant rate-limit cache key generator.
 */
export function buildRateLimitKey(params: {
  category: string;
  ip: string;
  identifier?: string;
  resourceId?: string;
}): string {
  const parts = ["rl", params.category, params.ip];
  if (params.identifier) parts.push(params.identifier);
  if (params.resourceId) parts.push(params.resourceId);
  return parts.join(":");
}
