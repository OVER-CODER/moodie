import { getDb } from "./db";
import { moodLogs, journalEntries, type InsertMoodLog, type MoodLog, type InsertJournalEntry, type JournalEntry } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  createMoodLog(log: InsertMoodLog): Promise<MoodLog>;
  getMoodLogs(): Promise<MoodLog[]>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalEntries(userId: string): Promise<JournalEntry[]>;
}

class MockStorage implements IStorage {
  private moodLogs: MoodLog[] = [];
  private journalEntries: JournalEntry[] = [];
  private moodLogId = 1;
  private journalEntryId = 1;

  async createMoodLog(log: InsertMoodLog): Promise<MoodLog> {
    const moodLog: MoodLog = {
      id: this.moodLogId++,
      ...log,
      createdAt: new Date(),
    } as any;
    this.moodLogs.push(moodLog);
    return moodLog;
  }

  async getMoodLogs(): Promise<MoodLog[]> {
    return this.moodLogs.sort((a, b) => {
      const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt) : (a.createdAt || new Date());
      const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt) : (b.createdAt || new Date());
      return dateB.getTime() - dateA.getTime();
    });
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const journalEntry: JournalEntry = {
      id: this.journalEntryId++,
      ...entry,
      createdAt: new Date(),
    } as any;
    this.journalEntries.push(journalEntry);
    return journalEntry;
  }

  async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    return this.journalEntries
      .filter(e => e.userId === userId)
      .sort((a, b) => {
        const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt) : (a.createdAt || new Date());
        const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt) : (b.createdAt || new Date());
        return dateB.getTime() - dateA.getTime();
      });
  }
}

export class DatabaseStorage implements IStorage {
  private mockStorage = new MockStorage();
  private dbAvailable = false;

  constructor() {
    this.checkDbAvailability();
  }

  private checkDbAvailability() {
    try {
      getDb();
      this.dbAvailable = true;
    } catch (e) {
      console.warn("Database not available, using in-memory storage");
      this.dbAvailable = false;
    }
  }

  async createMoodLog(log: InsertMoodLog): Promise<MoodLog> {
    try {
      if (this.dbAvailable) {
        const db = getDb();
        const result = await db.insert(moodLogs).values(log).returning();
        return result[0];
      }
    } catch (e) {
      console.warn("Database error, falling back to mock storage:", e);
      this.dbAvailable = false;
    }
    return this.mockStorage.createMoodLog(log);
  }

  async getMoodLogs(): Promise<MoodLog[]> {
    try {
      if (this.dbAvailable) {
        const db = getDb();
        return await db.select().from(moodLogs).orderBy(desc(moodLogs.createdAt));
      }
    } catch (e) {
      console.warn("Database error, falling back to mock storage:", e);
      this.dbAvailable = false;
    }
    return this.mockStorage.getMoodLogs();
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    try {
      if (this.dbAvailable) {
        const db = getDb();
        const result = await db.insert(journalEntries).values(entry).returning();
        return result[0];
      }
    } catch (e) {
      console.warn("Database error, falling back to mock storage:", e);
      this.dbAvailable = false;
    }
    return this.mockStorage.createJournalEntry(entry);
  }

  async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    try {
      if (this.dbAvailable) {
        const db = getDb();
        return await db.select().from(journalEntries).where(eq(journalEntries.userId, userId)).orderBy(desc(journalEntries.createdAt));
      }
    } catch (e) {
      console.warn("Database error, falling back to mock storage:", e);
      this.dbAvailable = false;
    }
    return this.mockStorage.getJournalEntries(userId);
  }
}

export const storage = new DatabaseStorage();
