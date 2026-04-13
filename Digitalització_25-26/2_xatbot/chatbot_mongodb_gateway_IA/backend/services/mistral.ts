import { AIService, ChatMessage } from "../types";

export const mistralService: AIService = {
  name: "Mistral AI",
  async chat(messages: ChatMessage[]) {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral-tiny",
        messages,
        stream: true,
      })
    });

    if (!response.ok) throw new Error(`Mistral error: ${response.statusText}`);

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    return (async function* () {
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const data = JSON.parse(line.substring(6));
              yield data.choices[0]?.delta?.content || "";
            } catch (e) { /* Ignorar errores de parseo de chunks parciales */ }
          }
        }
      }
    })();
  }
};