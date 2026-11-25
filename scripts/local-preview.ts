import EmbeddedPostgres from "embedded-postgres";
import { spawn, spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const PORT = Number(process.env.PORT || 3000);
const PG_PORT = Number(process.env.LOCAL_PG_PORT || 5432);
const DB_NAME = process.env.LOCAL_PG_DB || "coffeelatitudes";
const DATA_DIR = path.resolve(process.cwd(), ".pgdata");
const APP_URL = `http://localhost:${PORT}`;

function runStep(command: string, args: string[], env: NodeJS.ProcessEnv) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: true,
    env,
  });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

function openBrowser(url: string) {
  if (process.platform === "win32") {
    spawn("cmd", ["/c", "start", "", url], { detached: true, stdio: "ignore" }).unref();
  } else if (process.platform === "darwin") {
    spawn("open", [url], { detached: true, stdio: "ignore" }).unref();
  } else {
    spawn("xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
  }
}

async function waitForHealth(url: string, timeoutMs = 45_000): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${url}/api/health`);
      if (res.ok) return true;
    } catch {
      // Server still starting
    }
    await new Promise((r) => setTimeout(r, 750));
  }
  return false;
}

async function main() {
  const databaseUrl = `postgresql://postgres:postgres@127.0.0.1:${PG_PORT}/${DB_NAME}?schema=public`;
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    DATABASE_URL: databaseUrl,
    NEXT_PUBLIC_SITE_URL: APP_URL,
    MOCK_STRIPE: process.env.MOCK_STRIPE || "true",
  };

  console.log("\n☕ Starting Coffee Latitudes local preview...\n");

  // 1. Start embedded PostgreSQL
  const pg = new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    user: "postgres",
    password: "postgres",
    port: PG_PORT,
    persistent: true,
    onLog: () => {},
    onError: (err) => console.error("[postgres]", err),
  });

  if (!fs.existsSync(path.join(DATA_DIR, "PG_VERSION"))) {
    console.log("→ Initialising local PostgreSQL database...");
    await pg.initialise();
  }

  console.log(`→ Starting local PostgreSQL on port ${PG_PORT}...`);
  await pg.start();

  try {
    await pg.createDatabase(DB_NAME);
    console.log(`→ Created database "${DB_NAME}".`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (!message.includes("already exists")) {
      await pg.stop();
      throw err;
    }
  }

  // 2. Apply migrations & seed catalog
  console.log("→ Applying Prisma migrations & seeding storefront catalog...");
  runStep("npx", ["prisma", "migrate", "deploy"], env);
  runStep("npx", ["prisma", "db", "seed"], env);

  // 3. Start Next.js dev server
  console.log(`\n→ Launching Next.js at ${APP_URL}...\n`);
  const nextProc = spawn("npx", ["next", "dev", "-p", String(PORT)], {
    stdio: "inherit",
    shell: true,
    env,
  });

  let shuttingDown = false;
  const shutdown = async () => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log("\n☕ Shutting down Coffee Latitudes local preview...");
    if (!nextProc.killed) {
      nextProc.kill("SIGINT");
    }
    try {
      await pg.stop();
    } catch {
      // Ignore shutdown errors
    }
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  nextProc.on("exit", async (code) => {
    if (!shuttingDown) {
      shuttingDown = true;
      try {
        await pg.stop();
      } catch {
        // Ignore
      }
      process.exit(code ?? 0);
    }
  });

  // 4. Wait until ready, then open browser
  const healthy = await waitForHealth(APP_URL);
  if (healthy) {
    console.log(`\n✅ Coffee Latitudes is live!`);
    console.log(`   Storefront:  ${APP_URL}`);
    console.log(`   Calibrator:  ${APP_URL}/?calibrate=1`);
    console.log(`   Café Menu:   ${APP_URL}/menu`);
    console.log(`   Shop:        ${APP_URL}/shop`);
    console.log(`   About:       ${APP_URL}/about`);
    console.log(`\n   Press Ctrl+C to stop both Next.js and PostgreSQL cleanly.\n`);

    if (process.env.NO_OPEN !== "1") {
      openBrowser(APP_URL);
    }
  }
}

main().catch((err) => {
  console.error("Local preview failed:", err);
  process.exit(1);
});
