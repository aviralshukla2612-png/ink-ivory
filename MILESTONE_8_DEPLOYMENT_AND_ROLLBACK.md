# MILESTONE 8 — PRODUCTION DEPLOYMENT & ROLLBACK RUNBOOK
## YOU ARE MINE Platform

**Target Environment:** Production (`https://youaremine.online`)  
**Architecture:** Next.js 15 App Router + Prisma ORM + PostgreSQL + Upstash Redis  
**Document Classification:** Mission-Critical Operations Runbook  
**Last Updated:** 2026-11-24

---

## 1. Pre-Deployment Verification Checklist

Before initiating any deployment to production, the Release Engineer must verify:
- [ ] Working tree is clean with all code committed to branch `main`.
- [ ] TypeScript compilation passes with zero errors (`npx tsc --noEmit`).
- [ ] All test suites pass:
  - Mobile Milestone 6 regression (`node you-are-mine-mobile/test-milestone6.js`)
  - Mobile Milestone 7D checkout (`node you-are-mine-mobile/test-milestone7d.js`)
  - Backend Checkpoint 7B (`npx tsx tests/test-checkpoint7b.ts`)
  - Backend Checkpoint 7C (`npx tsx tests/test-checkpoint7c.ts`)
  - Backend Checkpoint 7D (`npx tsx tests/test-checkpoint7d.ts`)
  - Concurrency & Recovery Lease (`npx tsx tests/test-recovery-lease.ts`)
  - Milestone 7E E2E Certification (`npx tsx tests/e2e/milestone7e/e2e-certification.ts`)
- [ ] Production environment secrets are configured in host environment manager (Vercel / Cloud Console).
- [ ] `ALLOW_DEV_PAYMENT_MOCK` is set to `false`.
- [ ] `ALLOW_UNTRUSTED_FORWARDED_IP` is set to `false`.
- [ ] Database backup snapshot has been created.

---

## 2. Zero-Downtime Database Migration Protocol

When Prisma schema changes are deployed (such as the new `RecoveryJobLock` table):

```bash
# Step 1: In staging or dry-run, generate migration SQL
npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-datasource prisma/schema.prisma --script

# Step 2: In production pipeline, apply migrations non-destructively
npx prisma migrate deploy

# Step 3: Verify schema synchronization
npx prisma db pull --print
```

### Safety Rules:
1. **Never run `npx prisma db push --force-reset` in production.**
2. All column additions must be nullable or have safe server-side defaults.
3. Renaming columns requires a multi-step expansion and contraction phase: add new column -> dual-write -> backfill -> remove old column.

---

## 3. Production Deployment Procedure (Vercel / Node Host)

### Deployment Commands:

```bash
# Build the production Next.js application
npm run build

# Deploy via Vercel CLI (or automatic Git push to production branch)
vercel --prod
```

### Immediate Post-Deployment Health Check:

```bash
# 1. Probe Public Health Endpoint
curl -fsSL https://youaremine.online/api/health

# Expected response:
# {"status":"ok","timestamp":"...","uptime":...,"database":"healthy"}

# 2. Probe Distributed Recovery Lease Endpoint (with Auth)
curl -fsSL -H "Authorization: Bearer <CRON_SECRET>" https://youaremine.online/api/payments/recovery

# Expected response:
# {"success":true,"orphanedFound":0,"recoveredCount":0,"failedCount":0}

# 3. Probe Public Invitation Renderer (Template 01)
curl -fsSL -I https://youaremine.online/p/demo-royal-wedding
# Expected HTTP 200 OK
```

---

## 4. Emergency Rollback Protocol

If any high-severity incident occurs post-deployment (e.g., payment verification failure, database connection pool exhaustion, or severe UI rendering regressions):

### Step 1: Immediate Traffic Rollback
- In Vercel Dashboard: Go to **Deployments** -> Locate previous certified deployment (`commit 798beff` or prior) -> Click **Instant Rollback**.
- Traffic shifts instantly (< 5 seconds) to the previous immutable deployment artifact.

### Step 2: Database State Assessment
- Since all schema migrations follow backward-compatible expansion rules, rolling back the application code does NOT require rolling back database columns.
- The `RecoveryJobLock` table remains harmless and inert if older code runs.

### Step 3: Incident Log Capture
- Export error logs from Sentry or Vercel Runtime Logs.
- Record incident in `MILESTONE_8_DEFECT_REGISTER.md`.

---

## 5. Automated Recovery Job Schedule Configuration

To ensure orphaned payments are automatically reconciled without manual administrator intervention, configure an external cron job (e.g., Vercel Cron, Cloudflare Cron Triggers, or AWS EventBridge):

- **Target URL:** `https://youaremine.online/api/payments/recovery`
- **HTTP Method:** `POST`
- **Schedule:** `*/15 * * * *` (Every 15 minutes)
- **Header:** `Authorization: Bearer <CRON_SECRET>`
- **Timeout:** 30 seconds
- **Retry Policy:** 1 retry with exponential backoff
