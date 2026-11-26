# HYBRID STEP 3.05 — SHARED VIEWPORT EXTENSION PLAN

## 1. Unified Router Architecture
When authorization to migrate is granted, `SharedWebInvitationViewport.jsx` will be extended to support all 8 celebration templates using a unified registry:

```javascript
// Registry mapping in SharedWebInvitationViewport.jsx
const TEMPLATE_BUNDLES = {
  // Royal Heritage Invitations (Static HTML Micro-Apps)
  'tpl-wedding-navy-01': TEMPLATE_01_BUNDLED_HTML,
  'tpl-anniversary-gold-02': TEMPLATE_02_BUNDLED_HTML,
  'tpl-wedding-temple-03': TEMPLATE_03_BUNDLED_HTML,
  'tpl-wedding-paper-palace-04': TEMPLATE_04_BUNDLED_HTML,
  'tpl-wedding-south-indian-05': TEMPLATE_05_BUNDLED_HTML,

  // Celebration Occasions (Pre-compiled React Experiences)
  'birthday': TEMPLATE_BIRTHDAY_BUNDLED_HTML,
  'valentine': TEMPLATE_VALENTINE_BUNDLED_HTML,
  'date-planner': TEMPLATE_DATE_PLANNER_BUNDLED_HTML,
};
```

## 2. Event Bridge Normalization
The `INK_IVORY_CUSTOM_UPDATE` schema will be formalized to handle both wedding couples (`groom`, `bride`) and celebration recipients:
```typescript
interface UniversalCustomUpdatePayload {
  // Common identity
  names?: string;
  recipientName?: string;
  senderName?: string;
  
  // Event & Schedule
  date?: string;
  time?: string;
  venue?: string;
  city?: string;
  
  // Custom copy & media
  heading?: string;
  message?: string;
  photoUrl?: string;
  audioSource?: string;
  audioStartTime?: number;
}
```
