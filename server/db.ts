import { drizzle } from "drizzle-orm/better-sqlite3";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  // Use a local file for SQLite
  process.env.DATABASE_URL = "sqlite.db";
}

const sqlite = new Database(process.env.DATABASE_URL);
export const db = drizzle(sqlite, { schema });
