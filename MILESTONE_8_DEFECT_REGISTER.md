# MILESTONE 8 — DEFECT REGISTER
## YOU ARE MINE Production Audit & Defect Tracking

**Audit Date:** 2026-11-24  
**Audit Scope:** Milestones 1 through 8 Full Platform Scope  
**Status:** **ALL KNOWN DEFECTS RESOLVED OR CLASSIFIED AS NON-BLOCKING**

---

## 1. Defect Log & Remediation History

| Defect ID | Severity | Area | Symptom / Issue | Resolution | Status |
|---|---|---|---|---|---|
| **DEF-801** | High | Backend Recovery | In-memory `let isRecoveryRunning` was instance-local; multi-container deployment could race on recovery job | Replaced with database model `RecoveryJobLock` and distributed lease with 30s TTL | **RESOLVED** |
| **DEF-802** | Medium | API Security | Recovery endpoint timing attack vulnerability on cron secret string comparison | Implemented constant-time comparison via `crypto.timingSafeEqual` | **RESOLVED** |
| **DEF-803** | Medium | Mobile Compliance | Mobile profile tab lacked privacy policy, terms, refund policy, and data deletion links required for Google Play & Apple review | Implemented full compliance card with external browser links and deletion mailto | **RESOLVED** |
| **DEF-804** | Low | Mobile Packaging | Missing `versionCode` and `buildNumber` in `app.json` for EAS build versioning | Added `versionCode: 1` and `buildNumber: "1"` to `app.json` | **RESOLVED** |
| **DEF-805** | Low | Observability | Absence of dedicated synthetic probe endpoint for uptime monitoring | Created `/api/health` checking database latency, uptime, and memory consumption | **RESOLVED** |
| **DEF-806** | Low | Configuration | Duplicated DLT SMS gateway headers and exposed sample secret in `.env.example` | Sanitized and segmented `.env.example` into 10 structured sections | **RESOLVED** |

---

## 2. Accepted Architectural Boundaries (Non-Defects)

1. **StoreKit & Play Store Live Credentials:** Classified as *Integration-Ready* rather than *Production-Certified* until live merchant accounts and physical test accounts complete real sandbox purchases on hardware.
2. **Dual Data-Store Capability:** System automatically utilizes PostgreSQL via Prisma ORM when `DATABASE_URL` is configured, while retaining zero-dependency local JSON file store fallback for development and isolated testing.
