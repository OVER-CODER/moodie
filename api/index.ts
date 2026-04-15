import 'dotenv/config';
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { getRecommendedGames } from "../server/games";
import { getRecommendedOutfits } from "../server/outfits";
import { getRecommendedPlaylists } from "../server/playlists";
import { analyzeMood, getRecommendations as getLocalRecommendations } from "../shared/mood-mapping";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());

// API Routes (define before static files so they take precedence)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Health check passed' });
});

app.post('/api/mood', async (req, res) => {
  try {
    const { method, data } = req.body;
    
    if (!method || !data) {
      return res.status(400).json({ message: 'Method and data are required' });
    }

    console.log(`Analyzing mood - method: ${method}`);

    // Analyze mood using local logic (since Gemini may not be available on Vercel)
    const result = analyzeMood(method, data);
    const mood = result.mood;
    const confidence = result.confidence;
    const localRecommendations = getLocalRecommendations(mood);

    // Determine energy and intent based on mood
    let energy: "low" | "medium" | "high" = "medium";
    let intent: "relax" | "distract" | "focus" | "uplift" | "express" = "distract";

    switch (mood.toLowerCase()) {
      case 'happy':
        energy = "high";
        intent = "uplift";
        break;
      case 'energized':
        energy = "high";
        intent = "focus";
        break;
      case 'tired':
        energy = "low";
        intent = "relax";
        break;
      case 'calm':
        energy = "low";
        intent = "focus";
        break;
      case 'anxious':
        energy = "medium";
        intent = "distract";
        break;
      case 'sad':
        energy = "low";
        intent = "uplift";
        break;
    }

    // Get games, outfits, and playlists based on mood and energy
    const games = getRecommendedGames(mood, energy, intent);
    const outfits = getRecommendedOutfits(mood);
    const playlists = getRecommendedPlaylists(mood);

    console.log(`Mood: ${mood}, Energy: ${energy}, Intent: ${intent}, Games: ${games.length}, Outfits: ${outfits.length}`);

    res.json({
      mood,
      energy,
      intent,
      confidence,
      recommendations: localRecommendations,
      games,
      outfits: outfits,
      playlists: playlists
    });
  } catch (error) {
    console.error('Error analyzing mood:', error);
    res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
});

app.get('/api/mood/history', async (req, res) => {
  try {
    // Return empty history for now
    res.json([]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch mood history' });
  }
});

// Serve static files from dist/public
const staticPath = path.join(__dirname, '../dist/public');
app.use(express.static(staticPath));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

export default app;
