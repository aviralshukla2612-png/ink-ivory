/**
 * You Are Mine — Environment Security & Secrets Validator
 *
 * Checks required environment variables on startup and warns against insecure defaults.
 */

export interface EnvValidationReport {
  isProduction: boolean;
  hasDatabaseUrl: boolean;
  hasRazorpayKeys: boolean;
  isRazorpayTestMode: boolean;
  hasAdminSecret: boolean;
  warnings: string[];
}

export function validateEnvironment(): EnvValidationReport {
  const isProduction = process.env.NODE_ENV === "production";
  const warnings: string[] = [];

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl && isProduction) {
    warnings.push("DATABASE_URL is not set. Using JSON fallback store in production is not recommended.");
  }

  const rzpKey = process.env.RAZORPAY_KEY_ID;
  const rzpSecret = process.env.RAZORPAY_KEY_SECRET;
  const isRazorpayTestMode = !rzpKey || rzpKey.includes("test_inkivory") || rzpKey.startsWith("rzp_test_");

  if (isProduction && isRazorpayTestMode) {
    warnings.push("CRITICAL: Production deployment is running with test/mock Razorpay credentials!");
  }

  const adminSecret = process.env.ADMIN_SECRET_KEY;
  if (!adminSecret) {
    warnings.push("ADMIN_SECRET_KEY is not defined. Admin access must be secured with an explicit secret.");
  }

  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret && isProduction) {
    warnings.push("SESSION_SECRET is not configured. Falling back to default HMAC key in production is insecure.");
  }

  return {
    isProduction,
    hasDatabaseUrl: !!dbUrl,
    hasRazorpayKeys: !!(rzpKey && rzpSecret),
    isRazorpayTestMode,
    hasAdminSecret: !!adminSecret,
    warnings,
  };
}
