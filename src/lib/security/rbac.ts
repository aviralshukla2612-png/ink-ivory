import { NextRequest } from "next/server";
import { getAdminSession, verifyCsrfOrigin } from "@/lib/auth";

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "FINANCE" | "CONTENT_MANAGER" | "SUPPORT";

export type AdminPermission =
  | "DASHBOARD_VIEW"
  | "ANALYTICS_VIEW"
  | "TEMPLATES_VIEW"
  | "TEMPLATES_MANAGE"
  | "TEMPLATES_PUBLISH"
  | "CATEGORIES_MANAGE"
  | "CUSTOMERS_VIEW"
  | "CUSTOMERS_MANAGE"
  | "CUSTOMERS_EXPORT"
  | "DRAFTS_VIEW"
  | "PUBLICATIONS_VIEW"
  | "PUBLICATIONS_MANAGE"
  | "FINANCIALS_VIEW"
  | "REFUNDS_MANAGE"
  | "COUPONS_MANAGE"
  | "MEDIA_MANAGE"
  | "SUPPORT_MANAGE"
  | "STAFF_MANAGE"
  | "AUDIT_LOGS_VIEW"
  | "SETTINGS_MANAGE";

/**
 * You Are Mine — Centralized Role-Based Access Control (RBAC) Matrix
 */
export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  SUPER_ADMIN: [
    "DASHBOARD_VIEW",
    "ANALYTICS_VIEW",
    "TEMPLATES_VIEW",
    "TEMPLATES_MANAGE",
    "TEMPLATES_PUBLISH",
    "CATEGORIES_MANAGE",
    "CUSTOMERS_VIEW",
    "CUSTOMERS_MANAGE",
    "CUSTOMERS_EXPORT",
    "DRAFTS_VIEW",
    "PUBLICATIONS_VIEW",
    "PUBLICATIONS_MANAGE",
    "FINANCIALS_VIEW",
    "REFUNDS_MANAGE",
    "COUPONS_MANAGE",
    "MEDIA_MANAGE",
    "SUPPORT_MANAGE",
    "STAFF_MANAGE",
    "AUDIT_LOGS_VIEW",
    "SETTINGS_MANAGE",
  ],
  ADMIN: [
    "DASHBOARD_VIEW",
    "ANALYTICS_VIEW",
    "TEMPLATES_VIEW",
    "TEMPLATES_MANAGE",
    "TEMPLATES_PUBLISH",
    "CATEGORIES_MANAGE",
    "CUSTOMERS_VIEW",
    "CUSTOMERS_MANAGE",
    "DRAFTS_VIEW",
    "PUBLICATIONS_VIEW",
    "PUBLICATIONS_MANAGE",
    "FINANCIALS_VIEW",
    "COUPONS_MANAGE",
    "MEDIA_MANAGE",
    "SUPPORT_MANAGE",
    "AUDIT_LOGS_VIEW",
  ],
  FINANCE: [
    "DASHBOARD_VIEW",
    "ANALYTICS_VIEW",
    "FINANCIALS_VIEW",
    "REFUNDS_MANAGE",
    "COUPONS_MANAGE",
    "AUDIT_LOGS_VIEW",
  ],
  CONTENT_MANAGER: [
    "DASHBOARD_VIEW",
    "TEMPLATES_VIEW",
    "TEMPLATES_MANAGE",
    "CATEGORIES_MANAGE",
    "MEDIA_MANAGE",
    "AUDIT_LOGS_VIEW",
  ],
  SUPPORT: [
    "DASHBOARD_VIEW",
    "CUSTOMERS_VIEW",
    "DRAFTS_VIEW",
    "PUBLICATIONS_VIEW",
    "SUPPORT_MANAGE",
    "AUDIT_LOGS_VIEW",
  ],
};

/**
 * Checks whether a given role holds a specific permission.
 */
export function hasPermission(role: AdminRole, permission: AdminPermission): boolean {
  const allowed = ROLE_PERMISSIONS[role];
  return Boolean(allowed && allowed.includes(permission));
}

export interface AdminActor {
  userId: string;
  role: AdminRole;
  email: string;
}

/**
 * Extracts the authenticated admin actor from the incoming request.
 */
export function getAdminActor(request: NextRequest): AdminActor | null {
  const session = getAdminSession(request);
  if (!session) return null;

  return {
    userId: session.userId || "usr_super_admin",
    role: (session.role as AdminRole) || "SUPER_ADMIN",
    email: session.email || "admin@inkandivory.com",
  };
}

/**
 * Server-side authorization guard enforcing permissions and CSRF defense.
 * Call this at the start of any protected admin API endpoint.
 */
export function requirePermission(
  request: NextRequest,
  permission: AdminPermission
): { authorized: boolean; actor?: AdminActor; error?: string; status: number } {
  const actor = getAdminActor(request);

  if (!actor) {
    return {
      authorized: false,
      error: "Authentication required. Valid administrative session required.",
      status: 401,
    };
  }

  // Enforce CSRF Origin check on state-changing methods
  if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    if (!verifyCsrfOrigin(request)) {
      return {
        authorized: false,
        error: "Cross-site request blocked (CSRF validation failed).",
        status: 403,
      };
    }
  }

  if (!hasPermission(actor.role, permission)) {
    return {
      authorized: false,
      actor,
      error: `Access Denied: Role '${actor.role}' lacks permission '${permission}'.`,
      status: 403,
    };
  }

  return {
    authorized: true,
    actor,
    status: 200,
  };
}
