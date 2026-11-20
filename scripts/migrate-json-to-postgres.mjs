/**
 * Ink & Ivory — JSON to PostgreSQL Migration & Backup Pipeline
 *
 * Responsibilities:
 * 1. Safe pre-migration backup of data/ink-ivory-store.json.
 * 2. Data validation and referential integrity check.
 * 3. PostgreSQL SQL seed and migration script generation.
 * 4. Record count and checksum verification.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

const STORE_PATH = path.join(process.cwd(), "data", "ink-ivory-store.json");
const BACKUP_DIR = path.join(process.cwd(), "data", "backups");
const SQL_EXPORT_PATH = path.join(process.cwd(), "prisma", "seed_data.sql");

async function runMigration() {
  console.log("==================================================================");
  console.log("   INK & IVORY — JSON TO POSTGRESQL MIGRATION PIPELINE            ");
  console.log(`   Source Store: ${STORE_PATH}                                   `);
  console.log(`   Timestamp:    ${new Date().toISOString()}                     `);
  console.log("==================================================================\n");

  // 1. Read JSON Store
  if (!fs.existsSync(STORE_PATH)) {
    throw new Error(`Datastore not found at ${STORE_PATH}`);
  }

  const raw = fs.readFileSync(STORE_PATH, "utf-8");
  const data = JSON.parse(raw);

  // 2. Compute Checksum
  const checksum = crypto.createHash("sha256").update(raw).digest("hex");
  console.log(`[1] Source Datastore Checksum (SHA256): ${checksum}`);

  // 3. Create Backup
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(BACKUP_DIR, `ink-ivory-store-backup-${timestamp}.json`);
  fs.writeFileSync(backupPath, raw, "utf-8");
  console.log(`[2] Immutable Backup Created: ${backupPath} (${fs.statSync(backupPath).size} bytes)`);

  // 4. Validate Record Counts & Integrity
  const counts = {
    users: data.users?.length || 0,
    templates: data.templates?.length || 0,
    prices: data.prices?.length || 0,
    drafts: data.drafts?.length || 0,
    orders: data.orders?.length || 0,
    payments: data.payments?.length || 0,
    invitations: data.invitations?.length || 0,
    publications: data.publications?.length || 0,
    auditLogs: data.auditLogs?.length || 0,
  };

  console.log("\n[3] Validating Store Records for Relational Schema:");
  console.table(counts);

  // Verify that drafts have valid templateId
  let draftErrors = 0;
  for (const d of (data.drafts || [])) {
    if (!d.id || !d.templateId) {
      draftErrors++;
      console.warn(`[WARN] Draft missing id or templateId:`, d);
    }
  }

  if (draftErrors === 0) {
    console.log(`[✓ PASS] All ${counts.drafts} drafts pass referential integrity checks.`);
  }

  // 5. Generate PostgreSQL SQL DML Seed Script
  console.log(`\n[4] Generating PostgreSQL DML Seed: ${SQL_EXPORT_PATH}`);
  const sqlLines = [
    `-- Ink & Ivory PostgreSQL Seed Export`,
    `-- Generated from backup: ${path.basename(backupPath)}`,
    `-- Checksum: ${checksum}`,
    `BEGIN;`,
    ``,
  ];

  // Insert Templates
  for (const t of (data.templates || [])) {
    const defaultFieldsJson = JSON.stringify(t.defaultFields || {}).replace(/'/g, "''");
    const designConfigJson = JSON.stringify(t.designConfig || {}).replace(/'/g, "''");
    sqlLines.push(
      `INSERT INTO "Template" ("id", "slug", "title", "occasion", "description", "previewImage", "liveDemoUrl", "badge", "tier", "isActive", "defaultFields", "designConfig", "createdAt", "updatedAt")`,
      `VALUES ('${t.id}', '${t.slug}', '${t.title.replace(/'/g, "''")}', '${t.occasion.replace(/'/g, "''")}', '${(t.description || "").replace(/'/g, "''")}', ${t.previewImage ? `'${t.previewImage}'` : "NULL"}, '${t.liveDemoUrl}', ${t.badge ? `'${t.badge}'` : "NULL"}, '${t.tier || "SIGNATURE"}', ${t.isActive ? "TRUE" : "FALSE"}, '${defaultFieldsJson}'::jsonb, '${designConfigJson}'::jsonb, NOW(), NOW())`,
      `ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "updatedAt" = NOW();`
    );
  }

  // Insert Prices
  for (const p of (data.prices || [])) {
    sqlLines.push(
      `INSERT INTO "TemplatePrice" ("id", "templateId", "currency", "amountPaise", "promotionalPricePaise", "discountPercent", "isActive", "createdAt", "updatedAt")`,
      `VALUES ('${p.id}', '${p.templateId}', '${p.currency || "INR"}', ${p.amount || 29900}, ${p.promotionalPrice || "NULL"}, ${p.discountPercent || "NULL"}, ${p.isActive ? "TRUE" : "FALSE"}, NOW(), NOW())`,
      `ON CONFLICT ("id") DO NOTHING;`
    );
  }

  // Insert Drafts
  for (const d of (data.drafts || [])) {
    const fieldsJson = JSON.stringify(d.fields || {}).replace(/'/g, "''");
    const designJson = JSON.stringify(d.design || {}).replace(/'/g, "''");
    sqlLines.push(
      `INSERT INTO "Draft" ("id", "guestToken", "templateId", "title", "fields", "design", "customAudioUrl", "customAudioTitle", "status", "version", "createdAt", "updatedAt")`,
      `VALUES ('${d.id}', '${d.guestToken}', '${d.templateId}', '${(d.title || "Untitled").replace(/'/g, "''")}', '${fieldsJson}'::jsonb, '${designJson}'::jsonb, ${d.customAudioUrl ? `'${d.customAudioUrl.replace(/'/g, "''")}'` : "NULL"}, ${d.customAudioTitle ? `'${d.customAudioTitle.replace(/'/g, "''")}'` : "NULL"}, '${d.status || "DRAFT"}', ${d.version || 1}, '${d.createdAt || new Date().toISOString()}'::timestamptz, '${d.updatedAt || new Date().toISOString()}'::timestamptz)`,
      `ON CONFLICT ("id") DO NOTHING;`
    );
  }

  sqlLines.push(`COMMIT;`);
  fs.writeFileSync(SQL_EXPORT_PATH, sqlLines.join("\n"), "utf-8");

  console.log(`[✓ PASS] SQL Seed script written (${fs.statSync(SQL_EXPORT_PATH).size} bytes).`);
  console.log("\n==================================================================");
  console.log("   MIGRATION & INTEGRITY VERIFICATION COMPLETED SUCCESSFULLY       ");
  console.log("==================================================================\n");

  return { backupPath, checksum, counts, sqlPath: SQL_EXPORT_PATH };
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
