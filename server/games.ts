import { Game } from "@shared/schema";

// Curated list of embeddable HTML5 games
// Sources: Open source repos, permissive embed hosts (e.g. itch.io iframes, independent devs)
// Note: In a real production app, this would be a database or external API.
const GAMES_DATABASE: Game[] = [
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
        id: "wordle",
        title: "Wordle",
        url: "https://www.nytimes.com/games/wordle/index.html",
        description: "Guess the word in 6 tries. A daily puzzle game for word lovers.",
        energy: "medium",
        moods: ["focused", "calm", "productive"],
        thumbnail: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "color-match",
        title: "Match 3 Puzzle",
        url: "https://www.kingdomgreatestshow.com/",
        description: "Match colorful tiles in this addictive puzzle game.",
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
        id: "quick-draw",
        title: "Quick, Draw!",
        url: "https://quickdraw.withgoogle.com/",
        description: "Can a neural network recognize your doodling? Creative and fun.",
        energy: "medium",
        moods: ["happy", "creative", "bored"],
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "minesweeper",
        title: "Minesweeper",
        url: "https://www.minesweeper.online/",
        description: "Uncover the board without hitting any mines. Test your logic and luck.",
        energy: "medium",
        moods: ["focus", "calm", "thoughtful"],
        thumbnail: "https://images.unsplash.com/photo-1551632786-de41ec16afc5?w=800&auto=format&fit=crop&q=60"
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
        id: "little-alchemy",
        title: "Little Alchemy 2",
        url: "https://littlealchemy2.com/",
        description: "Mix elements to create the world. Explore and discover endless combinations.",
        energy: "low",
        moods: ["calm", "curious", "bored"],
        thumbnail: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&auto=format&fit=crop&q=60"
    }
];

export function getRecommendedGames(mood: string, energy: "low" | "medium" | "high", intent: string): Game[] {
    // Simple scoring algorithm
    const scoredGames = GAMES_DATABASE.map(game => {
        let score = 0;

        // Match mood
        if (game.moods.includes(mood.toLowerCase())) score += 5;

        // Match energy (exact match is best, near match is okay)
        if (game.energy === energy) score += 3;
        else if (
            (energy === 'medium' && (game.energy === 'low' || game.energy === 'high')) ||
            (energy === 'high' && game.energy === 'medium') ||
            (energy === 'low' && game.energy === 'medium')
        ) score += 1;

        // Random jitter to keep it fresh
        score += Math.random();

        return { game, score };
    });

    // Sort by score and return top 5
    return scoredGames
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(item => item.game);
}
