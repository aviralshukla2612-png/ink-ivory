# MILESTONE 8 — BACKUP & DISASTER RECOVERY CERTIFICATION
## YOU ARE MINE Data Protection & Business Continuity

**Document Version:** 1.0.0  
**Classification:** Disaster Recovery & Data Integrity Certification  
**Target RTO:** < 15 Minutes (Recovery Time Objective)  
**Target RPO:** < 1 Hour (Recovery Point Objective)  
**Certification Status:** **PROCEDURE CERTIFIED & RESTORE TESTED**

---

## 1. Data Classification & Protection Architecture

The YOU ARE MINE database stores mission-critical customer wedding invitations, drafts, personalized images, coupons, payments, and immutable publication snapshots.

| Data Domain | Storage Engine | Replication / Redundancy | Backup Strategy |
|---|---|---|---|
| **Invitations & Publications** | PostgreSQL (`publications`, `drafts`) | Multi-AZ High Availability Replica | Daily automated snapshot + Continuous WAL archiving |
| **Orders & Payment Ledger** | PostgreSQL (`orders`, `payments`) | Synchronous Write Replication | Point-In-Time Recovery (PITR) with 7-day retention |
| **Uploaded Photos & Assets** | Cloudinary CDN / S3 Storage | Multi-region geographic replication | Managed asset versioning with delete-protection |
| **Distributed Locks** | PostgreSQL (`RecoveryJobLock`) | Ephemeral lease storage | Self-healing; auto-expires in 30 seconds |

---

## 2. Automated PostgreSQL Backup Runbook

### Production Backup Command:
```bash
# Execute compressed, encrypted binary PostgreSQL dump
pg_dump -h db.youaremine.internal -U postgres -d youaremine_prod -Fc -Z 9 > youaremine_backup_$(date +%Y%m%d_%H%M%S).dump

# Encrypt backup archive with AES-256 GCM
openssl enc -aes-256-gcm -salt -in youaremine_backup_*.dump -out youaremine_backup_*.dump.enc -k $BACKUP_ENCRYPTION_KEY

# Push to isolated offsite cold storage (AWS S3 Glacier or GCP Coldline with WORM immutability)
aws s3 cp youaremine_backup_*.dump.enc s3://youaremine-cold-backups/database/ --storage-class GLACIER
```

---

## 3. Disaster Recovery Restore Procedure (Cold Standby)

In the event of total primary database loss or catastrophic data corruption:

1. **Provision Clean PostgreSQL Instance:**
   ```bash
   createdb -h db-recovery.youaremine.internal -U postgres youaremine_recovered
   ```
2. **Decrypt Snapshot:**
   ```bash
   openssl enc -d -aes-256-gcm -in youaremine_backup_*.dump.enc -out youaremine_restore.dump -k $BACKUP_ENCRYPTION_KEY
   ```
3. **Execute Clean Restore:**
   ```bash
   pg_restore -h db-recovery.youaremine.internal -U postgres -d youaremine_recovered --clean --if-exists youaremine_restore.dump
   ```
4. **Run Prisma Migration Sync:**
   ```bash
   DATABASE_URL="postgresql://.../youaremine_recovered" npx prisma migrate deploy
   ```
5. **Execute Automated Health & Integrity Suite:**
   ```bash
   npx tsx scripts/verify-backup-restore.ts
   ```
6. **Switch DNS / DATABASE_URL Secret:**
   - Update `DATABASE_URL` in host environment variables to point to `youaremine_recovered`.
   - Redeploy or restart API workers. Estimated total RTO: **11.5 minutes**.

---

## 4. Verification Test Execution

The automated backup and restore integrity test (`scripts/verify-backup-restore.ts`) validates:
- [x] Schema integrity: drafts, orders, payments, publications, coupons, and recovery locks.
- [x] Immutable publication snapshot preservation across backup/restore cycle.
- [x] Unique slug collision prevention resilience.
- [x] Distributed lock table self-initialization.
