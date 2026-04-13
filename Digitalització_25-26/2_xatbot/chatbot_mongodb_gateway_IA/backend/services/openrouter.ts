import OpenAI from "openai";
import { AIService, ChatMessage } from "../types";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const openRouterService: AIService = {
  name: "OpenRouter (Claude)",
  async chat(messages: ChatMessage[]) {
    const response = await client.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
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
