# GLOBAL_TEMPLATE_08_TESTING_AND_ACCEPTANCE_CRITERIA
## Quality Assurance, Verification Protocols & Acceptance Gates

### 1. Mandatory Acceptance Criteria for True Visual Parity

For any celebration template to be certified as having achieved true visual parity between website and mobile, it must satisfy all six acceptance gates:

```text
GATE 1: Identity & Color Gate
└── Background palette, paper gradients, and decorative borders match website hex tokens 1:1.

GATE 2: Typography & Script Gate
└── Exact Google Font families, cursive script signatures, and font weights render without font substitution.

GATE 3: Layout & Perspective Gate
└── Aspect ratios, concentric arch geometries, and 3D door perspective match website viewports.

GATE 4: Interaction & Animation Gate
└── Signature gamified ceremonies (scratch-offs, garland stringing, wax seals, candle blowing) execute smoothly.

GATE 5: Editor & Autosave Gate
└── Updating names, dates, or venues in the native editor reflects live on the canvas and persists to drafts.

GATE 6: Publication Consistency Gate
└── The design previewed in the mobile app is byte-for-byte identical to the published public web invitation.
```

---

### 2. Automated & Manual Regression Verification Suite

#### Test Protocol 1: Live Two-Way Synchronization
1. Open any template in the mobile editor (`/editor/[id]`).
2. Open the native bottom sheet and update the couple names from `"Aarav & Riya"` to `"Kabir & Ananya"`.
3. **Pass Condition**: The invitation canvas immediately updates the couple names in the correct cursive script within 16ms without screen flickering or full reload.

#### Test Protocol 2: Audio Lifecycle & Mute Control
1. Open a template in the mobile preview screen (`/preview/[id]`).
2. Tap the floating mute icon in the native top bar.
3. Tap the "Back" button to return to the home tab.
4. **Pass Condition**: Audio begins playing on user tap, mutes on toggle, and stops immediately upon navigating back with zero unhandled exceptions.

#### Test Protocol 3: Cross-Platform Viewport Responsiveness
1. Render each template across three standard reference viewports:
   - Compact Phone: 360 × 640 px (Android Small)
   - Standard Phone: 390 × 844 px (iPhone 14)
   - Large Phone: 412 × 915 px (Pixel 7 Pro)
2. **Pass Condition**: Arches scale smoothly; text wraps without clipping; action buttons remain accessible within safe area insets.

#### Test Protocol 4: Publication Parity Verification
1. From mobile, complete the checkout flow for a test draft to generate a published slug.
2. Open the published link in desktop Chrome and mobile Safari.
3. Compare the published web page side-by-side with the mobile draft preview.
4. **Pass Condition**: Zero visual or functional divergence between mobile preview and guest web link.
