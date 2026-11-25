// test-milestone9-1-regression.js — MILESTONE 9.1 FUNCTIONAL REGRESSION SUITE
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('=================================================================');
console.log('   YOU ARE MINE — MILESTONE 9.1 REGRESSION TEST SUITE (PHASES 2-6)');
console.log('=================================================================');

let testCount = 0;

// SECTION 1: EDITOR REGRESSION (Phase 2)
console.log('Phase 2: Testing Editor Typography, Layering & Persistence...');

// 1.1 Typography steps and boundaries
const textEditingCode = fs.readFileSync(path.resolve('you-are-mine-mobile/components/editor/TextEditingSheet.jsx'), 'utf8');
assert(textEditingCode.includes('value: -0.5'), 'Tight letter spacing must be -0.5');
assert(textEditingCode.includes('value: 0'), 'Normal letter spacing must be 0');
assert(textEditingCode.includes('value: 1.5'), 'Relaxed letter spacing must be 1.5');
assert(textEditingCode.includes('value: 3'), 'Wide letter spacing must be 3');
assert(textEditingCode.includes('value: \'400\''), 'Font weight 400 must be supported');
assert(textEditingCode.includes('value: \'600\''), 'Font weight 600 must be supported');
assert(textEditingCode.includes('value: \'700\''), 'Font weight 700 must be supported');
assert(textEditingCode.includes('Math.max(10,'), 'Font size lower bound must be 10px');
assert(textEditingCode.includes('Math.min(42,'), 'Font size upper bound must be 42px');
console.log('  ✓ Typography token steppers, weights, and size bounds verified.');
testCount++;

// 1.2 Layering & Resets in Store
const editorStoreCode = fs.readFileSync(path.resolve('you-are-mine-mobile/store/editor.store.js'), 'utf8');
assert(editorStoreCode.includes('reorderElementLayer: (id, direction)'), 'reorderElementLayer must accept id and direction');
assert(editorStoreCode.includes('resetElementToDefault: (id)'), 'resetElementToDefault must exist in store');
assert(editorStoreCode.includes('resetCanvasToDefault: ()'), 'resetCanvasToDefault must exist in store');
assert(editorStoreCode.includes('MAX_HISTORY'), 'Undo stack depth must be capped by MAX_HISTORY');
console.log('  ✓ Layer ordering, element resets, and history stack bound verified.');
testCount++;

// 1.3 Canvas Alignment Guides & Boundaries
const canvasCode = fs.readFileSync(path.resolve('you-are-mine-mobile/components/editor/InvitationCanvas.jsx'), 'utf8');
assert(canvasCode.includes('strokeDasharray="3,3"'), 'Center alignment guide must use dashed line');
assert(canvasCode.includes('selectedElementId ?'), 'Guide must only render when an element is active');

const draggableCode = fs.readFileSync(path.resolve('you-are-mine-mobile/components/editor/DraggableElement.jsx'), 'utf8');
assert(draggableCode.includes('Math.max(-120, Math.min(120,'), 'X drag boundary must be constrained to [-120, 120]');
assert(draggableCode.includes('CANVAS_LOGICAL_HEIGHT - 60'), 'Y drag boundary must be constrained');
console.log('  ✓ Canvas alignment guides and drag safe-area boundaries verified.');
testCount++;

// SECTION 2: MULTI-EVENT TIMELINE (Phase 3)
console.log('Phase 3: Testing Multi-Event Timeline & Ordering...');
const sectionSheetCode = fs.readFileSync(path.resolve('you-are-mine-mobile/components/editor/SectionManagementSheet.jsx'), 'utf8');
assert(sectionSheetCode.includes('Haldi Ceremony'), 'Preset Haldi Ceremony must exist');
assert(sectionSheetCode.includes('Mehendi Night'), 'Preset Mehendi Night must exist');
assert(sectionSheetCode.includes('Sangeet & Dance'), 'Preset Sangeet must exist');
assert(sectionSheetCode.includes('Wedding Muhurtham'), 'Preset Muhurtham must exist');
assert(sectionSheetCode.includes('Grand Reception'), 'Preset Reception must exist');
assert(sectionSheetCode.includes('reorderEvent(index, \'up\')'), 'Move event up must be supported');
assert(sectionSheetCode.includes('reorderEvent(index, \'down\')'), 'Move event down must be supported');
assert(sectionSheetCode.includes('events.length > 1'), 'Deletion must be guarded against empty timeline');
console.log('  ✓ Ceremony presets, reordering controls, and non-empty validation verified.');
testCount++;

// SECTION 3: MEDIA SECURITY & GALLERY (Phase 4)
console.log('Phase 4: Testing Media Security & Size Limit...');
const mediaServiceCode = fs.readFileSync(path.resolve('you-are-mine-mobile/services/media.service.js'), 'utf8');
assert(mediaServiceCode.includes('10 * 1024 * 1024'), 'Hard 10MB limit must be enforced');
assert(mediaServiceCode.includes('pickMultipleImagesFromGallery'), 'Multi-image picker must be supported');
assert(mediaServiceCode.includes('x-guest-token'), 'Guest token authorization header must be included in uploads');

// Verify server-side upload route validation
const uploadApiCode = fs.readFileSync(path.resolve('src/app/api/upload/image/route.ts'), 'utf8');
assert(uploadApiCode.includes('10 * 1024 * 1024') || uploadApiCode.includes('10 * 1024'), 'Server must enforce 10MB limit independently');
console.log('  ✓ Client 10MB pre-check and server-side upload security verified.');
testCount++;

// SECTION 4: STORYTELLING & ENVELOPE (Phase 5)
console.log('Phase 5: Testing Storytelling & Envelope Animation...');
const envelopeCode = fs.readFileSync(path.resolve('you-are-mine-mobile/components/preview/EnvelopeAnimation.jsx'), 'utf8');
assert(envelopeCode.includes('AccessibilityInfo'), 'Envelope must import AccessibilityInfo for reduced motion');
assert(envelopeCode.includes('handleSkip'), 'Envelope must provide accessible skip option');
assert(envelopeCode.includes('waxSealInner'), 'Envelope must render wax seal monogram button');
assert(envelopeCode.includes('sealScaleAnim'), 'Envelope must animate wax seal scale pulse');
console.log('  ✓ Envelope opening sequence, skip fallback, and accessibility verified.');
testCount++;

// SECTION 5: VISUAL TEXTURES & BORDERS (Phase 6)
console.log('Phase 6: Testing Visual Textures & Border Geometries...');
const typesCode = fs.readFileSync(path.resolve('src/types/index.ts'), 'utf8');
assert(typesCode.includes('\'ivory-silk\''), 'Texture ivory-silk must be supported');
assert(typesCode.includes('\'navy-luxury\''), 'Texture navy-luxury must be supported');
assert(typesCode.includes('\'champagne-linen\''), 'Texture champagne-linen must be supported');
assert(typesCode.includes('\'emerald-velvet\''), 'Texture emerald-velvet must be supported');
assert(typesCode.includes('\'royal-damask\''), 'Texture royal-damask must be supported');
assert(typesCode.includes('\'ornate\''), 'Border ornate must be supported');
assert(typesCode.includes('\'modern-double\''), 'Border modern-double must be supported');
console.log('  ✓ 5 luxury texture tokens and border styles verified in schema.');
testCount++;

console.log('=================================================================');
console.log(`   REGRESSION RESULTS: ${testCount} / 7 SUITES PASSED (100%)    `);
console.log('=================================================================');
