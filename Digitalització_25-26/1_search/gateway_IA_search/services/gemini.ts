import { GoogleGenAI } from '@google/genai';
import { AIService, ChatMessage } from '../types';

export const geminiService: AIService = {
  name: "Google Gemini",
  async chat(messages: ChatMessage[]) {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // IMPORTANTE: Mapeamos los mensajes para que Gemini distinga entre 
    // las instrucciones del sistema (model) y el usuario (user).
    const formattedContent = messages.map(m => ({
      role: m.role === 'system' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedContent, // <--- Pasamos todo el array formateado
      generationConfig: { 
        temperature: 0.1,
        maxOutputTokens: 1000 
      }
    });

    return (async function* () {
      yield response.text || "No pude generar una recomendación.";
    })();
  }
};