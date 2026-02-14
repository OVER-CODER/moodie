import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { analyzeMood, getRecommendations as getLocalRecommendations } from "@shared/mood-mapping";
import { analyzeMoodWithGemini } from "./gemini";
import { processJournalEntry } from "./journal";
import { getRecommendedGames as getRecommendations } from "./games";
import { getRecommendedOutfits } from "./outfits";
import { getRecommendedPlaylists } from "./playlists";
import { chatMessageSchema, journalChatSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.mood.analyze.path, async (req, res) => {
    try {
      const input = api.mood.analyze.input.parse(req.body);

      let mood, confidence, recommendations;

      // Try Gemini API first
      const geminiResult = await analyzeMoodWithGemini(input.data || "", input.method);

      if (geminiResult) {
        mood = geminiResult.mood;
        confidence = geminiResult.confidence;
        recommendations = geminiResult.recommendations;
        // New fields
        const energy = geminiResult.energy || "medium";
        const intent = geminiResult.intent || "distract";

        // Get games, outfits, and playlists
        const games = getRecommendations(mood, energy, intent);
        const outfits = getRecommendedOutfits(mood);
        const playlists = getRecommendedPlaylists(mood);

        // Store in DB (Schema update needed for energy/intent, but for now we just store basic logs to keep it simple or we can update schema later)
        await storage.createMoodLog({
          mood,
          confidence,
          method: input.method,
          inputData: input.data || null,
          recommendations
        });

        return res.json({
          mood,
          energy,
          intent,
          confidence,
          recommendations,
          games,
          outfits,
          playlists
        });
      } else {
        // Fallback to local logic (simplified, no games for now or random)
        const result = analyzeMood(input.method, input.data);
        mood = result.mood;
        confidence = result.confidence;
        recommendations = getLocalRecommendations(mood);

        // Infer reasonable defaults for energy and intent based on mood
        let defaultEnergy: "low" | "medium" | "high" = "medium";
        let defaultIntent: "relax" | "distract" | "focus" | "uplift" | "express" = "distract";

        switch (mood.toLowerCase()) {
          case 'happy':
            defaultEnergy = "high";
            defaultIntent = "uplift";
            break;
          case 'energized':
            defaultEnergy = "high";
            defaultIntent = "focus";
            break;
          case 'tired':
            defaultEnergy = "low";
            defaultIntent = "relax";
            break;
          case 'calm':
            defaultEnergy = "low";
            defaultIntent = "focus";
            break;
          case 'anxious':
            defaultEnergy = "medium"; // Distraction usually helps anxiety
            defaultIntent = "distract";
            break;
        }

        return res.json({
          mood,
          energy: defaultEnergy,
          intent: defaultIntent,
          confidence,
          recommendations,
          games: getRecommendations(mood, defaultEnergy, defaultIntent),
          outfits: getRecommendedOutfits(mood),
          playlists: getRecommendedPlaylists(mood)
        });
      }

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.mood.history.path, async (req, res) => {
    const logs = await storage.getMoodLogs();
    res.json(logs);
  });

  app.post("/api/journal/chat", async (req, res) => {
    try {
      const input = journalChatSchema.parse(req.body);
      const result = await processJournalEntry(input.message, input.history);

      if (result.entry) {
        // Save the entry if generated
        await storage.createJournalEntry({
          userId: input.userId,
          content: result.entry.content,
          mood: result.entry.mood,
          summary: result.entry.summary
        });
      }

      res.json(result);
    } catch (err) {
      console.error("Journal chat error:", err);
      res.status(500).json({ message: "Failed to process journal chat" });
    }
  });

  app.get("/api/journal/entries/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const entries = await storage.getJournalEntries(userId);
      res.json(entries);
    } catch (err) {
      console.error("Fetch entries error:", err);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  return httpServer;
}
