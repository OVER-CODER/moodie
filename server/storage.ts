import { db } from "./db";
import { moodLogs, type InsertMoodLog, type MoodLog } from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  createMoodLog(log: InsertMoodLog): Promise<MoodLog>;
  getMoodLogs(): Promise<MoodLog[]>;
}

export class DatabaseStorage implements IStorage {
  async createMoodLog(log: InsertMoodLog): Promise<MoodLog> {
    const [newLog] = await db.insert(moodLogs).values(log).returning();
    return newLog;
  }

  async getMoodLogs(): Promise<MoodLog[]> {
    return await db.select().from(moodLogs).orderBy(desc(moodLogs.createdAt));
  }
}

export const storage = new DatabaseStorage();
