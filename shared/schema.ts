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

export interface Game {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  description?: string;
  energy: "low" | "medium" | "high";
  moods: string[];
}

export interface Outfit {
  id: string;
  imageUrl: string;
  style: string;
  description: string;
  moods: string[];
}

export interface Playlist {
  id: string;
  spotifyId: string;
  title: string;
  description: string;
  moods: string[];
}

export interface MoodResult {
  mood: Mood;
  energy: "low" | "medium" | "high";
  intent: "relax" | "distract" | "focus" | "uplift" | "express";
  confidence: number;
  recommendations: Recommendation;
  games: Game[];
  outfits: Outfit[];
  playlists: Playlist[];
}

export const journalEntries = sqliteTable("journal_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(), // Clerk user ID
  content: text("content").notNull(), // The actual journal entry text
  mood: text("mood").notNull(),
  summary: text("summary"), // Short summary of the entry
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true
});

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;

export const chatMessageSchema = z.object({
  message: z.string(),
  history: z.array(z.object({
    role: z.enum(["user", "model"]),
    parts: z.string()
  })).optional().default([])
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const journalChatSchema = chatMessageSchema.extend({
  userId: z.string().min(1)
});

export type JournalChatRequest = z.infer<typeof journalChatSchema>;
