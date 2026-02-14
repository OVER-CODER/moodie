import { Recommendation, Mood } from "./schema";

export function analyzeMood(method: 'face' | 'self', data?: string): { mood: Mood, confidence: number } {
  // Simple heuristic for prototype
  if (method === 'self' && data) {
    const lower = data.toLowerCase();
    if (lower.includes('tired') || lower.includes('sleepy')) return { mood: 'tired', confidence: 0.85 };
    if (lower.includes('happy') || lower.includes('good')) return { mood: 'happy', confidence: 0.92 };
    if (lower.includes('anxious') || lower.includes('worried')) return { mood: 'anxious', confidence: 0.78 };
    if (lower.includes('excited') || lower.includes('energy')) return { mood: 'energized', confidence: 0.88 };
    return { mood: 'calm', confidence: 0.80 }; // Default
  }
  
  // For face, we'd use a real API, but for now we simulate
  return { mood: 'energized', confidence: 0.92 };
}

export function getRecommendations(mood: Mood): Recommendation {
  const mappings: Record<string, Recommendation> = {
    tired: {
      outfit: ['Comfy Hoodie', 'Soft Joggers'],
      playlist: '37i9dQZF1DWZqd5JICZI0u', // Peaceful Piano
      workout: 'Restorative Yoga',
      food: 'Warm Tea & Soup',
      affirmation: 'Rest is productive.',
      productivity: 'Low-focus tasks',
    },
    happy: {
      outfit: ['Bright Colors', 'Casual Jeans'],
      playlist: '37i9dQZF1DXdPec7aLTmlC', // Happy Hits
      workout: 'Dance Cardio',
      food: 'Fresh Fruit Salad',
      affirmation: 'Spread your joy.',
      productivity: 'Creative brainstorming',
    },
    anxious: {
      outfit: ['Loose Layers', 'Neutral Tones'],
      playlist: '37i9dQZF1DWV90KC6S8e1n', // Lo-Fi Beats
      workout: 'Walking Meditation',
      food: 'Comforting Pasta',
      affirmation: 'One step at a time.',
      productivity: 'Structured list-making',
    },
    energized: {
      outfit: ['Athleisure', 'Statement Sneakers'],
      playlist: '37i9dQZF1DX76Wlfdnj7AP', // Beast Mode
      workout: 'HIIT Session',
      food: 'Protein Bowl',
      affirmation: 'Conquer the day.',
      productivity: 'Deep work sprints',
    },
    calm: {
      outfit: ['Minimalist Basic', 'Earth Tones'],
      playlist: '37i9dQZF1DWZqd5JICZI0u', // Peaceful Piano
      workout: 'Pilates',
      food: 'Balanced Grain Bowl',
      affirmation: 'Peace comes from within.',
      productivity: 'Steady workflow',
    }
  };

  return mappings[mood] || mappings.calm;
}
