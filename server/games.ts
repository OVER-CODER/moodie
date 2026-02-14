import { Game } from "@shared/schema";

// Curated list of embeddable HTML5 games
// Sources: Open source repos, permissive embed hosts (e.g. itch.io iframes, independent devs)
// Note: In a real production app, this would be a database or external API.
const GAMES_DATABASE: Game[] = [
    // LOW ENERGY / RELAX / ANXIOUS
    {
        id: "2048",
        title: "2048",
        url: "https://play2048.co/",
        description: "Join the numbers and get to the 2048 tile! A calming puzzle game.",
        energy: "low",
        moods: ["anxious", "tired", "bored", "calm"],
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/2048_logo.svg/1200px-2048_logo.svg.png"
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
        id: "solitaire",
        title: "Solitaire",
        url: "https://www.google.com/logos/fnbx/solitaire/standalone.html",
        description: "Classic Solitaire. Perfect for organizing your thoughts.",
        energy: "low",
        moods: ["tired", "bored", "sad"],
    },

    // HIGH ENERGY / UPLIFT / HAPPY
    {
        id: "crossy-road",
        title: "Crossy Road Web",
        url: "https://poki.com/en/g/crossy-road", // Poki allows embedding
        description: "Hop across the road without getting squashed!",
        energy: "high",
        moods: ["happy", "energized", "romance"],
    },
    {
        id: "dino-run",
        title: "Dino Run",
        url: "https://chromedino.com/",
        description: "Run, Dino, Run! A simple reflex game.",
        energy: "medium",
        moods: ["energized", "happy", "distract"],
    },

    // MEDIUM ENERGY / FOCUS / STRESSED
    {
        id: "sudoku",
        title: "Sudoku",
        url: "https://sudoku.com/expert/", // Example, might need a cleaner embed
        description: "Focus your mind with numbers.",
        energy: "medium",
        moods: ["stressed", "focus", "anxious"],
    },
    {
        id: "quick-draw",
        title: "Quick, Draw!",
        url: "https://quickdraw.withgoogle.com/",
        description: "Can a neural network recognize your doodling?",
        energy: "medium",
        moods: ["happy", "creative", "bored"],
    },
    {
        id: "little-alchemy",
        title: "Little Alchemy 2",
        url: "https://littlealchemy2.com/",
        description: "Mix elements to create the world.",
        energy: "low",
        moods: ["calm", "curious", "bored"]
    },
    {
        id: "wordle-unlimited",
        title: "Wordle Unlimited",
        url: "https://wordleunlimited.org/",
        description: "Guess the hidden word in 6 tries.",
        energy: "medium",
        moods: ["focus", "calm", "smart"],
    },
    {
        id: "slither",
        title: "Slither.io",
        url: "https://slither.io/",
        description: "Grow your snake and avoid others.",
        energy: "medium",
        moods: ["bored", "anxious", "distract"],
    },
    {
        id: "cookie-clicker",
        title: "Cookie Clicker",
        url: "https://orteil.dashnet.org/cookieclicker/",
        description: "Bake billions of cookies.",
        energy: "low",
        moods: ["tired", "bored", "relax"],
    },
    {
        id: "space-waves",
        title: "Space Waves",
        url: "https://poki.com/en/g/space-waves",
        description: "Control the wave and avoid obstacles.",
        energy: "high",
        moods: ["energized", "stressed", "focus"],
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
