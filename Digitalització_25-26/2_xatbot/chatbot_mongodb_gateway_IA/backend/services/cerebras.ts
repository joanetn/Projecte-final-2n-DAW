import OpenAI from "openai";
import { AIService, ChatMessage } from "../types";

const client = new OpenAI({
  apiKey: process.env.CEREBRAS_API_KEY,
  baseURL: "https://api.cerebras.ai/v1",
});

export const cerebrasService: AIService = {
  name: "Cerebras",
  async chat(messages: ChatMessage[]) {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b", // Modelo actualizado y potente
      messages: messages as any,
      stream: true,
    });

    return (async function* () {
      for await (const chunk of response) {
        yield chunk.choices[0]?.delta?.content || "";
      }
    })();
  }
};