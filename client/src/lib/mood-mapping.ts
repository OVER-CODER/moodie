import { Mood } from "@shared/schema";

export const MOOD_CONFIG: Record<string, { color: string; label: string; description: string }> = {
  calm: {
    color: "#A5D6A7",
    label: "Calm",
    description: "Serene and peaceful state of mind.",
  },
  energized: {
    color: "#FFD54F",
    label: "Energized",
    description: "High energy, ready to take on the world.",
  },
  anxious: {
    color: "#90CAF9", // Cool blue to soothe
    label: "Anxious",
    description: "Feeling a bit overwhelmed or uneasy.",
  },
  happy: {
    color: "#FFAB91",
    label: "Happy",
    description: "Joyful and content.",
  },
  tired: {
    color: "#B39DDB",
    label: "Tired",
    description: "Low energy, needing rest.",
  },
  neutral: {
    color: "#B0BEC5",
    label: "Neutral",
    description: "Balanced and steady.",
  },
};

export const getMoodColor = (mood: string) => MOOD_CONFIG[mood]?.color || "#B0BEC5";
