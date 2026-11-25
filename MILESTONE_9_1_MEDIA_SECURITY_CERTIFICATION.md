# MILESTONE 9.1 — PHOTO GALLERY & MEDIA SECURITY AUDIT

**Document Version:** 1.0.0  
**Audit Timestamp:** 2026-11-25T10:40:40+05:30  
**Evaluator:** Security Tester & Principal QA Architect  
**Status:** **CERTIFIED**

---

## 1. Executive Summary & Zero-Blob Invariant

All invitation photography is handled via direct authenticated uploads. Under no circumstances are binary image blobs written to PostgreSQL. Database tables maintain exclusively relative asset paths (e.g. `/uploads/photo_...jpg`), metadata, and dimensions.

---

## 2. Security Boundary & Validation Matrix

| Security Layer | Check Performed | Enforcement Point | Result | Status |
|---|---|---|---|---|
| **Client Pre-check** | `fileSize > 10 * 1024 * 1024` | `MediaService.js` (Mobile) | Throws user-friendly size warning | **PASS** |
| **Server Size Guard** | `file.size > 10 * 1024 * 1024` | `POST /api/upload/image` | Returns HTTP 400 rejection | **PASS** |
| **Extension Whitelist** | Check `.jpg`, `.jpeg`, `.png`, `.webp` | Server-side `sanitizeFileName` | Blocks `.exe`, `.svg`, `.sh` | **PASS** |
| **Magic Byte Check** | Byte signatures (`FF D8 FF`, `89 50 4E 47`, etc.) | `validateImageMagicBytes` | Blocks disguised malicious payloads | **PASS** |
| **Draft Authorization** | Header `x-guest-token` required | Header extraction & validation | Anonymous uploads blocked | **PASS** |
| **Rate Limiting** | Max 20 uploads / 10 minutes | In-memory sliding window limiter | Blocks automated flooding | **PASS** |
| **Path Traversal Guard**| Sanitize filename to prevent `../` | `sanitizeFileName` & UUID prepending | Written strictly to `/public/uploads` | **PASS** |

---

## 3. Storage Decoupling & Publication Safety

- Published invitations hosted at `/invite/[slug]` reference media assets recorded inside `Publication.snapshotData`.
- Deleting an image in a draft does not cascade or purge the referenced asset from already published live event portals.
