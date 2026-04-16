import 'dotenv/config';
import express from 'express';

// API Handler with games connection fix
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    // Puzzle & Relaxation Games
    {
        id: "2048",
        title: "2048",
        url: "https://play2048.co/",
        description: "Join the numbers and get to the 2048 tile! A calming puzzle game.",
        energy: "low",
        moods: ["anxious", "tired", "bored", "calm"],
        thumbnail: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "hextris",
        title: "Hextris",
        url: "https://hextris.io/",
        description: "An addictive puzzle game inspired by Tetris.",
        energy: "medium",
        moods: ["bored", "anxious", "focus"],
        thumbnail: "https://images.unsplash.com/photo-1535721471682-b52f519dba45?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "tic-tac-toe",
        title: "Tic Tac Toe Master",
        url: "https://playtictactoe.org/",
        description: "Challenge the AI in this classic strategy game.",
        energy: "low",
        moods: ["stressed", "focus", "anxious"],
        thumbnail: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "flappy-bird",
        title: "Flappy Bird",
        url: "https://flappybird.io/",
        description: "A simple yet challenging game of timing and precision.",
        energy: "medium",
        moods: ["bored", "focus", "energized"],
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "snake-game",
        title: "Classic Snake",
        url: "https://playsnake.org/",
        description: "The classic snake game. How long can you grow?",
        energy: "medium",
        moods: ["bored", "focus", "calm"],
        thumbnail: "https://images.unsplash.com/photo-1577401132019-40a89ada56e7?w=800&auto=format&fit=crop&q=60"
    },
    // Action & Adventure Games
    {
        id: "crossy-road",
        title: "Crossy Road Web",
        url: "https://poki.com/en/g/crossy-road",
        description: "Hop across the road without getting squashed!",
        energy: "high",
        moods: ["happy", "energized"],
        thumbnail: "https://images.unsplash.com/photo-1551885209-d8b9c47a9b8a?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "dino-run",
        title: "Dinosaur Game",
        url: "https://chromedino.com/",
        description: "Classic Chrome dinosaur runner game with simple controls.",
        energy: "medium",
        moods: ["energized", "happy"],
        thumbnail: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "geometry-dash",
        title: "Geometry Dash",
        url: "https://www.geometrydash.com/",
        description: "Jump and fly through obstacles in this rhythm-based platformer.",
        energy: "high",
        moods: ["energized", "happy", "pumped"],
        thumbnail: "https://images.unsplash.com/photo-1535371557131-206a148b63cb?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "tank-trouble",
        title: "Tank Trouble",
        url: "https://www.tanktrouble.com/",
        description: "Navigate mazes and destroy enemy tanks in this classic game.",
        energy: "high",
        moods: ["energized", "competitive", "happy"],
        thumbnail: "https://images.unsplash.com/photo-1552048558-2b0db5a4da93?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "slither-io",
        title: "Slither.io",
        url: "https://slither.io/",
        description: "Grow your snake by consuming glowing pellets while avoiding others.",
        energy: "high",
        moods: ["happy", "energized", "competitive"],
        thumbnail: "https://images.unsplash.com/photo-1599923453022-874e16a63ee6?w=800&auto=format&fit=crop&q=60"
    },
    // Relaxing & Mindful Games
    {
        id: "threes",
        title: "Threes!",
        url: "https://threesjs.com/",
        description: "A beautiful puzzle game about combining numbers thoughtfully.",
        energy: "low",
        moods: ["calm", "tired", "peaceful"],
        thumbnail: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "chess",
        title: "Free Online Chess",
        url: "https://www.chess.com/play/online",
        description: "Play chess against the computer or other players. A game of strategy and patience.",
        energy: "low",
        moods: ["focused", "calm", "thoughtful"],
        thumbnail: "https://images.unsplash.com/photo-1586165368502-881b72b27e58?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "minilingo",
        title: "Language Boost",
        url: "https://www.duolingo.com/",
        description: "Learn while you play with fun language games.",
        energy: "medium",
        moods: ["calm", "focus", "productive"],
        thumbnail: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "color-match",
        title: "Candy Crush Saga",
        url: "https://www.kingdomgreatestshow.com/",
        description: "Match colorful candies in this addictive puzzle game.",
        energy: "medium",
        moods: ["bored", "calm", "happy"],
        thumbnail: "https://images.unsplash.com/photo-1578432287150-fd5f3c3d09da?w=800&auto=format&fit=crop&q=60"
    },
    // Casual & Fun Games
    {
        id: "cookie-clicker",
        title: "Cookie Clicker",
        url: "https://orteil.dashnet.org/cookieclicker/",
        description: "Click cookies and build an empire. A simple but addictive idle game.",
        energy: "low",
        moods: ["bored", "relaxed", "happy"],
        thumbnail: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "wordle",
        title: "Wordle",
        url: "https://www.nytimes.com/games/wordle/index.html",
        description: "Guess the word in 6 tries. A daily puzzle game for word lovers.",
        energy: "medium",
        moods: ["focused", "calm", "productive"],
        thumbnail: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "minesweeper",
        title: "Minesweeper",
        url: "https://www.minesweeper.online/",
        description: "Uncover the board without hitting any mines. Test your logic and luck.",
        energy: "medium",
        moods: ["focus", "calm", "thoughtful"],
        thumbnail: "https://images.unsplash.com/photo-1551632786-de41ec16aWeChat?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "connect-four",
        title: "Connect Four",
        url: "https://www.mathsisfun.com/games/connect4.html",
        description: "Get four in a row before your opponent does. A classic strategy game.",
        energy: "low",
        moods: ["focused", "calm", "competitive"],
        thumbnail: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "2048-variants",
        title: "2048 Variants",
        url: "https://yaumkamper.github.io/2048-variants-web/",
        description: "Explore creative variations of the 2048 puzzle game.",
        energy: "low",
        moods: ["calm", "bored", "relaxed"],
        thumbnail: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&auto=format&fit=crop&q=60"
    }
];

