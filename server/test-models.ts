
import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API KEY");
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // There isn't a direct listModels method on the client instance in some versions, 
        // but let's try to just generate content with a known fallback or valid one.
        // Actually, usually we can just try one.
        console.log("Testing gemini-1.5-flash...");
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-1.5-flash");
    } catch (e: any) {
        console.error("Failed gemini-1.5-flash:", e.message);
    }

    try {
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log("Testing gemini-pro...");
        const result = await modelPro.generateContent("Hello");
        console.log("Success with gemini-pro");
    } catch (e: any) {
        console.error("Failed gemini-pro:", e.message);
    }
}

listModels();
