# MILESTONE 8 — PRODUCTION OBSERVABILITY & ALERTING
## YOU ARE MINE Production Monitoring Specification

**Document Version:** 1.0.0  
**Classification:** Site Reliability & Production Observability  
**Target Environment:** Production (`https://youaremine.online`)  
**Status:** **OPERATIONAL SPECIFICATION APPROVED**

---

## 1. Service Level Objectives (SLOs) & Error Budgets

| Service Aspect | Metric | Service Level Objective (SLO) | Measurement Window | Error Budget |
|---|---|---|---|---|
| **Public Invitation Web Pages** | HTTP 200 Availability | **99.9%** | Rolling 30 days | 43.2 minutes downtime / month |
| **Invitation Page Load Latency** | Time to First Byte (TTFB) | **< 300 ms** (p95) | Rolling 7 days | Max 5% of requests > 500ms |
| **Payment Verification Endpoint** | Successful Processing | **99.95%** | Rolling 30 days | < 0.05% unhandled 5xx errors |
| **Mobile Draft Autosave** | Save Acknowledgment | **< 500 ms** (p95) | Rolling 7 days | Max 1% failed saves |
| **Payment Recovery Job** | Reconciliation Delay | **< 30 minutes** from orphan | Continuous | 0 orphaned payments unresolved > 1 hr |

---

## 2. Health Monitoring & Synthetics

### Synthetic Probe Endpoint: `/api/health`
- **Schedule:** Probed every 60 seconds from distributed uptime monitoring (e.g., BetterStack, UptimeRobot, or Cloudflare Health Checks).
- **Checks Performed:**
  1. Next.js App Router HTTP response.
  2. Database / Prisma connection read latency.
  3. Memory consumption thresholds (`rssMb`, `heapUsedMb`).
- **Alert Trigger:** HTTP status != 200 for 2 consecutive probes (120 seconds).

---

## 3. High-Priority Alerting Rules & Escalation Matrix

| Alert Name | Condition | Severity | Action Required | Runbook / Escalation |
|---|---|---|---|---|
| `PaymentWebhookSignatureFailure` | > 3 invalid HMAC signatures within 15 minutes | **P1 (High)** | Investigate IP addresses for credential tampering or replay attacks. | Rotate `RAZORPAY_WEBHOOK_SECRET` if leak suspected. |
| `OrphanedPaidOrderSpike` | > 5 unactivated paid orders in a single recovery cycle | **P1 (High)** | Check database transaction locks and slug collision salting service. | Check `PublicationActivationService` logs. |
| `RecoveryJobLockExhaustion` | Recovery lock held continuously for > 2 consecutive cycles | **P2 (Medium)** | Check if worker node died abruptly or long-running query stalled. | Lease auto-expires after 30s TTL; check for worker starvation. |
| `DatabaseConnectionPoolExhaustion` | DB probe latency > 1500ms on `/api/health` | **P1 (High)** | Inspect PostgreSQL connection count and slow queries. | Scale connection pooler (PgBouncer) or upgrade RDS tier. |
| `CouponAbuseVelocityTrigger` | Same coupon attempted > 20 times in 1 minute from 1 IP | **P2 (Medium)** | Automatic IP rate limiting triggers 429 response. | Review IP blacklist in Upstash Redis. |

---

## 4. Error Tracking Architecture (Sentry)

- **Frontend & Mobile Client:**
  - Configured with `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN`.
  - Captures unhandled React Native boundary crashes and network timeouts.
  - Automatically scrubs PII (Customer passwords, full credit card numbers, CVVs).
- **Backend Route Handlers:**
  - Wraps payment callbacks, webhook verification, and publication snapshot generation in try/catch blocks with security event logging (`src/lib/security/logger.ts`).
