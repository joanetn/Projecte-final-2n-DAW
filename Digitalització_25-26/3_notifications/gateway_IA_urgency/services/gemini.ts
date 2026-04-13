import { GoogleGenAI } from '@google/genai';
import { AIService, ChatMessage } from '../types';

export const geminiService: AIService = {
  name: "Google Gemini",
  async chat(messages: ChatMessage[]) {
    // 1. Inicialización Lazy con tu nueva librería
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // 2. Extraemos el último mensaje (o combinamos el historial)
    const lastPrompt = messages[messages.length - 1].content;

    // 3. Usamos tu modelo funcional 'gemini-2.5-flash'
    // Importante: Usamos el método con streaming para el balanceador
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: lastPrompt,
    });

    // 4. Adaptamos la respuesta al formato Generator que espera tu index.ts
    return (async function* () {
      // Como tu código original no usa stream: true, devolvemos el texto de golpe
      // pero dentro del formato generator para no romper el balanceador
      const text = response.text || "";
      yield text;
    })();
  }
};