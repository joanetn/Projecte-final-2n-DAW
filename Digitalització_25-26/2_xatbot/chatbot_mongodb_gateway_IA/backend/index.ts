import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { groqService } from './services/groq';
import { cerebrasService } from './services/cerebras';
import { openRouterService } from './services/openrouter';
import { geminiService } from './services/gemini';
import { mistralService } from './services/mistral';
import { cohereService } from './services/cohere';
import { AIService, ChatMessage } from './types';

const app = express();
app.use(cors({ exposedHeaders: ['x-provider'] }));
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017/polideportivo');
const db = client.db();
const historyCollection = db.collection('chat_history');

const services: AIService[] = [
  groqService, cerebrasService, openRouterService, 
  geminiService, mistralService, cohereService
];
let currentServiceIndex = 0;
const blacklist = new Set<string>();

async function handleChatRequest(messages: ChatMessage[], res: Response, userId: string, attempts = 0): Promise<void> {
  // Si hemos agotado los servicios, enviamos error SOLO si no hemos empezado a escribir
  if (attempts >= services.length) {
    if (!res.headersSent) {
      res.status(503).json({ error: 'Todos los proveedores fallaron.' });
    } else {
      res.write("\n[Error: Todos los proveedores fallaron durante la generación]");
      res.end();
    }
    return;
  }

  const service = services[currentServiceIndex];
  currentServiceIndex = (currentServiceIndex + 1) % services.length;

  try {
    const stream = await service.chat(messages);

    // Solo configuramos cabeceras en el primer intento exitoso
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('x-provider', service.name);
    }

    let fullAIResponse = "";
    for await (const chunk of stream) {
      fullAIResponse += chunk;
      res.write(chunk);
    }

    // Guardar en DB al terminar con éxito
    const lastUserMsg = messages[messages.length - 1].content;
    await historyCollection.insertMany([
      { userId, role: 'user', content: lastUserMsg, timestamp: new Date() },
      { userId, role: 'assistant', content: fullAIResponse, timestamp: new Date(), provider: service.name }
    ]);

    res.end();
  } catch (error: any) {
    console.error(`❌ Fallo en ${service.name}:`, error.message);
    // Recursión para probar el siguiente servicio
    return handleChatRequest(messages, res, userId, attempts + 1);
  }
}

app.post('/chat', async (req: Request, res: Response) => {
  const { messages, userId } = req.body;
  if (!userId || !messages) return res.status(400).json({ error: "Faltan datos" });
  
  // Limpiamos los mensajes para asegurar que solo tengan 'role' y 'content'
  // Algunos proveedores fallan si ven campos extras de MongoDB como _id o timestamp
  const sanitizedMessages = messages.map((m: any) => ({
    role: m.role,
    content: m.content
  }));

  await handleChatRequest(sanitizedMessages, res, userId);
});

app.get("/history/:userId", async (req: Request, res: Response) => {
  try {
    const messages = await historyCollection
      .find({ userId: req.params.userId })
      .sort({ timestamp: 1 })
      .toArray();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo historial." });
  }
});

app.get('/status', async (req, res) => {
  const statusReport = [];

  for (const service of services) {
    const start = Date.now();
    try {
      // Hacemos una prueba ultra rápida a cada uno
      const stream = await service.chat([{ role: 'user', content: 'ping' }]);
      const reader = stream[Symbol.asyncIterator]();
      await reader.next(); // Solo verificamos que empiece a responder

      blacklist.delete(service.name);
      statusReport.push({
        provider: service.name,
        status: '✅ ONLINE',
        latency: `${Date.now() - start}ms`,
        error: null
      });
    } catch (error: any) {
      blacklist.add(service.name);
      statusReport.push({
        provider: service.name,
        status: '❌ OFFLINE',
        latency: 'N/A',
        error: error.message?.substring(0, 50) + "..."
      });
    }
  }

  res.json({
    timestamp: new Date().toISOString(),
    total_providers: services.length,
    report: statusReport,
    active_blacklist: Array.from(blacklist)
  });
});


const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Backend listo en http://localhost:${PORT}`));