# INK & IVORY — ADMIN SECURITY GAP ANALYSIS

**Document:** Administrative Security Architecture & RBAC Threat Model  
**Date:** November 20, 2026  
**Auditor:** Principal Application Security Engineer  

---

## 1. ADMINISTRATIVE THREAT MODEL & SECURITY BOUNDARIES

The expansion from a single-screen admin key gate to a full enterprise administration panel introduces new threat surfaces that must be defended without weakening existing Stage 4 protections.

```
[ Unauthenticated Internet ]
           │
           ├─── (1) Brute-Force Defense: Rate-limited login (adminAuth: 5 req / 15m)
           ▼
[ /api/admin/login ] ──► Constant-time credential verification
           │
           ├─── (2) Token Theft Defense: HttpOnly, SameSite=Strict, Secure Cookie
           ▼
[ Browser Session Cookie ]
           │
           ├─── (3) CSRF Defense: verifyCsrfOrigin() checks Origin/Host on every mutation
           ▼
[ Admin API Gate ]
           │
           ├─── (4) Privilege Escalation Defense: Server-side RBAC requirePermission()
           ▼
[ Sensitive Operations: Financials, Templates, Suspensions, Staff ]
```

---

## 2. SECURITY GAPS & MANDATORY CONTROLS

| Security Domain | Current Stage 4 Status | Admin Panel Risk | Required Control |
| :--- | :--- | :--- | :--- |
| **Role-Based Access** | Single master key unlocks all admin endpoints. | Staff with Content Manager duties could view financial reports or issue refunds. | Enforce server-side `requirePermission()` on every individual API route based on authenticated role. |
| **Admin Secret Storage** | `sessionStorage` purged; HttpOnly cookies active. | Master secret transmission in headers could re-occur in new forms. | Ban client-side secret transmission; use server session cookies exclusively. |
| **CSRF Defense** | `verifyCsrfOrigin()` active on `/api/admin`. | New mutation routes (`/api/admin/templates`, `/api/admin/staff`, `/api/admin/publications`) could miss CSRF check. | Apply `verifyCsrfOrigin()` across all state-changing admin routes. |
| **Template Script Injection** | N/A (Static templates). | Admin could attempt to upload executable React/JS or malicious HTML into template configs. | Implement strict Renderer Registry. Only approved renderer identifiers can be registered; template configurations must be pure JSON schemas. |
| **Media Library Exposure** | Public audio verified via magic bytes; Cloudinary signed direct upload. | Staff could download or expose unpublished private customer photographs. | Restrict customer media visibility to authorized support staff with audit logging. |
| **Audit Immutability** | Basic append-only audit log. | Admin could attempt to delete or alter audit history to conceal unauthorized price modifications. | Make audit logs strictly read-only; omit delete/update endpoints from the audit log API. |
