import { db } from "./db";
import { moodLogs, journalEntries, type InsertMoodLog, type MoodLog, type InsertJournalEntry, type JournalEntry } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  createMoodLog(log: InsertMoodLog): Promise<MoodLog>;
  getMoodLogs(): Promise<MoodLog[]>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalEntries(userId: string): Promise<JournalEntry[]>;
}

export class DatabaseStorage implements IStorage {
  async createMoodLog(log: InsertMoodLog): Promise<MoodLog> {
    const result = await db.insert(moodLogs).values(log).returning();
    return result[0];
  }

  async getMoodLogs(): Promise<MoodLog[]> {
    return await db.select().from(moodLogs).orderBy(desc(moodLogs.createdAt));
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const result = await db.insert(journalEntries).values(entry).returning();
    return result[0];
  }

  async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    return await db.select().from(journalEntries).where(eq(journalEntries.userId, userId)).orderBy(desc(journalEntries.createdAt));
  }
}

export const storage = new DatabaseStorage();
