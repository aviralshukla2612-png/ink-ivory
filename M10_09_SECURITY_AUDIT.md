# M10-09: APPLICATION SECURITY & CRYPTOGRAPHIC AUDIT

**Project:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Milestone:** 10 — Comprehensive Product, Codebase & System-Wide Audit  
**Audit Timestamp:** 2026-11-25T11:07:22+05:30  
**Evaluator:** Application Security Engineer & Systems Architect  
**Audit Scope:** Threat Modeling, Authentication, Authorization, Web Security & Media Uploads  

---

## 1. Threat Model & Security Controls Inventory

| Threat / Vulnerability | Vector | Mitigation Architecture | Verification Status |
|---|---|---|---|
| **IDOR (Insecure Direct Object Reference)** | Guessing draft IDs to access other couples' photos | `guestToken` HMAC validation on all draft endpoints | **VERIFIED** (`test-checkpoint7b.ts` Test 4) |
| **Payment Price Tampering** | Manipulating client request amounts | Server recalculates quote from template catalog | **VERIFIED** (`test-checkpoint7b.ts` Test 5) |
| **Payment Signature Forgery** | Submitting fake Razorpay payment IDs | HMAC SHA256 cryptographic signature verification | **VERIFIED** (`test-checkpoint7b.ts` Test 7) |
| **Payment Replay Attack** | Resubmitting already captured payment ID | Idempotency guard and state transition locks | **VERIFIED** (`test-checkpoint7b.ts` Test 9) |
| **Malicious Media Upload** | Uploading shell or executable with `.jpg` | Magic byte file signature inspection (`validateImageMagicBytes`)| **VERIFIED** (`test-milestone9-1-regression.js`)|
| **Oversized Upload DoS** | Flooding disk with gigabyte files | Client pre-check + server 10MB limit enforcement | **VERIFIED** (`test-milestone9-1-regression.js`)|
| **Path Traversal Attack** | Submitting `../../etc/passwd` filenames | `sanitizeFileName` strips directory traversal paths | **VERIFIED** |
| **Clickjacking** | Embedding invitation checkout in malicious iframes | `X-Frame-Options: SAMEORIGIN` via `middleware.ts` | **VERIFIED** |
| **XSS & Injection** | Injecting scripts in invitation couple names | React DOM auto-escaping + Strict Content Security Policy | **VERIFIED** |
| **SQL Injection** | Injecting SQL syntax in draft/order queries | Parameterized queries enforced by Prisma ORM | **VERIFIED** |
| **Privilege Escalation** | Accessing `/admin` routes with customer token | Server-side RBAC middleware and cookie validation | **VERIFIED** (`test-checkpoint7c.ts`) |

---

## 2. Secrets & Environment Variable Inspection

The repository was scanned for hardcoded credentials, payment keys, and database passwords:
- **`DATABASE_URL`:** Injected via environment variable (`env("DATABASE_URL")`).
- **Razorpay Key & Secret:** Sourced via `process.env.RAZORPAY_KEY_ID` and `process.env.RAZORPAY_KEY_SECRET`. Fallbacks throw descriptive configuration errors without mock leakage.
- **Admin Master Tokens:** Sourced via environment variables; never logged or serialized to client JSON responses.
- **Result:** **Zero hardcoded credentials or production private keys exposed in source code.**
