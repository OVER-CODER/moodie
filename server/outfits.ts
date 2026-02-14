import { Outfit } from "@shared/schema";

// Curated list of outfit inspirations (using placeholder images for now that are reliable)
// In a real app, these would come from a CMS or product API.

// Data Source: Unsplash or similar free image source for mood/fashion

const OUTFITS_DATABASE: Outfit[] = [
    // HAPPY / UPLIFT / HIGH ENERGY
    {
        id: "happy-bright",
        imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=60",
        style: "Casual Chic",
        description: "Bright colors and comfortable fabrics to match your radiant vibe.",
        moods: ["happy", "energized", "confident"]
    },
    {
        id: "happy-summer",
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=60",
        style: "Summer Vibes",
        description: "Light, airy, and full of sunshine.",
        moods: ["happy", "relax", "calm"]
    },

    // TIRED / RELAX / LOW ENERGY
    {
        id: "cozy-sweats",
        imageUrl: "https://images.unsplash.com/photo-1515966097209-ec48f3216298?w=800&auto=format&fit=crop&q=60",
        style: "Maximum Comfort",
        description: "Soft textures and loose fits for when you need to recharge.",
        moods: ["tired", "bored", "calm", "sad"]
    },
    {
        id: "lounge-minimal",
        imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=60",
        style: "Minimalist Lounge",
        description: "Simple lines and neutral tones for a peaceful mind.",
        moods: ["tired", "calm", "anxious"]
    },

    // ENERGIZED / FOCUS / HIGH ENERGY
    {
        id: "sporty-active",
        imageUrl: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&auto=format&fit=crop&q=60",
        style: "Active Wear",
        description: "Ready for action. Functional and stylish.",
        moods: ["energized", "focus", "happy"]
    },
    {
        id: "sharp-focus",
        imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=60",
        style: "Sharp & Smart",
        description: "Clean cuts that say 'I mean business'.",
        moods: ["focus", "confident", "stressed"]
    },

    // ANXIOUS / CALM / MEDIUM ENERGY
    {
        id: "grounded-earth",
        imageUrl: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&auto=format&fit=crop&q=60",
        style: "Earthy & Grounded",
        description: "Connect with nature through textures and tones.",
        moods: ["anxious", "calm", "stressed"]
    },
    {
        id: "oversized-comfort",
        imageUrl: "https://images.unsplash.com/photo-1574655452496-e24dc5c90b6c?w=800&auto=format&fit=crop&q=60",
        style: "Safe Layers",
        description: "Layers to help you feel secure and wrapped up.",
        moods: ["anxious", "sad", "tired"]
    }
];

export function getRecommendedOutfits(mood: string): Outfit[] {
    const matched = OUTFITS_DATABASE.filter(o => o.moods.includes(mood.toLowerCase()));

    // Fallback: If no match, return random selection to avoid empty state
    if (matched.length === 0) {
        return [...OUTFITS_DATABASE].sort(() => 0.5 - Math.random()).slice(0, 3);
    }

    return matched.sort(() => 0.5 - Math.random()).slice(0, 5);
}
