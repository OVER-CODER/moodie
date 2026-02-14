import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { analyzeMood, getRecommendations } from "@shared/mood-mapping";
import { analyzeMoodWithGemini } from "./gemini";

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
      } else {
        // Fallback to local logic
        const result = analyzeMood(input.method, input.data);
        mood = result.mood;
        confidence = result.confidence;
        recommendations = getRecommendations(mood);
      }

      // Store in DB
      await storage.createMoodLog({
        mood,
        confidence,
        method: input.method,
        inputData: input.data || null,
        recommendations
      });

      res.json({
        mood,
        confidence,
        recommendations
      });
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

  return httpServer;
}
