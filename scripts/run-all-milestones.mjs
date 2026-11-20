/**
 * Ink & Ivory — Master Admin Test Suite (Milestones 1 through 8)
 *
 * Runs all 8 milestone verification suites sequentially against
 * an isolated Next.js test runner instance.
 */

import { spawn } from "child_process";
import path from "path";

const suites = [
  "scripts/milestone1-rbac-test.mjs",
  "scripts/milestone2-dashboard-test.mjs",
  "scripts/milestone3-templates-test.mjs",
  "scripts/milestone4-builder-test.mjs",
  "scripts/milestone5-customers-test.mjs",
  "scripts/milestone6-publications-test.mjs",
  "scripts/milestone7-finance-test.mjs",
  "scripts/milestone8-operations-test.mjs",
];

async function runSingleSuite(suitePath) {
  return new Promise((resolve) => {
    console.log(`\n======================================================`);
    console.log(`RUNNING SUITE: ${suitePath}`);
    console.log(`======================================================\n`);

    const proc = spawn("node", ["scripts/test-runner.mjs", suitePath], {
      stdio: "inherit",
      shell: true,
      cwd: process.cwd(),
    });

    proc.on("close", (code) => {
      resolve({ suitePath, exitCode: code });
    });
  });
}

async function main() {
  console.log("==========================================================");
  console.log("  INK & IVORY — FULL PLATFORM MILESTONES 1-8 VERIFICATION  ");
  console.log("==========================================================\n");

  const results = [];
  for (const suite of suites) {
    const res = await runSingleSuite(suite);
    results.push(res);
    if (res.exitCode !== 0) {
      console.error(`\nSuite ${suite} FAILED with exit code ${res.exitCode}. Stopping.`);
      process.exit(1);
    }
  }

  console.log("\n==========================================================");
  console.log("   ALL 8 MILESTONES VERIFIED WITH 100% SUCCESSFUL PASS!   ");
  console.log("==========================================================");
  results.forEach((r) => {
    console.log(`  ✓ ${r.suitePath} (Exit Code: ${r.exitCode})`);
  });
}

main().catch((err) => {
  console.error("Master test runner error:", err);
  process.exit(1);
});
