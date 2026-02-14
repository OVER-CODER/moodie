import { Recommendation, Mood } from "./schema";

export function analyzeMood(method: 'face' | 'self', data?: string): { mood: Mood, confidence: number } {
  // Simple heuristic for prototype
  if (method === 'self' && data) {
    const lower = data.toLowerCase();
    if (lower.includes('tired') || lower.includes('sleepy') || lower.includes('exhausted') || lower.includes('drained')) return { mood: 'tired', confidence: 0.85 };
    if (lower.includes('happy') || lower.includes('good') || lower.includes('great') || lower.includes('joy') || lower.includes('awesome')) return { mood: 'happy', confidence: 0.92 };
    if (lower.includes('anxious') || lower.includes('worried') || lower.includes('stress') || lower.includes('nervous') || lower.includes('tense')) return { mood: 'anxious', confidence: 0.78 };
    if (lower.includes('excited') || lower.includes('energy') || lower.includes('pumped') || lower.includes('ready')) return { mood: 'energized', confidence: 0.88 };
    if (lower.includes('sad') || lower.includes('down') || lower.includes('depressed') || lower.includes('blue')) return { mood: 'tired', confidence: 0.80 }; // Map sad to tired/restful for now
    if (lower.includes('angry') || lower.includes('mad') || lower.includes('frustrated')) return { mood: 'anxious', confidence: 0.75 }; // Map angry to anxious/calming needed
    if (lower.includes('calm') || lower.includes('chill') || lower.includes('relax') || lower.includes('peace')) return { mood: 'calm', confidence: 0.90 };
    
    return { mood: 'calm', confidence: 0.60 }; // Default with lower confidence
  }
  
  // For face, we'd use a real API, but for now we simulate with randomization
  const moods: Mood[] = ['calm', 'energized', 'happy', 'tired', 'anxious'];
  const randomMood = moods[Math.floor(Math.random() * moods.length)];
  const randomConfidence = Number((0.7 + Math.random() * 0.25).toFixed(2)); // 0.70 - 0.95
  
  return { mood: randomMood, confidence: randomConfidence };
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
