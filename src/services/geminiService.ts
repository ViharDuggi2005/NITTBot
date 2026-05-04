import { GoogleGenAI } from "@google/genai";
import nittDataset from "../data/dataset.json";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Convert dataset to string for prompt context
const NITT_CONTEXT = nittDataset.map(item => `Q: ${item.question}\nA: ${item.answer}`).join("\n\n");

export const chatWithGemini = async (message: string, history: { role: string; content: string }[]) => {
  const result = await ai.models.generateContent({ 
    model: "gemini-3-flash-preview",
    contents: [
      ...history.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      })),
      { role: "user", parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: `You are the official NITT Assistant. Use the provided context to answer questions accurately.
      CONTEXT:
      ${NITT_CONTEXT}
      
      If the answer isn't in the context, use your general knowledge about NIT Trichy but stay professional. 
      Refer users to nitt.edu for critical details. Speak in a helpful and welcoming tone.`
    }
  });

  return result.text || "I'm sorry, I couldn't generate a response.";
};
