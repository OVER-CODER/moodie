import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";

let db: ReturnType<typeof drizzle> | null = null;

function initializeDb() {
  if (db) return db;

  if (!process.env.DATABASE_URL) {
    if (process.env.VERCEL) {
      process.env.DATABASE_URL = "/tmp/sqlite.db";
    } else {
      // Use a local file for SQLite
      process.env.DATABASE_URL = "sqlite.db";
    }
  }

  const sqlite = new Database(process.env.DATABASE_URL);
  db = drizzle(sqlite, { schema });
  return db;
}

export function getDb() {
  return initializeDb();
}
