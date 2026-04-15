import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('API Handler initialized');
console.log('__dirname:', __dirname);

// Simple mood analysis function (inlined)
function analyzeMood(method: string, data: string): { mood: string; confidence: number } {
  const text = method === 'self' ? (data as string) : '';
  
  const moodKeywords = {
    happy: ['happy', 'excited', 'joy', 'great', 'wonderful', 'amazing', 'fantastic', 'good'],
    sad: ['sad', 'depressed', 'unhappy', 'miserable', 'down', 'gloomy', 'lonely'],
    anxious: ['anxious', 'worried', 'nervous', 'stressed', 'tense', 'afraid', 'panic'],
    calm: ['calm', 'peaceful', 'relaxed', 'zen', 'serene', 'tranquil', 'quiet'],
    tired: ['tired', 'exhausted', 'sleepy', 'fatigued', 'drained', 'worn', 'sleep'],
    energized: ['energized', 'pumped', 'motivated', 'active', 'excited', 'vibrant'],
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
const GAMES_DATABASE = [
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
const OUTFITS_DATABASE = {
    happy: ["colorful dress", "bright shirt", "fun accessories"],
    energized: ["athletic wear", "running shoes", "gym outfit"],
    tired: ["cozy sweater", "comfortable pants", "slippers"],
    calm: ["light fabric", "neutral colors", "loose fit"],
    anxious: ["comfortable clothes", "favorite jacket", "cozy socks"],
    sad: ["uplifting colors", "favorite outfit", "comfortable layers"],
};

// Playlists database
const PLAYLISTS_DATABASE = {
    happy: "uplifting-vibes",
    energized: "high-energy-beats",
    tired: "chill-lofi",
    calm: "peaceful-sounds",
    anxious: "calming-music",
    sad: "feel-good-songs",
};

function getRecommendedGames(mood: string, energy: string): any[] {
    const scoredGames = GAMES_DATABASE.map((game: any) => {
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
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 3)
        .map((item: any) => item.game);
}

function getRecommendedOutfits(mood: string): string[] {
    const outfits = (OUTFITS_DATABASE as any)[mood.toLowerCase()] || (OUTFITS_DATABASE as any)['calm'];
    return outfits;
}

function getRecommendedPlaylists(mood: string): string {
    const playlist = (PLAYLISTS_DATABASE as any)[mood.toLowerCase()] || (PLAYLISTS_DATABASE as any)['calm'];
    return playlist;
}

// API Routes
app.get('/api/health', (req, res) => {
  console.log('Health check');
  res.status(200).json({ status: 'ok', message: 'Health check passed' });
});

app.post('/api/mood', (req, res) => {
  console.log('POST /api/mood called');
  console.log('Body:', JSON.stringify(req.body));
  
  try {
    const { method, data } = req.body;
    
    if (!method || !data) {
      console.log('Missing method or data');
      return res.status(400).json({ message: 'Method and data are required' });
    }

    console.log(`Analyzing mood - method: ${method}, data length: ${data.length}`);

    // Analyze mood
    const result = analyzeMood(method, data);
    const mood = result.mood;
    const confidence = result.confidence;

    console.log(`Detected mood: ${mood}, confidence: ${confidence}`);

    // Determine energy and intent based on mood
    let energy: string = "medium";
    let intent: string = "distract";

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
    const games = getRecommendedGames(mood, energy);
    const outfits = getRecommendedOutfits(mood);
    const playlists = getRecommendedPlaylists(mood);

    console.log(`Response: mood=${mood}, games=${games.length}, outfits=${outfits.length}`);

    return res.status(200).json({
      mood,
      energy,
      intent,
      confidence,
      games,
      outfits,
      playlists
    });
  } catch (error) {
    console.error('Error analyzing mood:', error);
    return res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
});

app.get('/api/mood/history', (req, res) => {
  console.log('GET /api/mood/history');
  try {
    return res.status(200).json([]);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Failed to fetch mood history' });
  }
});

// Serve static files from dist/public
let publicPath = '';
try {
  publicPath = path.join(__dirname, '../dist/public');
  console.log('Public path:', publicPath);
  console.log('Public path exists:', fs.existsSync(publicPath));
} catch (err) {
  console.log('Error resolving public path:', err);
  publicPath = '';
}

if (publicPath && fs.existsSync(publicPath)) {
  try {
    app.use(express.static(publicPath, { maxAge: '1h' }));
    console.log('Static file serving enabled');
  } catch (err) {
    console.log('Error setting up static files:', err);
  }
}

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  console.log('SPA fallback for:', req.path);
  if (!publicPath) {
    console.log('Public path not available');
    return res.status(404).json({ message: 'Not found', path: req.path });
  }
  const indexPath = path.join(publicPath, 'index.html');
  try {
    if (fs.existsSync(indexPath)) {
      console.log('Serving index.html');
      res.sendFile(indexPath);
    } else {
      console.log('index.html not found at:', indexPath);
      res.status(404).json({ message: 'Not found', path: req.path });
    }
  } catch (err) {
    console.log('Error serving index.html:', err);
    res.status(500).json({ message: 'Error serving page', error: String(err) });
  }
});

// Catch-all for undefined routes (this may not be reached due to SPA fallback)
app.use((req, res) => {
  console.log('404 - Not found:', req.method, req.path);
  res.status(404).json({ message: 'Not found', path: req.path });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: String(err.message) });
});

console.log('App handlers registered');

export default app;
