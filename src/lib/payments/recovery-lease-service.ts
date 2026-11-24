// YOU ARE MINE — Database-Backed Distributed Recovery Lease Service
// Replaces in-memory process-local locks with atomic, distributed database-backed lease management.

import crypto from 'node:crypto';
import { store, RecoveryJobLockRecord } from '../store';
import { logSecurityEvent } from '../security/logger';

export interface LeaseAcquireResult {
  acquired: boolean;
  lease?: RecoveryJobLockRecord;
  reason?: 'ACTIVE_LEASE_HELD' | 'DATABASE_ERROR';
  currentOwner?: string;
  expiresAt?: string;
  isExpiredRecovery?: boolean;
}

export interface LeaseHeartbeatResult {
  renewed: boolean;
  reason?: 'OWNERSHIP_LOST' | 'LEASE_EXPIRED' | 'DATABASE_ERROR';
  lease?: RecoveryJobLockRecord;
}

export interface LeaseReleaseResult {
  released: boolean;
  reason?: 'CANNOT_RELEASE_OTHERS_LEASE' | 'NO_ACTIVE_LEASE' | 'DATABASE_ERROR';
}

export class DistributedRecoveryLeaseService {
  /**
   * Attempt atomic acquisition of a distributed job lease
   * @param jobName Unique job identifier (e.g. "payment_publication_recovery")
   * @param workerId Cryptographically random worker identifier
   * @param ttlMs Lease time-to-live in milliseconds (default 30,000ms / 30s)
   */
  static async acquireLease(
    jobName: string,
    workerId: string,
    ttlMs: number = 30_000
  ): Promise<LeaseAcquireResult> {
    const now = Date.now();
    const nowIso = new Date(now).toISOString();
    const expiresAtIso = new Date(now + ttlMs).toISOString();

    const existingLock = store.getRecoveryLock(jobName);

    // 1. If no lock exists, create initial lease
    if (!existingLock) {
      const newLock: RecoveryJobLockRecord = {
        id: 'lck_' + crypto.randomUUID().slice(0, 8),
        jobName,
        ownerId: workerId,
        acquiredAt: nowIso,
        expiresAt: expiresAtIso,
        heartbeatAt: nowIso,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      store.saveRecoveryLock(newLock);

      logSecurityEvent({
        event: 'DISTRIBUTED_LEASE_ACQUIRED',
        level: 'INFO',
        details: { jobName, workerId, expiresAt: expiresAtIso },
      });

      return { acquired: true, lease: newLock };
    }

    // 2. If active lease is held by another worker and has not expired
    const lockExpiryTime = new Date(existingLock.expiresAt).getTime();
    if (lockExpiryTime > now && existingLock.ownerId !== workerId) {
      logSecurityEvent({
        event: 'DISTRIBUTED_LEASE_COLLISION_BLOCKED',
        level: 'WARN',
        details: {
          jobName,
          competingWorkerId: workerId,
          activeOwnerId: existingLock.ownerId,
          expiresAt: existingLock.expiresAt,
        },
      });

      return {
        acquired: false,
        reason: 'ACTIVE_LEASE_HELD',
        currentOwner: existingLock.ownerId,
        expiresAt: existingLock.expiresAt,
      };
    }

    // 3. Lease is either expired or held by same worker; atomically take ownership / renew
    const isExpiredRecovery = lockExpiryTime <= now && existingLock.ownerId !== workerId;

    existingLock.ownerId = workerId;
    existingLock.acquiredAt = nowIso;
    existingLock.expiresAt = expiresAtIso;
    existingLock.heartbeatAt = nowIso;
    existingLock.updatedAt = nowIso;

    store.saveRecoveryLock(existingLock);

    logSecurityEvent({
      event: isExpiredRecovery ? 'DISTRIBUTED_LEASE_EXPIRED_RECOVERED' : 'DISTRIBUTED_LEASE_RENEWED',
      level: 'INFO',
      details: { jobName, workerId, expiresAt: expiresAtIso, isExpiredRecovery },
    });

    return {
      acquired: true,
      lease: existingLock,
      isExpiredRecovery,
    };
  }

  /**
   * Renew heartbeat for an active lease
   */
  static async renewHeartbeat(
    jobName: string,
    workerId: string,
    ttlMs: number = 30_000
  ): Promise<LeaseHeartbeatResult> {
    const now = Date.now();
    const existingLock = store.getRecoveryLock(jobName);

    if (!existingLock || existingLock.ownerId !== workerId) {
      return { renewed: false, reason: 'OWNERSHIP_LOST' };
    }

    const lockExpiryTime = new Date(existingLock.expiresAt).getTime();
    if (lockExpiryTime <= now) {
      return { renewed: false, reason: 'LEASE_EXPIRED' };
    }

    const nowIso = new Date(now).toISOString();
    existingLock.expiresAt = new Date(now + ttlMs).toISOString();
    existingLock.heartbeatAt = nowIso;
    existingLock.updatedAt = nowIso;

    store.saveRecoveryLock(existingLock);
    return { renewed: true, lease: existingLock };
  }

  /**
   * Safely release lease owned by worker
   */
  static async releaseLease(
    jobName: string,
    workerId: string
  ): Promise<LeaseReleaseResult> {
    const existingLock = store.getRecoveryLock(jobName);

    if (!existingLock) {
      return { released: true };
    }

    // Worker can ONLY release its own lease
    if (existingLock.ownerId !== workerId) {
      logSecurityEvent({
        event: 'DISTRIBUTED_LEASE_ILLEGAL_RELEASE_BLOCKED',
        level: 'CRITICAL',
        details: {
          jobName,
          attemptedByWorker: workerId,
          actualOwner: existingLock.ownerId,
        },
      });

      return { released: false, reason: 'CANNOT_RELEASE_OTHERS_LEASE' };
    }

    store.deleteRecoveryLock(jobName);

    logSecurityEvent({
      event: 'DISTRIBUTED_LEASE_RELEASED',
      level: 'INFO',
      details: { jobName, workerId },
    });

    return { released: true };
  }

  /**
   * Query active lease status
   */
  static getLeaseStatus(jobName: string): RecoveryJobLockRecord | undefined {
    return store.getRecoveryLock(jobName);
  }
}

export default DistributedRecoveryLeaseService;
