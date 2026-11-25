# MILESTONE 9 — PHOTO GALLERY ARCHITECTURE & MEDIA LIFECYCLE

**Document Version:** 1.0.0  
**Status:** Certified & Active  
**Milestone:** 9 (Feature Expansion — Zero Regression)  
**System Architecture:** Zero-Blob PostgreSQL, Secure Direct Uploads & Resilient Media CDN

---

## 1. Executive Summary & Media Storage Rules

High-resolution photography is central to bespoke invitations. However, storing large image blobs directly inside PostgreSQL tables rapidly causes database degradation, slows vacuum operations, and breaks backup restore windows.

Milestone 9 codifies the strict media lifecycle rules:
1. **Zero Media Blobs in PostgreSQL:** PostgreSQL stores strictly validated relative or CDN URI strings (`/uploads/photo_...jpg`), metadata (width, height, size), and alt-captions.
2. **Server-Side File Content Validation:** The upload handler (`POST /api/upload/image`) inspects real file magic bytes (signatures for JPEG `FF D8 FF`, PNG `89 50 4E 47`, WebP `52 49 46 46`), strictly rejecting spoofed file extensions or executable payloads.
3. **Draft Ownership Enforcement:** Upload tokens require an authenticated session or valid signed guest token (`x-guest-token`).
4. **Hard Size Limit:** Maximum allowable upload size is 10 MB per image asset, with automatic client-side compression (0.85 JPEG quality).
5. **No Broken References:** Published invitations capture media URLs within their immutable snapshot (`Publication.snapshotData.fields.photoUrl` and `memories`). Media deletion in drafts never cascades to destroy already published live invitations.

---

## 2. Photo Gallery Layout Configurations

The template system supports three distinct gallery presentation modes:
1. **Polaroid Memory Stream (Birthday / Romantic):**
   - Individual tilted cards with handwritten date stamps and sweet personal captions.
2. **Heritage Grid Gallery (Wedding / Anniversary):**
   - 2-column or 3-column masonry with subtle gold borders and lightbox modal zoom.
3. **Horizontal Story Carousel (Mobile Native):**
   - Smooth `FlatList` horizontal paging with snap-to-alignment and active dot pagination indicators.

---

## 3. Client-Side Upload & Offline Resilience

- In `MediaService.js`, selecting images initiates pre-validation before network transfer.
- If the network drops during upload, the local draft maintains the previous working photo URI, preventing empty placeholder flashes or draft corruption.
- Users can zoom and reposition their photograph within the logical frame using `updatePhotoScale(newScale)` (range `0.7x` to `2.0x`).