// Outfits database with images
const OUTFITS_DATABASE = {
    happy: [
        {
            id: "happy-1",
            style: "Sunny Day Vibes",
            description: "Light, airy, and full of sunshine.",
            imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=60",
            moods: ["happy", "relax", "calm"]
        },
        {
            id: "happy-2",
            style: "Casual Chic",
            description: "Bright colors and comfortable fabrics to match your radiant vibe.",
            imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=60",
            moods: ["happy", "energized", "confident"]
        },
        {
            id: "happy-3",
            style: "Bold & Colorful",
            description: "Stand out with vibrant patterns and bold prints.",
            imageUrl: "https://images.unsplash.com/photo-1495562569060-2b4ca122e051?w=800&auto=format&fit=crop&q=60",
            moods: ["happy", "energized", "fun"]
        }
    ],
    energized: [
        {
            id: "energized-1",
            style: "Active Wear",
            description: "Ready for action. Functional and stylish.",
            imageUrl: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&auto=format&fit=crop&q=60",
            moods: ["energized", "focus", "happy"]
        },
        {
            id: "energized-2",
            style: "Athleisure Power",
            description: "Sporty meets fashionable for a dynamic look.",
            imageUrl: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop&q=60",
            moods: ["energized", "motivated", "active"]
        },
        {
            id: "energized-3",
            style: "Street Style Energy",
            description: "Bold street fashion that matches your energy.",
            imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=60",
            moods: ["energized", "confident", "focused"]
        }
    ],
    tired: [
        {
            id: "tired-1",
            style: "Cozy Comfort",
            description: "Soft textures and relaxed fit for ultimate comfort.",
            imageUrl: "https://images.unsplash.com/photo-1552062407-5b8b62e2b006?w=800&auto=format&fit=crop&q=60",
            moods: ["tired", "relax", "calm"]
        },
        {
            id: "tired-2",
            style: "Loungewear Dreams",
            description: "Oversized and snuggly, perfect for rest days.",
            imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=60",
            moods: ["tired", "comfortable", "peaceful"]
        },
        {
            id: "tired-3",
            style: "Relaxed Elegance",
            description: "Comfortable yet put-together for low-energy days.",
            imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60",
            moods: ["tired", "calm", "cozy"]
        }
    ],
    calm: [
        {
            id: "calm-1",
            style: "Neutral Zen",
            description: "Peaceful neutrals and flowing silhouettes.",
            imageUrl: "https://images.unsplash.com/photo-1564496174161-7a46d19cd819?w=800&auto=format&fit=crop&q=60",
            moods: ["calm", "peaceful", "serene"]
        },
        {
            id: "calm-2",
            style: "Minimalist Grace",
            description: "Simple, clean lines that soothe the soul.",
            imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
            moods: ["calm", "focused", "peaceful"]
        },
        {
            id: "calm-3",
            style: "Soft & Serene",
            description: "Muted tones and gentle fabrics for tranquility.",
            imageUrl: "https://images.unsplash.com/photo-1506629082632-50f5b3acf84b?w=800&auto=format&fit=crop&q=60",
            moods: ["calm", "relaxed", "meditative"]
        }
    ],
    anxious: [
        {
            id: "anxious-1",
            style: "Grounding Comfort",
            description: "Soft and familiar pieces that feel like a hug.",
            imageUrl: "https://images.unsplash.com/photo-1488932359169-6e4ee5745b45?w=800&auto=format&fit=crop&q=60",
            moods: ["anxious", "comforted", "safe"]
        },
        {
            id: "anxious-2",
            style: "Secure Layers",
            description: "Layered pieces that provide comfort and security.",
            imageUrl: "https://images.unsplash.com/photo-1515759371602-8c4e8d8d8d8d?w=800&auto=format&fit=crop&q=60",
            moods: ["anxious", "protected", "calm"]
        },
        {
            id: "anxious-3",
            style: "Reassuring Embrace",
            description: "Cozy textures and favorite colors for reassurance.",
            imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=60",
            moods: ["anxious", "supported", "peaceful"]
        }
    ],
    sad: [
        {
            id: "sad-1",
            style: "Uplifting Warmth",
            description: "Warm tones and comforting layers for support.",
            imageUrl: "https://images.unsplash.com/photo-1515537495e0-f465e3b8a699?w=800&auto=format&fit=crop&q=60",
            moods: ["sad", "comforted", "hopeful"]
        },
        {
            id: "sad-2",
            style: "Feel-Good Fashion",
            description: "Colors that lift your spirits and brighten your day.",
            imageUrl: "https://images.unsplash.com/photo-1539533057440-7814a65d4c17?w=800&auto=format&fit=crop&q=60",
            moods: ["sad", "uplifted", "joyful"]
        },
        {
            id: "sad-3",
            style: "Self-Care Style",
            description: "Gentle, supportive pieces for when you need kindness.",
            imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e0c0?w=800&auto=format&fit=crop&q=60",
            moods: ["sad", "cared-for", "healing"]
        }
    ]
};

