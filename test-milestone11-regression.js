/**
 * YOU ARE MINE — MILESTONE 11 COMPREHENSIVE REGRESSION TEST SUITE
 * Verifies all 5 Milestone 11 deliverables and ensures zero regressions.
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('================================================================');
console.log('YOU ARE MINE — MILESTONE 11 REGRESSION VERIFICATION');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${name}: ${err.message}`);
  }
}

// -------------------------------------------------------------
// SECTION 1: BOTTOM TAB BAR REMEDIATION (Phase 1 / DEF-912)
// -------------------------------------------------------------
console.log('--- SECTION 1: Mobile Bottom Tab Bar Safe Areas ---');

test('Tab layout imports useSafeAreaInsets from react-native-safe-area-context', () => {
  const content = fs.readFileSync('you-are-mine-mobile/app/(tabs)/_layout.jsx', 'utf8');
  assert(content.includes("import { useSafeAreaInsets } from 'react-native-safe-area-context';"), 'Missing useSafeAreaInsets import');
});

test('Tab bar calculates dynamic height and bottom padding', () => {
  const content = fs.readFileSync('you-are-mine-mobile/app/(tabs)/_layout.jsx', 'utf8');
  assert(content.includes('bottomPadding = Math.max(insets.bottom'), 'Missing dynamic bottomPadding calculation');
  assert(content.includes('tabHeight = (Platform.OS ==='), 'Missing dynamic tabHeight calculation');
});

test('Tab label removed artificial minHeight/lineHeight clamp to prevent text clipping', () => {
  const content = fs.readFileSync('you-are-mine-mobile/app/(tabs)/_layout.jsx', 'utf8');
  assert(!content.includes('minHeight: 18'), 'Should not contain minHeight clamp on label');
});

// -------------------------------------------------------------
// SECTION 2: TEMPLATE IMAGE CROPPING (Phase 2 / DEF-913)
// -------------------------------------------------------------
console.log('\n--- SECTION 2: Portrait Template Image Cropping ---');

test('Template detail screen uses portrait 0.78 aspect ratio', () => {
  const content = fs.readFileSync('you-are-mine-mobile/app/template/[id].jsx', 'utf8');
  assert(content.includes('aspectRatio: 0.78'), 'Should use 0.78 portrait aspect ratio');
});

test('Template detail screen replaced 180px dome with elegant 36px rounded arch', () => {
  const content = fs.readFileSync('you-are-mine-mobile/app/template/[id].jsx', 'utf8');
  assert(content.includes('borderTopLeftRadius: 36'), 'Should use 36px arch radius');
});

test('Template detail and card use top-center focal point', () => {
  const detail = fs.readFileSync('you-are-mine-mobile/app/template/[id].jsx', 'utf8');
  const card = fs.readFileSync('you-are-mine-mobile/components/templates/TemplateCard.jsx', 'utf8');
  assert(detail.includes('focalPoint || "top center"'), 'Detail should support top center focal point');
  assert(card.includes('focalPoint || "top center"'), 'Card should support top center focal point');
});

// -------------------------------------------------------------
// SECTION 3: EXPLORE HEADER LOGO (Phase 3 / DEF-914)
// -------------------------------------------------------------
console.log('\n--- SECTION 3: Explore Header Brand Mark ---');

test('BrandEmblem pure SVG component exists with transparent vector styling', () => {
  const emblem = fs.readFileSync('you-are-mine-mobile/components/common/BrandEmblem.jsx', 'utf8');
  assert(emblem.includes('react-native-svg'), 'Emblem should use react-native-svg');
  assert(emblem.includes('viewBox="0 0 32 32"'), 'Emblem should have scalable viewBox');
});

test('Header component supports showLogoWithTitle with BrandEmblem', () => {
  const header = fs.readFileSync('you-are-mine-mobile/components/common/Header.jsx', 'utf8');
  assert(header.includes('showLogoWithTitle'), 'Header should support showLogoWithTitle prop');
  assert(header.includes('<BrandEmblem'), 'Header should render BrandEmblem');
});

test('Explore screen enables showLogoWithTitle', () => {
  const explore = fs.readFileSync('you-are-mine-mobile/app/(tabs)/explore.jsx', 'utf8');
  assert(explore.includes('showLogoWithTitle={true}'), 'Explore should enable showLogoWithTitle');
});

test('HeroBanner and Music screen use BrandEmblem on dark burgundy cards', () => {
  const hero = fs.readFileSync('you-are-mine-mobile/components/home/HeroBanner.jsx', 'utf8');
  const music = fs.readFileSync('you-are-mine-mobile/app/(tabs)/music.jsx', 'utf8');
  assert(hero.includes('<BrandEmblem'), 'HeroBanner should use BrandEmblem');
  assert(music.includes('<BrandEmblem'), 'Music screen should use BrandEmblem');
});

// -------------------------------------------------------------
// SECTION 4: ENVELOPE FOIL SEAL (Phase 4 / DEF-915)
// -------------------------------------------------------------
console.log('\n--- SECTION 4: Envelope Foil Seal Contrast ---');

test('EnvelopeAnimation uses high-luminance gold specular border and shadow', () => {
  const envelope = fs.readFileSync('you-are-mine-mobile/components/preview/EnvelopeAnimation.jsx', 'utf8');
  assert(envelope.includes("borderColor: '#F3E5AB'"), 'Should use #F3E5AB high-luminance gold border');
  assert(envelope.includes("shadowColor: '#D8B77B'"), 'Should use gold specular drop shadow');
});

test('Envelope monogram renders in lustrous #FFF2D1 gold', () => {
  const envelope = fs.readFileSync('you-are-mine-mobile/components/preview/EnvelopeAnimation.jsx', 'utf8');
  assert(envelope.includes("color: '#FFF2D1'"), 'Monogram should be #FFF2D1');
  assert(envelope.includes('YOU ARE MINE'), 'Should render YOU ARE MINE monogram text');
});

// -------------------------------------------------------------
// SECTION 5: AUDIO TRIMMER & PUBLICATION (Phase 5 & 6 / FEAT-AUDIO-01)
// -------------------------------------------------------------
console.log('\n--- SECTION 5: Audio Trimmer & Publication Integration ---');

test('MusicSelectionSheet provides interactive waveform and clip duration presets', () => {
  const sheet = fs.readFileSync('you-are-mine-mobile/components/editor/MusicSelectionSheet.jsx', 'utf8');
  assert(sheet.includes('WAVEFORM_BARS'), 'Should define waveform bars');
  assert(sheet.includes('CLIP_DURATIONS'), 'Should define clip duration options');
  assert(sheet.includes('handleApplyTrim'), 'Should implement handleApplyTrim');
});

test('EditorStore persists audioStartTime, audioEndTime and audioClipDuration in fields and design', () => {
  const store = fs.readFileSync('you-are-mine-mobile/store/editor.store.js', 'utf8');
  assert(store.includes('fields.audioStartTime ='), 'Should persist audioStartTime to fields');
  assert(store.includes('fields.audioEndTime ='), 'Should persist audioEndTime to fields');
  assert(store.includes('design = {'), 'Should define designConfig payload');
  assert(store.includes('audioEndTime: clipDur > 0 ? startSec + clipDur : 0'), 'Should calculate audioEndTime in design');
});

test('Public invitation viewer forwards audioStartTime and audioEndTime from snapshotData', () => {
  const invite = fs.readFileSync('src/app/invite/[slug]/page.tsx', 'utf8');
  assert(invite.includes('audioStartTime'), 'Should extract audioStartTime from snapshotData');
  assert(invite.includes('searchParams.set("audioStartTime"'), 'Should forward audioStartTime parameter');
  assert(invite.includes('searchParams.set("audioEndTime"'), 'Should forward audioEndTime parameter');
});

test('Template 01 respects audioStartTime and loops within audioEndTime', () => {
  const tpl = fs.readFileSync('src/app/template-01/page.jsx', 'utf8');
  assert(tpl.includes('effectiveAudioStart'), 'Should compute effectiveAudioStart');
  assert(tpl.includes('effectiveAudioEnd'), 'Should compute effectiveAudioEnd');
  assert(tpl.includes('timeupdate'), 'Should add timeupdate event listener for loop');
});

// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL SCENARIOS: ${totalTests}`);
console.log(`PASSED:          ${passedTests}`);
console.log(`FAILED:          ${totalTests - passedTests}`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  console.log('>>> ALL MILESTONE 11 REGRESSION CHECKS PASSED SUCCESSFULLY <<<\n');
  process.exit(0);
} else {
  console.error('>>> REGRESSION FAILURES DETECTED <<<');
  process.exit(1);
}
