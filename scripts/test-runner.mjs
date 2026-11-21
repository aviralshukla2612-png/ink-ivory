import { spawn } from "child_process";
import fs from "fs";
import path from "path";

// Load .env.local if present so test suites share secrets with Next.js
if (fs.existsSync(".env.local")) {
  const envContent = fs.readFileSync(".env.local", "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

async function runWithServer(testScriptPath) {
  const PORT = "3010";
  console.log(`Starting Next.js test server on port ${PORT}...`);
  const child = spawn("node", ["node_modules/next/dist/bin/next", "dev", "-p", PORT], {
    cwd: process.cwd(),
    stdio: "pipe",
    env: { ...process.env, PORT },
  });

  try {
    let ready = false;
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 500));
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/`);
        if (res.status === 200 || res.status === 404) {
          ready = true;
          break;
        }
      } catch (e) {}
    }

    if (!ready) throw new Error("Next.js test server failed to start.");

    console.log(`Server ready on http://127.0.0.1:${PORT}. Executing ${testScriptPath}...`);
    const testProc = spawn("node", [testScriptPath], {
      cwd: process.cwd(),
      stdio: "inherit",
      env: { ...process.env, TEST_BASE_URL: `http://127.0.0.1:${PORT}` },
    });

    const exitCode = await new Promise((resolve) => {
      testProc.on("close", resolve);
    });

    if (exitCode !== 0) {
      process.exitCode = exitCode;
    }
  } finally {
    child.kill("SIGTERM");
  }
}

const target = process.argv[2] || "scripts/milestone1-rbac-test.mjs";
runWithServer(target).catch((err) => {
  console.error("Test runner error:", err);
  process.exit(1);
});
