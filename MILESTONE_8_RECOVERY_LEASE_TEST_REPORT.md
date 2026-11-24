# YOU ARE MINE — MILESTONE 8 RECOVERY LEASE TEST REPORT
## Multi-Worker Concurrency, Race Condition & Crash Resiliency Test Results

**Platform:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Test Suite:** `tests/test-recovery-lease.ts`  
**Execution Environment:** Node.js v20+, TypeScript 5+, Store / PostgreSQL Data Model  
**Date:** November 2026  
**Pass Rate:** 15 / 15 Scenarios Passed (100%)  

---

## 1. Concurrency Test Execution Summary

| # | Test Scenario | Verified Behavior | Status |
| :---: | :--- | :--- | :---: |
| 1 & 2 | Simultaneous Acquisition Race | Two workers compete concurrently; exactly one wins, second blocked with `ACTIVE_LEASE_HELD` | **PASS** |
| 3 | Active Lease Blocking | Third worker attempting acquisition while lease is active is cleanly rejected | **PASS** |
| 4 | Expired Lease Acquisition | Worker 3 successfully claims a lease whose expiration timestamp has elapsed | **PASS** |
| 5 | Cross-Worker Release Protection | Worker 1 attempting to release Worker 3's lease is blocked with security alert | **PASS** |
| 6 | Heartbeat Lease Extension | Active owner renews heartbeat, advancing `expiresAt` safely | **PASS** |
| 7 | Expired Heartbeat Rejection | Attempting to send a heartbeat on an expired lease is rejected with `LEASE_EXPIRED` | **PASS** |
| 8 & 9 | Crash Simulation & Auto-Recovery | Worker 4 crashes without releasing; Worker 5 auto-claims lease after expiration | **PASS** |
| 10 | Duplicate Recovery Idempotency | Multiple recovery attempts on same paid order produce strictly 1 publication record | **PASS** |
| 11 | Competing Workers on Same Order | Two recovery workers concurrently reconciling same order resolve to identical publication | **PASS** |
| 12 | Database Failure During Acquisition | Acquisition gracefully handles missing inputs / constraint rejections | **PASS** |
| 13 | Database Failure During Release | Releasing non-existent lease handled idempotently without crashing worker | **PASS** |
| 14 | Long-Running Batch Renewal | Worker maintains ownership over long job via heartbeat and releases cleanly | **PASS** |
| 15 | Expiry Detection During Processing | Worker accurately detects when execution duration has exceeded lease TTL | **PASS** |

---

## 2. Test Execution Log Output

```text
=================================================================
   YOU ARE MINE — DISTRIBUTED RECOVERY LEASE TEST SUITE          
=================================================================

Test 1 & 2: Simultaneous Lease Acquisition Race...
  ✓ Atomic concurrency verified: worker_1 acquired lease; worker_2 blocked.
Test 3: Active Lease Blocks Third Worker...
  ✓ Active lease blocks subsequent worker attempts.
Test 4: Expired Lease Acquisition...
  ✓ Expired lease automatically claimed by worker 3.
Test 5: Cross-Worker Lease Release Protection...
  ✓ Cross-worker illegal release blocked: Worker A cannot release Worker B's lease.
Test 6: Heartbeat Lease Extension...
  ✓ Heartbeat successfully extended lease TTL.
Test 7: Expired Ownership Cannot Renew Heartbeat...
  ✓ Heartbeat on expired lease rejected.
Test 8 & 9: Worker Crash Simulation & Auto-Recovery...
  ✓ Crash recovery verified: Dead worker lease reclaimed automatically by new worker.
Test 10: Duplicate Recovery Idempotency Check...
  ✓ Duplicate recovery calls produce strictly 1 publication.
Test 11: Competing Recovery Workers on Same Order...
  ✓ Competing workers safely resolved to single atomic publication.
Test 12: Database Failure During Acquisition Handling...
  ✓ Database acquisition exceptions handled gracefully.
Test 13: Database Failure During Release Handling...
  ✓ Releasing non-existent lease handled idempotently without exception.
Test 14: Long-Running Batch with Heartbeat Renewal...
  ✓ Long-running batch maintained lease through heartbeat and released cleanly.
Test 15: Lease Expiry Detection During Processing...
  ✓ Worker accurately detects lease expiration during execution.

=================================================================
   TEST RESULTS: 15 / 15 SCENARIOS PASSED (100%)       
=================================================================
```
