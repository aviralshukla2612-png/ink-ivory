import { store } from "@/lib/store";
import { AdminActor } from "./rbac";
import { logSecurityEvent, sanitizeLogData } from "./logger";
import { NextRequest } from "next/server";
import { getClientIp } from "./rate-limit-keys";

export interface AdminAuditParams {
  actor: AdminActor;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  request?: NextRequest;
}

/**
 * You Are Mine — Centralized Admin Audit Logging Service
 * Records immutable audit entries for administrative mutations and security actions.
 */
export async function logAdminAudit({
  actor,
  action,
  resourceType,
  resourceId,
  metadata = {},
  request,
}: AdminAuditParams) {
  const ip = request ? getClientIp(request) : "internal";
  const sanitizedMeta = sanitizeLogData(metadata);

  // 1. Emit structured security log event
  logSecurityEvent({
    event: `ADMIN_${action.toUpperCase()}`,
    level: "INFO",
    userId: actor.userId,
    ip,
    resourceId,
    details: {
      role: actor.role,
      email: actor.email,
      resourceType,
      ...sanitizedMeta,
    },
  });

  // 2. Persist to store audit log table
  try {
    return await store.logAudit({
      userId: actor.userId,
      action: `ADMIN_${action.toUpperCase()}`,
      entityType: resourceType,
      entityId: resourceId,
      metadata: {
        actorRole: actor.role,
        actorEmail: actor.email,
        ip,
        ...sanitizedMeta,
      },
    });
  } catch (err) {
    console.error("[AUDIT_LOG_ERROR] Failed to persist audit record:", err);
    return null;
  }
}