// Playlists database with Spotify IDs
const PLAYLISTS_DATABASE = {
    happy: [
        {
            id: "happy-1",
            spotifyId: "37i9dQZF1DX3rxVfyb1Uw9",
            title: "Mood Booster",
            description: "Get happy with today's dose of feel-good songs!",
            moods: ["happy", "energized", "uplift"]
        },
        {
            id: "happy-2",
            spotifyId: "37i9dQZF1DX4fpCWaHOned",
            title: "Confidence Boost",
            description: "You're on top of the world.",
            moods: ["confident", "happy", "focus"]
        },
        {
            id: "happy-3",
            spotifyId: "37i9dQZF1DX7gIoqq7P9Pg",
            title: "Good as Hell",
            description: "Feel amazing and confident with these uplifting tracks.",
            moods: ["happy", "confident", "empowered"]
        }
    ],
    energized: [
        {
            id: "energized-1",
            spotifyId: "37i9dQZF1DXb22RyAdL3J5",
            title: "Beast Mode",
            description: "High-energy workout beats to keep you moving.",
            moods: ["energized", "motivated", "active"]
        },
        {
            id: "energized-2",
            spotifyId: "37i9dQZF1DXdPec7aLTmlC",
            title: "Power Hour",
            description: "Pump-up music for maximum energy.",
            moods: ["energized", "focused", "powerful"]
        },
        {
            id: "energized-3",
            spotifyId: "37i9dQZF1DXdMGP7h8ijf0",
            title: "Cardio Club",
            description: "Fast-paced beats perfect for cardio and movement.",
            moods: ["energized", "active", "motivated"]
        }
    ],
    tired: [
        {
            id: "tired-1",
            spotifyId: "37i9dQZF1DWZhUJlQlxGFi",
            title: "Chill Lofi Beats",
            description: "Relaxing lo-fi hip-hop for rest and recovery.",
            moods: ["tired", "peaceful", "relaxed"]
        },
        {
            id: "tired-2",
            spotifyId: "37i9dQZF1DX7gIoqq7P9Pg",
            title: "Sleep Sounds",
            description: "Ambient sounds to help you rest and recharge.",
            moods: ["tired", "sleepy", "calm"]
        },
        {
            id: "tired-3",
            spotifyId: "37i9dQZF1DX1wAqNItJcJX",
            title: "Night Wind Down",
            description: "Mellow tracks for a peaceful evening.",
            moods: ["tired", "calm", "restful"]
        }
    ],
    calm: [
        {
            id: "calm-1",
            spotifyId: "37i9dQZF1DX1fMg7LSSX2g",
            title: "Peaceful Piano",
            description: "Serene piano music for meditation and focus.",
            moods: ["calm", "meditative", "peaceful"]
        },
        {
            id: "calm-2",
            spotifyId: "37i9dQZF1DX8FUigjlQcKu",
            title: "Nature Sounds",
            description: "Calming nature sounds and ambient music.",
            moods: ["calm", "relaxed", "grounded"]
        },
        {
            id: "calm-3",
            spotifyId: "37i9dQZF1DX3Amo9WHy5pD",
            title: "Zen Meditation",
            description: "Perfect for meditation, yoga, and relaxation.",
            moods: ["calm", "meditative", "serene"]
        }
    ],
    anxious: [
        {
            id: "anxious-1",
            spotifyId: "37i9dQZF1DX7gIoqq7P9Pg",
            title: "Anxiety Relief",
            description: "Calming music to ease worry and stress.",
            moods: ["anxious", "calm", "supported"]
        },
        {
            id: "anxious-2",
            spotifyId: "37i9dQZF1DX1fMg7LSSX2g",
            title: "Breathe Easy",
            description: "Gentle melodies to help you relax and breathe.",
            moods: ["anxious", "relaxed", "grounded"]
        },
        {
            id: "anxious-3",
            spotifyId: "37i9dQZF1DX5J7mkh3e3Th",
            title: "Calm Mind",
            description: "Soothing music for anxious moments.",
            moods: ["anxious", "peaceful", "safe"]
        }
    ],
    sad: [
        {
            id: "sad-1",
            spotifyId: "37i9dQZF1DX4a8epQlUGRV",
            title: "Feel Good Songs",
            description: "Uplifting music to brighten your day.",
            moods: ["sad", "uplifted", "hopeful"]
        },
        {
            id: "sad-2",
            spotifyId: "37i9dQZF1DWWQRwUI0ExYD",
            title: "Happy Hits",
            description: "Joyful songs to lift your mood.",
            moods: ["sad", "joyful", "inspired"]
        },
        {
            id: "sad-3",
            spotifyId: "37i9dQZF1DX7KNlDXK8FDY",
            title: "Healing Vibes",
            description: "Emotional and healing music for reflection.",
            moods: ["sad", "healing", "supported"]
        }
    ]
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
        .slice(0, 5)
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
  try {
    res.status(200).json({ status: 'ok', message: 'Health check passed' });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/mood', (req, res) => {
  try {
    const { method, data } = req.body;
    
    if (!method || !data) {
      return res.status(400).json({ message: 'Method and data are required' });
    }

    // Analyze mood
    const result = analyzeMood(method, data);
    const mood = result.mood;
    const confidence = result.confidence;

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
    res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
});

app.get('/api/mood/history', (req, res) => {
  try {
    return res.status(200).json([]);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch mood history' });
  }
});

// Journal hardcoded questions and answers database
const JOURNAL_Q_AND_A = [
  {
    id: 1,
    question: "What made you smile today?",
    sampleAnswer: "Spending time with my best friend laughing over coffee made me feel truly connected and happy.",
    mood: "happy"
  },
  {
    id: 2,
    question: "What are you grateful for right now?",
    sampleAnswer: "I'm grateful for my health, my supportive family, and the opportunity to pursue my dreams.",
    mood: "calm"
  },
  {
    id: 3,
    question: "What challenge did you overcome today?",
    sampleAnswer: "I finally finished that difficult project I've been procrastinating on. It feels amazing to accomplish it!",
    mood: "energized"
  },
  {
    id: 4,
    question: "What would make tomorrow better?",
    sampleAnswer: "Getting good sleep tonight and starting fresh with a positive mindset would make tomorrow much better.",
    mood: "tired"
  },
  {
    id: 5,
    question: "What are you worried about?",
    sampleAnswer: "I'm concerned about the upcoming presentation, but I've prepared well and I know I can do this.",
    mood: "anxious"
  },
  {
    id: 6,
    question: "How are you feeling right now?",
    sampleAnswer: "I'm feeling a bit down, but I know this is temporary. I'm taking things one step at a time.",
    mood: "sad"
  },
  {
    id: 7,
    question: "What did you learn today?",
    sampleAnswer: "I learned that it's okay to ask for help, and that vulnerability is actually a strength.",
    mood: "calm"
  },
  {
    id: 8,
    question: "What are you proud of?",
    sampleAnswer: "I'm proud of myself for staying consistent with my goals and not giving up when things got tough.",
    mood: "energized"
  },
  {
    id: 9,
    question: "What brought you peace today?",
    sampleAnswer: "Taking a walk in nature and listening to my favorite music helped calm my mind.",
    mood: "calm"
  },
  {
    id: 10,
    question: "What are your hopes for tomorrow?",
    sampleAnswer: "I hope tomorrow brings new opportunities, good conversations, and moments of joy.",
    mood: "happy"
  }
];

// Journal entries GET endpoint
app.get('/api/journal', (req, res) => {
  try {
    // Return hardcoded journal entries
    const entries = [
      {
        id: 1,
        content: "Had an amazing day at work! Completed my biggest project.",
        mood: "happy",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        summary: "Productive day at work"
      },
      {
        id: 2,
        content: "Feeling a bit overwhelmed with everything going on. Need to take a step back.",
        mood: "anxious",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        summary: "Feeling overwhelmed"
      },
      {
        id: 3,
        content: "Had a great workout and feel energized. Starting to feel like myself again.",
        mood: "energized",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        summary: "Workout and energy boost"
      }
    ];
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch journal entries', error: String(error) });
  }
});

// Journal questions GET endpoint
app.get('/api/journal/questions', (req, res) => {
  try {
    res.status(200).json(JOURNAL_Q_AND_A);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch questions', error: String(error) });
  }
});

// Journal chat POST endpoint
app.post('/api/journal/chat', (req, res) => {
  try {
    const { message, mood } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Return an encouraging response based on mood
    const moodResponses: any = {
      happy: "That sounds wonderful! Keep spreading that joy and positive energy! 🌟",
      energized: "Your energy is contagious! Keep channeling that motivation into great things! ⚡",
      tired: "It's okay to rest and recharge. You deserve some peace and relaxation. 💤",
      calm: "Beautiful. Take a moment to appreciate this peace you've found. You're doing great. 🧘",
      anxious: "It's okay to feel worried sometimes. Remember to breathe and take things one step at a time. You've got this. 💙",
      sad: "I hear you. It's important to acknowledge your feelings. Remember, this is temporary, and you're stronger than you think. 💛"
    };

    const response = moodResponses[mood?.toLowerCase()] || "Thank you for sharing. Your feelings matter and are valid. 💜";

    res.status(200).json({
      message: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process journal entry', error: String(error) });
  }
});

// Default 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found', path: req.path });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  res.status(500).json({ message: 'Internal server error', error: String(err.message) });
});

export default app;
