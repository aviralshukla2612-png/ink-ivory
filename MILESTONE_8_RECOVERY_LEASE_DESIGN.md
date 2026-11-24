# YOU ARE MINE — MILESTONE 8 RECOVERY LEASE DESIGN
## Database-Backed Distributed Concurrency Lease & Crash Resiliency Architecture

**Platform:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Module:** Phase 1 — Distributed Recovery Job Lease (`RecoveryJobLock`)  
**Date:** November 2026  
**Status:** Certified Database-Backed Architecture  

---

## 1. Problem Definition & Architectural Transition

In prior checkpoints, concurrent execution protection across recovery scans was managed via an in-memory boolean flag (`let isRecoveryRunning = false;`). 

### The Multi-Instance Vulnerability:
When deploying backend workloads across horizontal replicas, serverless functions (e.g. Vercel / AWS Lambda), or container clusters (Kubernetes / ECS), process memory is isolated per node:
- **Node A** triggers `/api/payments/recovery` via scheduled cron.
- **Node B** triggers `/api/payments/recovery` simultaneously or during Node A's batch.
- Because Node B cannot read Node A's in-memory memory space, both nodes scan and attempt publication recovery concurrently.
- While database `@unique` constraints on `Publication.orderId` and `draftId` prevent duplicate rows, dual worker execution creates lock contention, redundant external API calls, and wasted CPU cycles.

---

## 2. Distributed Lease Data Model (`Prisma`)

A persistent database model was added to `prisma/schema.prisma` and `src/lib/store.ts`:

```prisma
model RecoveryJobLock {
  id          String   @id @default(uuid())
  jobName     String   @unique // Global unique constraint: "payment_publication_recovery"
  ownerId     String   // Cryptographically random worker instance ID
  acquiredAt  DateTime @default(now())
  expiresAt   DateTime // Expiration boundary for auto-recovery from worker crash
  heartbeatAt DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([jobName])
  @@index([expiresAt])
}
```

### Key Properties:
- **`jobName` Unique Constraint:** The PostgreSQL database engine enforces that at most one lock record can exist for any given job identifier.
- **`ownerId` Worker Identity:** Every execution instance generates a random `rec_worker_<uuid>` identifier.
- **`expiresAt` Boundary:** Guarantees that if a worker container terminates mid-execution without releasing its lock, the lease naturally expires and becomes claimable by subsequent cron runs.

---

## 3. Atomic Lease Lifecycle & State Transitions

```
[ Worker Arrives: POST /api/payments/recovery ]
                     │
                     ▼
       Generate Random workerId
                     │
                     ▼
  DistributedRecoveryLeaseService.acquireLease(jobName, workerId, ttlMs)
                     │
         Does Lock Record Exist?
         ├── NO ──► Create Lock (expiresAt = now + ttlMs) ──► Lease Acquired!
         └── YES
              │
              ▼
         Is Date.now() < lock.expiresAt?
         ├── YES (Active) ──► Owner is workerId?
         │                     ├── YES ──► Renew Lease
         │                     └── NO  ──► RECOVERY_LEASE_BUSY (HTTP 429)
         └── NO  (Expired)──► Auto-Claim Expired Lease (isExpiredRecovery = true)
                                       │
                                       ▼
                       Execute Recovery Batch (Max 50 Orders)
                       (Optionally renew heartbeat via renewHeartbeat)
                                       │
                                       ▼
                       Release Lease in `finally` Block
                       DistributedRecoveryLeaseService.releaseLease(jobName, workerId)
                       (Enforces: Worker can ONLY release its own lock)
```

---

## 4. Concurrency & Crash Resiliency Guarantees

1. **Atomic Acquisition:** Conditional database update ensures only one worker wins in a simultaneous race.
2. **Crash Auto-Recovery:** If a worker crashes or encounters an Out-Of-Memory termination, the unrenewed lease expires within 30 seconds. The next cron trigger detects `expiresAt <= now` and safely claims ownership.
3. **Cross-Worker Release Isolation:** A worker cannot release another worker's lease. `releaseLease()` cross-checks `existingLock.ownerId === workerId`. Unauthorized attempts return `{ released: false, reason: 'CANNOT_RELEASE_OTHERS_LEASE' }` and emit a critical security alert.
4. **Heartbeat Extension for Large Batches:** For operations requiring extended scanning, workers periodically invoke `renewHeartbeat()` to advance `expiresAt` safely without dropping ownership.
