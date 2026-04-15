import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());

// Simple mood analysis function (inlined)
function analyzeMood(method: string, data: string): { mood: string; confidence: number } {
  const text = method === 'self' ? (data as string) : '';
  
  const moodKeywords = {
    happy: ['happy', 'excited', 'joy', 'great', 'wonderful', 'amazing', 'fantastic'],
    sad: ['sad', 'depressed', 'unhappy', 'miserable', 'down', 'gloomy'],
    anxious: ['anxious', 'worried', 'nervous', 'stressed', 'tense', 'afraid'],
    calm: ['calm', 'peaceful', 'relaxed', 'zen', 'serene', 'tranquil'],
    tired: ['tired', 'exhausted', 'sleepy', 'fatigued', 'drained'],
    energized: ['energized', 'excited', 'pumped', 'motivated', 'active'],
  };

  let bestMood = 'calm';
  let highestScore = 0;

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    const score = keywords.filter(k => text.toLowerCase().includes(k)).length;
    if (score > highestScore) {
      highestScore = score;
      bestMood = mood;
    }
  }

  const confidence = Math.min(0.95, 0.5 + (highestScore * 0.15));
  return { mood: bestMood, confidence };
}

// Games database
const GAMES_DATABASE: any[] = [
    {
        id: "2048",
        title: "2048",
        url: "https://play2048.co/",
        description: "Join the numbers and get to the 2048 tile! A calming puzzle game.",
        energy: "low",
        moods: ["anxious", "tired", "bored", "calm"],
    },
    {
        id: "hextris",
        title: "Hextris",
        url: "https://hextris.io/",
        description: "An addictive puzzle game inspired by Tetris.",
        energy: "medium",
        moods: ["bored", "anxious", "focus"],
    },
    {
        id: "crossy-road",
        title: "Crossy Road Web",
        url: "https://poki.com/en/g/crossy-road",
        description: "Hop across the road without getting squashed!",
        energy: "high",
        moods: ["happy", "energized"],
    },
    {
        id: "dino-run",
        title: "Dino Run",
        url: "https://chromedino.com/",
        description: "Run, Dino, Run! A simple reflex game.",
        energy: "medium",
        moods: ["energized", "happy"],
    },
    {
        id: "sudoku",
        title: "Sudoku",
        url: "https://sudoku.com/expert/",
        description: "Focus your mind with numbers.",
        energy: "medium",
        moods: ["stressed", "focus", "anxious"],
    },
];

// Outfits database
const OUTFITS_DATABASE: any = {
    happy: ["colorful dress", "bright shirt", "fun accessories"],
    energized: ["athletic wear", "running shoes", "gym outfit"],
    tired: ["cozy sweater", "comfortable pants", "slippers"],
    calm: ["light fabric", "neutral colors", "loose fit"],
    anxious: ["comfortable clothes", "favorite jacket", "cozy socks"],
    sad: ["uplifting colors", "favorite outfit", "comfortable layers"],
};

// Playlists database
const PLAYLISTS_DATABASE: any = {
    happy: "uplifting-vibes",
    energized: "high-energy-beats",
    tired: "chill-lofi",
    calm: "peaceful-sounds",
    anxious: "calming-music",
    sad: "feel-good-songs",
};

function getRecommendedGames(mood: string, energy: "low" | "medium" | "high", intent: string): any[] {
    const scoredGames = GAMES_DATABASE.map(game => {
        let score = 0;
        if (game.moods.includes(mood.toLowerCase())) score += 5;
        if (game.energy === energy) score += 3;
        else if (
            (energy === 'medium' && (game.energy === 'low' || game.energy === 'high')) ||
            (energy === 'high' && game.energy === 'medium') ||
            (energy === 'low' && game.energy === 'medium')
        ) score += 1;
        score += Math.random();
        return { game, score };
    });

    return scoredGames
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(item => item.game);
}

function getRecommendedOutfits(mood: string): string[] {
    return OUTFITS_DATABASE[mood.toLowerCase()] || OUTFITS_DATABASE['calm'];
}

function getRecommendedPlaylists(mood: string): string {
    return PLAYLISTS_DATABASE[mood.toLowerCase()] || PLAYLISTS_DATABASE['calm'];
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Health check passed' });
});

app.post('/api/mood', (req, res) => {
  try {
    const { method, data } = req.body;
    
    if (!method || !data) {
      return res.status(400).json({ message: 'Method and data are required' });
    }

    console.log(`Analyzing mood - method: ${method}`);

    // Analyze mood
    const result = analyzeMood(method, data);
    const mood = result.mood;
    const confidence = result.confidence;

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

    // Get recommendations
    const games = getRecommendedGames(mood, energy, intent);
    const outfits = getRecommendedOutfits(mood);
    const playlists = getRecommendedPlaylists(mood);

    console.log(`Mood: ${mood}, Games: ${games.length}, Outfits: ${outfits.length}`);

    return res.status(200).json({
      mood,
      energy,
      intent,
      confidence,
      recommendations: {},
      games,
      outfits: outfits,
      playlists: playlists
    });
  } catch (error) {
    console.error('Error analyzing mood:', error);
    return res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
});

app.get('/api/mood/history', (req, res) => {
  try {
    return res.status(200).json([]);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Failed to fetch mood history' });
  }
});

// Serve static files from dist/public
const publicPath = path.join(__dirname, '../dist/public');
app.use(express.static(publicPath));

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

export default app;
