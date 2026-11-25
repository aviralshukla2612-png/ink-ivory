# MILESTONE 9 — PUBLICATION SNAPSHOT & BACKWARD COMPATIBILITY

**Document Version:** 1.0.0  
**Status:** Certified & Active  
**Milestone:** 9 (Feature Expansion — Zero Regression)  
**System Architecture:** Immutable Publication Snapshots & Schema Migration Guards

---

## 1. Immutability Architecture

When an invitation is published after successful payment verification (`POST /api/orders/verify` or mobile publication pipeline), a permanent snapshot is written to `Publication.snapshotData` in PostgreSQL.

### Core Immutability Invariants:
1. **Never Re-query Drafts:** The public guest invitation route (`/invite/[slug]`) reads exclusively from `Publication.snapshotData`. It never fetches the live draft or the mutable template catalog table during guest visits.
2. **Draft Edits Cannot Mutate Published URLs:** Modifying ceremony times, font sizes, or music clips inside the customer's draft workspace does not mutate live published web pages unless the customer explicitly triggers a controlled republish.
3. **Zero Media Reference Orphanage:** Media files associated with active publications are protected against cleanup sweeps.

---

## 2. Backward Compatibility Matrix

| Version | Schema Changes | Ingestion Handling | Render Safety |
|---|---|---|---|
| **v1 (Legacy)** | Flat `date`, `time`, `venue` | Synthesized into single `events[0]` | 100% Backward Compatible |
| **v1 (Legacy)** | No `letterSpacing` / `fontWeight` | Defaults to `0` and `600` | Unchanged Visual Presentation |
| **v1 (Legacy)** | No `audioStartTime` / `duration` | Defaults to full track start at 0s | Uninterrupted Audio Playback |
| **v2 (Milestone 9)**| Multi-events, trimmer, layer order | Full fidelity serialization | Native & Web Interactive |

---

## 3. Safe Schema Evolution

All new fields introduced in Milestone 9 (`layoutVariant`, `aspectRatio`, `supportedSections`, `endTime`, `venueAddress`, `letterSpacing`, `fontWeight`, `zIndex`) are strictly optional (`?`) in TypeScript contracts and Prisma schemas. No migrations require table dropping, data truncation, or destructive column alterations.
