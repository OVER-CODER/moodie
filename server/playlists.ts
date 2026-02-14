import { Playlist } from "@shared/schema";

// Curated list of Spotify Playlists
// IDs are extracted from public Spotify playlist URLs
const PLAYLISTS_DATABASE: Playlist[] = [
    // HAPPY / UPLIFT / HIGH ENERGY
    {
        id: "mood-booster",
        spotifyId: "37i9dQZF1DX3rxVfyb1Uw9",
        title: "Mood Booster",
        description: "Get happy with today's dose of feel-good songs!",
        moods: ["happy", "energized", "uplift"]
    },
    {
        id: "confidence-boost",
        spotifyId: "37i9dQZF1DX4fpCWaHOned",
        title: "Confidence Boost",
        description: "You're on top of the world.",
        moods: ["confident", "happy", "focus"]
    },

    // TIRED / RELAX / LOW ENERGY
    {
        id: "peaceful-piano",
        spotifyId: "37i9dQZF1DWZqd5JICZI0u",
        title: "Peaceful Piano",
        description: "Relax and indulge with beautiful piano pieces.",
        moods: ["tired", "calm", "relax", "sad", "anxious"]
    },
    {
        id: "sleep-lofi",
        spotifyId: "37i9dQZF1DWWQRwui0ExPn",
        title: "Lo-Fi Sleep",
        description: "Beats to relax and fall asleep to.",
        moods: ["tired", "relax", "bored"]
    },

    // ENERGIZED / FOCUS / HIGH ENERGY
    {
        id: "beast-mode",
        spotifyId: "37i9dQZF1DX76Wlfdnj7AP",
        title: "Beast Mode",
        description: "Get pumped and ready for action.",
        moods: ["energized", "focus", "stressed"] // Stressed people might want to burn it off
    },
    {
        id: "deep-focus",
        spotifyId: "37i9dQZF1DWZeKCadgRdKQ",
        title: "Deep Focus",
        description: "Keep calm and focus with this ambient music.",
        moods: ["focus", "calm", "creative"]
    },

    // ANXIOUS / CALM / MEDIUM ENERGY
    {
        id: "stress-relief",
        spotifyId: "37i9dQZF1DWXE37t2klde0",
        title: "Stress Relief",
        description: "Calm your mind and soothe your soul.",
        moods: ["anxious", "stressed", "tired"]
    },
    {
        id: "lofi-beats",
        spotifyId: "37i9dQZF1DWV90KC6S8e1n",
        title: "Lofi Beats",
        description: "Beats to relax/study to.",
        moods: ["anxious", "bored", "calm", "focus"]
    }
];

export function getRecommendedPlaylists(mood: string): Playlist[] {
    const matched = PLAYLISTS_DATABASE.filter(p => p.moods.includes(mood.toLowerCase()));

    // Fallback logic
    if (matched.length === 0) {
        // Return generally popular ones
        return PLAYLISTS_DATABASE.filter(p => ["mood-booster", "lofi-beats", "peaceful-piano"].includes(p.id));
    }

    return matched.sort(() => 0.5 - Math.random()).slice(0, 4);
}
