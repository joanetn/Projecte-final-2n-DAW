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
import { retrieveRelevantProducts } from './retriever'; 
import { initialProducts } from './products';
import { AIService, ChatMessage } from './types';

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const client = new MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017/gemini_products');
const db = client.db();
const productsCollection = db.collection('products');
const recommendationsCollection = db.collection('recommendations');

let currentServiceIndex = 0;
const services: AIService[] = [
  groqService, cerebrasService, openRouterService, 
  geminiService, mistralService, cohereService
];
const blacklist = new Set<string>();

/**
 * Inicializa la base de datos con los productos del archivo products.js
 */
async function cleanAndBootstrapDB() {
    try {
        console.log("🧹 Iniciando limpieza de base de datos...");
        await productsCollection.deleteMany({});
        await recommendationsCollection.deleteMany({});
        console.log("🗑️  Colecciones vaciadas.");

        if (initialProducts && initialProducts.length > 0) {
            await productsCollection.insertMany(initialProducts);
            console.log(`✅ ${initialProducts.length} productos cargados de forma limpia.`);
        }
    } catch (error) {
        console.error("❌ Error durante el reset de la DB:", error);
    }
}

/**
 * Lógica de balanceo de carga entre los 6 proveedores
 */
async function getAIRerecommendation(messages: ChatMessage[], attempts = 0): Promise<{text: string, provider: string}> {
    if (attempts >= services.length) throw new Error("Todos los proveedores de IA fallaron.");
    
    const service = services[currentServiceIndex];
    currentServiceIndex = (currentServiceIndex + 1) % services.length;

    try {
        const stream = await service.chat(messages);
        let fullText = "";
        for await (const chunk of stream) {
            fullText += chunk;
        }
        return { text: fullText, provider: service.name };
    } catch (error) {
        console.error(`❌ Fallo en ${service.name}, reintentando...`);
        return getAIRerecommendation(messages, attempts + 1);
    }
}

app.post('/api/recommend', async (req: Request, res: Response) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Falta el campo 'prompt' en el cuerpo de la petición." });
    }

    try {
        // 1. RAG: Recuperar productos relevantes usando la lógica del zip
        const allProducts = await productsCollection.find({}).toArray();
        const relevant = retrieveRelevantProducts(prompt, allProducts);

        // 2. Construir el System Prompt con el contexto de productos
        // const systemMsg = `Eres un experto asistente de ventas. 
        // Basándote ÚNICAMENTE en la siguiente lista de productos, recomienda las mejores opciones:
        // ${relevant.map(p => `- ${p.name} (${p.category}): ${p.description}. Precio: $${p.price}`).join("\n")}
        // Instrucciones:
        // - Si no hay productos que coincidan, dilo educadamente.
        // - Explica brevemente por qué recomiendas cada uno.`;

        const systemMsg = `
            Eres un experto en recomendación de productos. 
            Tu tarea es analizar la consulta del usuario y recomendar productos relevantes.

            ### Productos relevantes encontrados:
            ${relevant.map(p => `
            - Nombre: ${p.name}
            Categoría: ${p.category}
            Descripción: ${p.description}
            Precio: $${p.price}
            `).join("\n")}

            ### Instrucciones:
            - Explica por qué cada producto coincide con lo que el usuario necesita.
            - Si el usuario pide algo específico (ej: "para estudiar", "para regalar"), adapta la recomendación.
            - NO inventes productos que no están en la lista.
            - Si ningún producto es relevante, dilo explícitamente.

            ### Pregunta del usuario:
            "${prompt}"

            ### Respuesta:
            `;

        // 3. Obtener respuesta del pool de IA
        const { text, provider } = await getAIRerecommendation([
            { role: 'system', content: systemMsg },
            { role: 'user', content: prompt }
        ]);

        // 4. Guardar el resultado final en la colección de recomendaciones
        const resultDoc = {
            query: prompt,
            recommendation: text,
            provider: provider,
            products_suggested: relevant.map(p => p.name),
            date: new Date()
        };
        await recommendationsCollection.insertOne(resultDoc);

        // 5. Respuesta limpia para Postman
        res.json({
            success: true,
            provider_used: provider,
            recommendation: text,
            items_found: relevant.length
        });

    } catch (error: any) {
        console.error("Error en el proceso:", error);
        res.status(500).json({ error: error.message });
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

// Arrancar servidor
const PORT = 3000;
cleanAndBootstrapDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor RAG listo en http://localhost:${PORT}`);
    });
});
