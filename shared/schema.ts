import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const moodLogs = sqliteTable("mood_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  mood: text("mood").notNull(), // e.g., 'calm', 'energized', 'anxious'
  confidence: real("confidence").notNull(), // Changed from integer to doublePrecision to handle decimal values like 0.92
  method: text("method").notNull(), // 'face' | 'self'
  inputData: text("input_data"), // The text input or image hash/reference
  recommendations: text("recommendations", { mode: "json" }).notNull(), // Store the generated recommendations snapshot
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()), // SQLite doesn't have native timestamp, store as int/date
});

export const insertMoodLogSchema = createInsertSchema(moodLogs).omit({ 
  id: true, 
  createdAt: true 
});

export type MoodLog = typeof moodLogs.$inferSelect;
export type InsertMoodLog = z.infer<typeof insertMoodLogSchema>;

// Application specific types
export type Mood = "calm" | "energized" | "anxious" | "neutral" | "happy" | "tired";

export interface Recommendation {
  outfit: string[];
  playlist: string; // Spotify ID
  workout: string;
  food: string;
  affirmation: string;
  productivity: string;
}

export interface MoodResult {
  mood: Mood;
  confidence: number;
  recommendations: Recommendation;
}
