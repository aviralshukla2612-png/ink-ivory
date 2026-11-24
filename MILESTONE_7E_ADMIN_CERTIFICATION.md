# YOU ARE MINE — MILESTONE 7E CENTRALIZED ADMIN CERTIFICATION
## Backoffice Operations, Financial Auditability, RBAC & Lifecycle Visibility

**Platform:** YOU ARE MINE — Digital Invitations for Life's Special Moments  
**Module:** Centralized Administration & Backoffice Operations  
**Date:** November 2026  
**Status:** Certified Admin Architecture  

---

## 1. Centralized Administrative Modules

All customer activity originating from the website, Android APK, Google Play, or iOS is consolidated in the centralized `/admin` portal:

```
/admin
├── /customers     # Customer profiles, guest tokens, verified phone identities, draft history
├── /templates     # Template catalog, pricing tiers, occasion categories, activation toggle
├── /drafts        # Customer drafts, version histories, ownership audit
├── /orders        # Payment orders, amounts, discounts, provider references, order status
├── /payments      # Payment transactions, capture IDs, signatures, refund actions
├── /publications  # Active publications, public slugs, immutable snapshots, suspension
└── /finance       # Revenue analytics, coupon performance, net income reconciliation
```

---

## 2. Module Verification Results

### 2.1 Customer & Identity Tracking
- **Verified Behavior:** Admin queries `store.data.users` and `store.data.guestIdentities`.
- **Guest-to-Verified Continuity:** When an unauthenticated guest customer enters their phone number to verify, their existing drafts and orders seamlessly link to the verified user profile without data duplication.
- **Privacy Protection:** Guest session tokens are hashed/redacted in administrative audit logs.

### 2.2 Financial & Order Integrity
- **Verified Behavior:** Every mobile and web checkout generates a corresponding `PaymentOrderRecord`.
- **Authoritative Reconciliation:** Order details display:
  - Base Amount: ₹299 (29,900 paise)
  - Applied Coupon: `YOUMINE50` (-₹50 / -5,000 paise)
  - Final Amount: ₹249 (24,900 paise)
  - Currency: `INR`
  - Provider: `razorpay` / `google_play` / `apple_iap`
  - Status: `PAID` / `ATTEMPTED` / `REFUNDED`

### 2.3 Publication Management & Snapshot Preservation
- **Verified Behavior:** Admin can view active publications, inspect canonical slugs, and test the live public URL.
- **Snapshot Integrity:** Even if an administrator edits a template in `/admin/templates`, existing active publications retain their original published snapshot data, guaranteeing zero disruption for active wedding celebrations.
- **Graceful Suspension:** If an invitation violates terms of service, an admin can toggle status to `SUSPENDED`, gracefully displaying a luxury notice to guests without deleting database records.

### 2.4 Server-Side Role-Based Access Control (RBAC)
- **Roles:** `SUPER_ADMIN`, `ADMIN`, `SUPPORT_STAFF`.
- **Server Enforcement:** Admin endpoints verify the authenticated admin session token server-side.
- **Audit Logging:** Sensitive actions (refunds, template price changes, publication suspensions) emit structured `AuditEvent` records with timestamp, operator IP, and action metadata.
