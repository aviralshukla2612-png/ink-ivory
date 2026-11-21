# YOU ARE MINE — Centralized Administration Manual
**Target Audience:** Executive Staff, Operations, Content Managers, Support Agents  
**Console Route:** `https://youaremine-online.com/admin`  
**Brand Identity:** YOU ARE MINE

---

## 1. Governance Overview

YOU ARE MINE utilizes **ONE centralized admin panel** managing both Web and Android app operations from a single dashboard.

### Core Modules (19 Total)
1. **Dashboard (`/admin`):** Live KPIs, Gross Merchandise Value, cross-platform conversion rates, template leaderboard.
2. **Templates Catalog (`/admin/templates`):** Manage live celebration templates, pricing tiers, and active statuses.
3. **Dynamic Section Builder (`/admin/builder`):** Live visual reordering of template sections with version snapshots and rollback.
4. **Categories (`/admin/categories`):** Occasion hierarchy (Wedding, Birthday, Anniversary, Valentine's, Proposal, Luxury).
5. **Customers (`/admin/customers`):** Unified guest and registered user records with complete order and draft history.
6. **Customer Drafts (`/admin/drafts`):** Real-time inspection of customer drafts with preview simulator.
7. **Live Publications (`/admin/publications`):** Active URLs, view counts, suspension controls, and instant reinstatement.
8. **Orders (`/admin/orders`):** Order lifecycle tracking from checkout attempt to paid status.
9. **Payments (`/admin/payments`):** Gateway transaction ledger, Razorpay IDs, captured payment amounts.
10. **Refunds (`/admin/refunds`):** Reversal audit trails, dispute management, and refund approvals.
11. **Coupons & Promos (`/admin/coupons`):** Percentage and fixed-amount promo code engine.
12. **Music Library (`/admin/music`):** 100+ celebration soundtracks, live waveform audio player, and custom track uploader.
13. **Media Library (`/admin/media`):** Aggregated visual assets, photo uploads, and asset purging.
14. **Notifications (`/admin/notifications`):** Push campaign broadcaster targeting Web, Android, or All users.
15. **Android App Management (`/admin/android`):** Mobile banners, version requirements, force-update alerts, announcements, and Google Play release notes.
16. **Support Inquiries (`/admin/support`):** Customer ticket management, priority queue, and staff reply threads.
17. **Staff & RBAC (`/admin/staff`):** Role administration (`SUPER_ADMIN`, `FINANCE`, `CONTENT_MANAGER`, `SUPPORT`).
18. **Platform Settings (`/admin/settings`):** Global brand name, concierge contact info, upload size limits.
19. **Audit Logs (`/admin/audit`):** Immutable, cryptographically signed activity stream tracking every administrative mutation.

---

## 2. Platform Scoping Filter

A multi-platform scope switch is docked in the upper header of the admin console:
- **All Platforms:** Blended metrics and aggregated customer activity.
- **Website:** Filters traffic, drafts, and orders originating from web browsers.
- **Android App:** Isolates metrics, device tokens, and revenue generated from Google Play Android installations.
