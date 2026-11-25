import EmbeddedPostgres from "embedded-postgres";
import fs from "fs";
import path from "path";

const dataDir = path.resolve(process.cwd(), ".pgdata");
const port = Number(process.env.LOCAL_PG_PORT || 5432);
const dbName = process.env.LOCAL_PG_DB || "coffeelatitudes";

async function main() {
  const pg = new EmbeddedPostgres({
    databaseDir: dataDir,
    user: "postgres",
    password: "postgres",
    port,
    persistent: true,
    onLog: (msg) => {
      if (process.env.DEBUG_PG) console.log("[pg]", msg);
    },
    onError: (err) => {
      console.error("[pg error]", err);
    },
  });

  if (!fs.existsSync(path.join(dataDir, "PG_VERSION"))) {
    console.log("Initialising embedded PostgreSQL data directory...");
    await pg.initialise();
  }

  console.log(`Starting embedded PostgreSQL on port ${port}...`);
  await pg.start();

  try {
    await pg.createDatabase(dbName);
    console.log(`Created database "${dbName}".`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (!message.includes("already exists")) {
      throw err;
    }
    console.log(`Database "${dbName}" already exists.`);
  }

  console.log(
    `PostgreSQL ready at postgresql://postgres:postgres@127.0.0.1:${port}/${dbName}?schema=public`
  );

  const shutdown = async () => {
    console.log("Stopping embedded PostgreSQL...");
    await pg.stop();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  // Keep alive until terminated
  setInterval(() => {}, 1000 * 60);
}

main().catch((err) => {
  console.error("Failed to start embedded PostgreSQL:", err);
  process.exit(1);
});
