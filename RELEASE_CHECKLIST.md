# YOU ARE MINE — Google Play Store & Web Release Checklist
**Target Release Date:** November 2026  
**Build Target:** Version `1.0.0` (Build Code `1`)  
**Package:** `com.youaremine.app`

---

## 1. Pre-Flight Verification Gate
- [x] All 8 foundational admin milestones verified with 100% pass rate (`scripts/run-all-milestones.mjs`).
- [x] Stage 2, 3, and 4 security penetration test suites executed and verified (100% compliance score).
- [x] Verified ONE centralized admin panel active at `/admin` with 19 modules.
- [x] Verified official brand logo (`/logo.webp` and `/logo.png`) updated across Web, Navbar, Footer, and Android assets.
- [x] Verified Play Store assets generated and passed validation script (`scripts/validate-play-assets.mjs` — 34/34 passed).
- [x] Verified full audio tracks self-hosted and streaming without cutoff in `public/audio/`.

---

## 2. Google Play Console Submission Steps

1. **Create App Record:**
   - Log into [Google Play Console](https://play.google.com/console).
   - Click **Create App** → App Name: `YOU ARE MINE: Digital Invites` → Language: `English (India)` → Free App.

2. **Store Listing Setup:**
   - Copy short and full descriptions from `PLAY_CONSOLE_LISTING_CONTENT.md`.
   - Upload `play-store/assets/app-icon-512.png` (512x512).
   - Upload `play-store/assets/feature-graphic-1024x500.png` (1024x500).
   - Upload 8 phone screenshots from `play-store/screenshots/phone/`.

3. **App Content Questionnaire:**
   - Privacy Policy: Paste `https://youaremine-online.com/privacy`.
   - Ads: Select **No, my app does not contain ads**.
   - App Access: Select **All functionality is available without special access** (or provide test admin credentials if requested).
   - Content Ratings: Complete questionnaire (select Lifestyle/Utilities, zero violent/mature content) → Yields **PEGI 3 / Everyone**.
   - Data Safety: Fill out matching `DATA_SAFETY_AND_PRIVACY_DISCLOSURES.md`.

4. **Build & Release Bundle:**
   - Open Android Studio: `npx cap open android`.
   - Select **Build** → **Generate Signed Bundle / APK** → **Android App Bundle (.aab)**.
   - Choose production release keystore.
   - Upload generated `.aab` file to **Production** track (or **Internal Testing** track first).
   - Review and roll out release to production!
