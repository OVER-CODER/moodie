import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { storage } from "../server/storage";
import { api } from "../shared/routes";
import { z } from "zod";
import { analyzeMood, getRecommendations as getLocalRecommendations } from "../shared/mood-mapping";
import { analyzeMoodWithGemini } from "../server/gemini";
import { processJournalEntry } from "../server/journal";
import { getRecommendedGames as getRecommendations } from "../server/games";
import { getRecommendedOutfits } from "../server/outfits";
import { getRecommendedPlaylists } from "../server/playlists";
import { chatMessageSchema, journalChatSchema } from "../shared/schema";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);

app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      console.log(logLine);
    }
  });

  next();
});

// Register mood analyze route
app.post(api.mood.analyze.path, async (req, res) => {
  try {
    console.log("Mood analyze request received");
    const input = api.mood.analyze.input.parse(req.body);
    console.log("Input validated:", input);

    let mood, confidence, recommendations;

    // Try Gemini API first
    const geminiResult = await analyzeMoodWithGemini(input.data || "", input.method);
    console.log("Gemini result:", geminiResult);

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

      // Store in DB
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
      // Fallback to local logic
      console.log("Using fallback mood analysis");
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
          defaultEnergy = "medium";
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
    console.error("Error in mood analyze:", err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.errors[0].message });
    }
    res.status(500).json({ message: "Internal server error", error: String(err) });
  }
});

// Register mood history route
app.get(api.mood.history.path, async (req, res) => {
  try {
    const logs = await storage.getMoodLogs();
    res.json(logs);
  } catch (err) {
    console.error("Error fetching mood logs:", err);
    res.status(500).json({ message: "Failed to fetch mood logs" });
  }
});

// Register journal chat route
app.post("/api/journal/chat", async (req, res) => {
  try {
    const input = journalChatSchema.parse(req.body);
    const result = await processJournalEntry(input.message, input.history);

    if (result.entry) {
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

// Register journal entries route
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

// Serve static files
const staticPath = path.join(__dirname, "../dist/public");
app.use(express.static(staticPath));

// Error handler
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("Internal Server Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(status).json({ message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

export default app;
