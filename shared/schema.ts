import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const moodLogs = pgTable("mood_logs", {
  id: serial("id").primaryKey(),
  mood: text("mood").notNull(), // e.g., 'calm', 'energized', 'anxious'
  confidence: integer("confidence").notNull(), // 0-100
  method: text("method").notNull(), // 'face' | 'self'
  inputData: text("input_data"), // The text input or image hash/reference
  recommendations: jsonb("recommendations").notNull(), // Store the generated recommendations snapshot
  createdAt: timestamp("created_at").defaultNow(),
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
