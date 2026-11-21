# YOU ARE MINE — Operational Runbook & Production Maintenance
**Audience:** Platform Operations Engineers, Lead Developers, SRE  
**Brand Identity:** YOU ARE MINE

---

## 1. Day-to-Day Operations

### Managing Centralized Admin
1. Open `https://youaremine-online.com/admin`.
2. Authenticate using executive master key or staff email/password credentials.
3. Use the top **Platform Scope Selector** to switch between **All Platforms**, **Website**, or **Android App**.

### Deploying Android App Updates & Force Update
1. Navigate to `/admin/android`.
2. To release an update:
   - Increment `latestVersion` (e.g. `1.0.1`).
   - Add highlights under **Google Play Release Notes**.
   - If older versions contain breaking API changes, toggle **Strict Force Update Mode** and set `minSupportedVersion` to `1.0.1`.
   - Click **Save & Publish**. All active Android devices will immediately receive the update directive.

### Dispatching Push Notification Campaigns
1. Navigate to `/admin/notifications`.
2. Click **Compose Notification**.
3. Select target channel: `Android App Only`, `Website Only`, or `All Platforms`.
4. Enter promotional title, message, and deep link (`youaremine://template/:id`).
5. Click **Dispatch Now**.

### Managing Audio Soundtracks
1. Place new high-bitrate MP3 files in `public/audio/`.
2. Navigate to `/admin/music` and click **Add Track**.
3. Enter title, artist, movie credits, and audio path. The track is immediately available to both Web and Android customizers.

---

## 2. Disaster Recovery & Backup Restoration

- **Automated Local Backups:** Periodic datastore snapshots are captured in `data/backups/`.
- **Database Migration:** Run `node scripts/migrate-json-to-postgres.mjs` to synchronize file datastores directly into production PostgreSQL with idempotency guarantees.
- **Health Check Endpoint:** `GET /api/health` returns status of store, memory, and database connections.
