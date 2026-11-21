import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ASSETS_DIR = path.resolve('play-store/assets');
const SCREENSHOTS_DIR = path.resolve('play-store/screenshots/phone');

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, detail = '') {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${testName}${detail ? ' - ' + detail : ''}`);
    failedCount++;
  }
}

async function validatePlayAssets() {
  console.log('========================================================');
  console.log('  YOU ARE MINE — GOOGLE PLAY STORE ASSET VALIDATION     ');
  console.log('========================================================\n');

  // 1. App Icon Validation
  console.log('--- 1. Official App Icon Validation (512x512) ---');
  const iconPath = path.join(ASSETS_DIR, 'app-icon-512.png');
  const iconExists = fs.existsSync(iconPath);
  assert(iconExists, 'app-icon-512.png exists in play-store/assets');

  if (iconExists) {
    const iconMeta = await sharp(iconPath).metadata();
    assert(iconMeta.width === 512 && iconMeta.height === 512, 'app-icon-512.png dimensions are exactly 512x512', `Got ${iconMeta.width}x${iconMeta.height}`);
    assert(iconMeta.format === 'png', 'app-icon-512.png format is PNG');
    const iconStat = fs.statSync(iconPath);
    assert(iconStat.size < 1024 * 1024, 'app-icon-512.png size is under 1MB', `Size: ${(iconStat.size / 1024).toFixed(1)} KB`);
  }

  // 2. Feature Graphic Validation
  console.log('\n--- 2. Feature Graphic Validation (1024x500) ---');
  const featPath = path.join(ASSETS_DIR, 'feature-graphic-1024x500.png');
  const featExists = fs.existsSync(featPath);
  assert(featExists, 'feature-graphic-1024x500.png exists in play-store/assets');

  if (featExists) {
    const featMeta = await sharp(featPath).metadata();
    assert(featMeta.width === 1024 && featMeta.height === 500, 'feature-graphic-1024x500.png dimensions are exactly 1024x500', `Got ${featMeta.width}x${featMeta.height}`);
    assert(featMeta.format === 'png', 'feature-graphic-1024x500.png format is PNG');
    const featStat = fs.statSync(featPath);
    assert(featStat.size < 15 * 1024 * 1024, 'feature-graphic-1024x500.png size is under 15MB', `Size: ${(featStat.size / 1024).toFixed(1)} KB`);
  }

  // 3. Phone Screenshots Validation
  console.log('\n--- 3. Phone Screenshots Validation (8+ Screenshots, 1080x1920) ---');
  const screenshotsExist = fs.existsSync(SCREENSHOTS_DIR);
  assert(screenshotsExist, 'play-store/screenshots/phone directory exists');

  if (screenshotsExist) {
    const files = fs.readdirSync(SCREENSHOTS_DIR).filter((f) => f.endsWith('.png'));
    assert(files.length >= 8, `At least 8 phone screenshots present (found ${files.length})`);

    for (const file of files) {
      const p = path.join(SCREENSHOTS_DIR, file);
      const meta = await sharp(p).metadata();
      const stat = fs.statSync(p);

      assert(
        meta.width === 1080 && meta.height === 1920,
        `Screenshot ${file} dimensions are exactly 1080x1920`,
        `Got ${meta.width}x${meta.height}`
      );
      assert(meta.format === 'png', `Screenshot ${file} is PNG format`);
      assert(stat.size < 8 * 1024 * 1024, `Screenshot ${file} file size is < 8MB`, `Size: ${(stat.size / 1024).toFixed(1)} KB`);
    }
  }

  console.log('\n========================================================');
  console.log(`ASSET VALIDATION COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('========================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

validatePlayAssets().catch((err) => {
  console.error('Validation script error:', err);
  process.exit(1);
});
