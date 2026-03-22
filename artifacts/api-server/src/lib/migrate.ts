import { db } from "@workspace/db";
import { sql } from "drizzle-orm";
import { logger } from "./logger";

export async function runMigrations(): Promise<void> {
  logger.info("Running database migrations...");
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      published INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  logger.info("Database migrations complete");
}
