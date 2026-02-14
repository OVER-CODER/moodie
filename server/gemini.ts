
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

interface MoodAnalysisResult {
  mood: string;
  confidence: number;
  recommendations: {
    outfit: string[];
    playlist: string; // Spotify playlist ID
    workout: string;
    food: string;
    affirmation: string;
    productivity: string;
  };
}

export async function analyzeMoodWithGemini(input: string, method: 'face' | 'self'): Promise<any | null> {
  if (!model) {
    console.warn("Gemini API key not found. Falling back to local analysis.");
    return null;
  }

  try {
    let prompt = "";
    // Note: 'face' method is effectively deprecated/removed by user request, 
    // but keeping logic safe incase we revert or reuse. Main path is 'self' (text).

    prompt = `
      Analyze the mood of a person based on this input: "${input}" (Method: ${method}).
      
      Return a JSON object with the following structure:
      {
        "mood": "calm" | "energized" | "happy" | "tired" | "anxious" | "bored" | "stressed" | "romantic" | "confident" | "sad",
        "energy": "low" | "medium" | "high",
        "intent": "relax" | "distract" | "focus" | "uplift" | "express",
        "confidence": number (0.0 to 1.0),
        "recommendations": {
          "outfit": ["string", "string", "string"],
          "playlist": "string" (a valid Spotify playlist ID, e.g., "37i9dQZF1DXcBWIGoYBM5M"),
          "workout": "string",
          "food": "string",
          "affirmation": "string",
          "productivity": "string"
        }
      }
      
      Ensure the playlist ID is real and popular for that mood.
      Analyze the input to determine the core mood, energy level, and user's intent.
      If the input is vague, make a best guess based on the tone.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up potential markdown code blocks
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonStr);

    return data;
  } catch (error) {
    console.error("Gemini API error:", error);
    return null;
  }
}
