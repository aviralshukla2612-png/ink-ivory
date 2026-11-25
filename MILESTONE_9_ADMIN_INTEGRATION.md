# MILESTONE 9 — CENTRALIZED ADMIN INTEGRATION

**Document Version:** 1.0.0  
**Status:** Certified & Active  
**Milestone:** 9 (Feature Expansion — Zero Regression)  
**System Architecture:** Unified Executive Admin Portal (`/admin`)

---

## 1. Single Source of Truth

As mandated by platform security and governance policies, there is strictly **one centralized admin panel** hosted at `/admin`. No secondary admin panel or mobile administrative portal exists.

---

## 2. Admin Capabilities in Milestone 9

1. **Template Catalog Governance (`/admin/templates`):**
   - View, create, update, and manage all 8 production templates.
   - Configure category tags, base pricing (₹299 / Paise 29900), and active/inactive status.
   - Inspect and modify `supportedSections` (`opening`, `hero`, `story`, `events`, `memories`, `music`, `rsvp`).
   - Preview templates directly in desktop and mobile viewport simulators.
2. **Order & Publication Auditing (`/admin/orders`, `/admin/publications`):**
   - Real-time audit logs for all payments processed across Web and Mobile.
   - Snapshot inspection to verify immutable data integrity for published invitations.
3. **Audio & Media Asset Management (`/admin/music`):**
   - Manage the 116+ curated wedding soundtrack library, category assignments, and preview playback.
4. **Security & Session Governance:**
   - RBAC enforcement (`SUPER_ADMIN`, `ADMIN`, `SUPPORT_AGENT`).
   - Audit event logging for all administrative template modifications.
