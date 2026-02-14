
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.0-flash" }) : null;

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


export async function conductJournalingSession(message: string, history: { role: "user" | "model", parts: string }[]): Promise<{ response: string, entry?: { content: string, mood: string, summary: string } }> {
  if (!genAI) {
    console.log("Gemini API key not found. Returning mock response.");
    return { response: "I'm listening. Tell me more about your day." };
  }

  try {
    const chatModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = `
      You are an empathetic AI Journaling Assistant. Your goal is to help the user reflect on their day and feelings.
      1. Ask one thoughtful question at a time.
      2. Be supportive and non-judgmental.
      3. After about 3-4 exchanges, or if the user says they are done, ask if they would like to save this as a journal entry.
      4. If the user agrees to save or finish, produce a JSON object (and ONLY a JSON object) at the END of your response containing:
         { "saved_entry": { "content": "Full summary of the conversation in first person perspective (as if the user wrote it)", "mood": "Dominant mood", "summary": "One sentence title/summary" } }
      5. Until then, just converse naturally.
    `;

    // Inject system prompt into history or as the first message if possible, 
    // but for simple chat history we can just prepend it to the context implicitly via the first model message logic 
    // or just rely on the model understanding the context from the flow if we could send a system instruction.
    // Gemini API supports systemInstruction.

    const chat = chatModel.startChat({
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.parts }]
      })),
      systemInstruction: {
        role: "system",
        parts: [{ text: systemPrompt }]
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    let text = response.text();

    // Check for JSON at the end
    const jsonMatch = text.match(/\{[\s\S]*"saved_entry"[\s\S]*\}/);
    let entry = undefined;

    if (jsonMatch) {
      try {
        const json = JSON.parse(jsonMatch[0]);
        entry = json.saved_entry;
        // Remove the JSON from the user-facing response
        text = text.replace(jsonMatch[0], "I've saved that to your journal. Is there anything else on your mind?");
      } catch (e) {
        console.error("Failed to parse journal entry JSON", e);
      }
    }

    return { response: text, entry };
  } catch (error: any) {
    console.error("Gemini Journaling Error Details:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2)); // Use Object.getOwnPropertyNames to get non-enumerable properties
    console.error("Error Message:", error.message);
    console.error(error.stack);

    if (error.status === 429 || error.message?.includes("429") || error.message?.includes("quota")) {
      return { response: "I'm receiving too many messages right now. Please give me a moment to catch up!" };
    }
    return { response: "I'm having trouble connecting right now, but I'm here for you." };
  }
}
