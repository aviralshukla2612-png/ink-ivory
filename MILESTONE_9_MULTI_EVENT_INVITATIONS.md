# MILESTONE 9 — MULTI-FUNCTION EVENT INVITATION SYSTEM

**Document Version:** 1.0.0  
**Status:** Certified & Active  
**Milestone:** 9 (Feature Expansion — Zero Regression)  
**System Architecture:** Unified Multi-Function Celebration Timeline (Web & Mobile)

---

## 1. Executive Summary

Indian and luxury multicultural celebrations rarely consist of a single occasion. A single wedding celebration typically spans multiple distinct rituals over multiple days: *Haldi*, *Mehndi*, *Sangeet*, *Vara Pooja / Muhurtham*, *Wedding Ceremony*, and *Grand Reception*.

Milestone 9 expands the invitation data model and editing suites to natively support ordered multi-function timelines without creating redundant invitation instances or breaking immutable publication snapshots.

---

## 2. Event Data Specification

Every ceremony is represented in the shared invitation schema (`WeddingEventItem`) with the following typed contract:

```typescript
export interface WeddingEventItem {
  id?: string;
  name: string;            // e.g. "Haldi Ceremony", "Sangeet & Sangeet Night"
  date: string;            // e.g. "Thursday, Dec 17, 2026"
  time: string;            // e.g. "10:00 AM" (Start Time)
  endTime?: string;        // e.g. "1:00 PM" (Optional End Time)
  venue: string;           // e.g. "The Grand Courtyard"
  venueAddress?: string;   // e.g. "Heritage Palace Grounds, Udaipur"
  mapUrl?: string;         // e.g. Google Maps navigation coordinate link
  description?: string;    // e.g. "A morning of turmeric blessings and traditional music"
  icon?: string;           // 'haldi' | 'mehendi' | 'sangeet' | 'wedding' | 'reception' | 'temple'
  order?: number;          // Integer display order index (0-indexed)
}
```

---

## 3. Customer Operations & Editing Workflow

In both the Web Editor (`/customize/[templateId]`) and Mobile Editor (`SectionManagementSheet.jsx`), customers can:
1. **Quick-Add Ceremony Presets:** One-tap chips for *Haldi Ceremony*, *Mehendi Night*, *Sangeet & Dance*, *Wedding Muhurtham*, *Grand Reception*, and *Ring Ceremony*.
2. **Reorder Ceremonies (`⬆` / `⬇`):** Move events earlier or later in the celebration sequence with instantaneous reactive layout updates.
3. **Edit Date, Start Time & End Time:** Precise schedule controls with validation preventing empty strings.
4. **Venue & Address Mapping:** Support for venue names plus extended geographic address strings for guest directions.
5. **Safeguarded Deletion:** Multi-event lists prevent deleting the final remaining ceremony to ensure every invitation contains at least one primary celebration.

---

## 4. Backward Compatibility & Publication Immutability

1. **Legacy Invitations (`version: 1`):**
   - Invitations that only possess top-level `date`, `time`, and `venue` fields are automatically synthesized into a single-event timeline array (`[{ name: 'Wedding Ceremony', date, time, venue }]`).
2. **Immutable Publication Snapshots:**
   - Existing published invitations hosted at `/invite/[slug]` render strictly from `Publication.snapshotData.fields.events`.
   - Modifying a draft's event list never mutates or invalidates live published invitations.
