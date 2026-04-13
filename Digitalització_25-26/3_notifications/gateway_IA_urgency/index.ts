import express, { Request, Response } from 'express';
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
app.use(express.json());

// --- CONFIGURACIÓN MONGODB ---
const client = new MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017/polideportivo');
const db = client.db();
const pendingCollection = db.collection('pending_notifications');
const historyCollection = db.collection('history');

// Conexión inicial
client.connect().then(() => console.log("🍃 MongoDB Conectado"));

const services: AIService[] = [groqService, cerebrasService, openRouterService, geminiService, mistralService, cohereService];
let currentServiceIndex = 0;
const blacklist = new Set<string>();

// Función auxiliar para rotar servicios
function getNextService() {
  const service = services[currentServiceIndex];
  currentServiceIndex = (currentServiceIndex + 1) % services.length;
  return service;
}

// --- LOGICA PRINCIPAL ---
app.post('/enqueue-notification', async (req: Request, res: Response) => {
  const { task_description, data, channels, tone } = req.body;

  if (!task_description || !channels) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (task_description, channels)' });
  }

  try {
    // 1. DETERMINAR URGENCIA (Usamos un servicio de IA rápido para esto)
    const analystService = services[0]; // Usamos Groq por su velocidad para análisis
    const urgencyPrompt: ChatMessage[] = [{
      role: 'user',
      content: `Analiza la siguiente tarea de notificación y responde ÚNICAMENTE con una palabra (BAJA, MEDIA, ALTA, CRITICA) según su urgencia: "${task_description}"`
    }];

    const urgencyStream = await analystService.chat(urgencyPrompt);
    let urgency = "";
    for await (const chunk of urgencyStream) urgency += chunk;
    urgency = urgency.trim().toUpperCase().replace(/[^A-Z]/g, '');

    // 2. GUARDAR EN DB COMO PENDIENTE
    const newNotification = {
      status: "pending",
      channels: Array.isArray(channels) ? channels : [channels], // ["Email", "WhatsApp", etc]
      tone: tone || "Profesional",
      urgency: urgency || "MEDIA",
      task_description,
      data: data || {},
      created_at: new Date()
    };

    const result = await pendingCollection.insertOne(newNotification);

    res.json({
      message: "Notificación encolada",
      id: result.insertedId,
      detected_urgency: urgency
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/process-next', async (req: Request, res: Response) => {
  try {
    // 1. Obtener la tarea pendiente más antigua
    const task = await pendingCollection.findOne({ status: 'pending' }, { sort: { created_at: 1 } });

    if (!task) {
      return res.json({ message: "No hay notificaciones pendientes en la cola." });
    }

    console.log(`\n🔔 PROCESANDO TAREA: "${task.task_description}" (Urgencia: ${task.urgency})`);
    const results = [];

    // 2. Iterar sobre cada canal solicitado
    for (const channel of task.channels) {
      // Rotamos el servicio para cada canal
      const generatorService = getNextService();
      
      // Saltar si está en blacklist (opcional, podrías reintentar con otro aquí)
      if (blacklist.has(generatorService.name)) {
        console.log(`⏩ Saltando ${generatorService.name} para el canal ${channel} por estar en cuarentena.`);
        continue;
      }

      console.log(`🤖 Generando mensaje para [${channel}] usando [${generatorService.name}]...`);

      const systemPrompt = `Eres un Agente del Polideportivo Municipal. 
        Genera el contenido para una notificación de ${channel}.
        Tono: ${task.tone}. Urgencia: ${task.urgency}.
        Reglas específicas de canal:
        - WhatsApp: Usa negritas (*texto*) y muchos emojis.
        - Email: Incluye un 'Asunto:' y un cuerpo formal.
        - SMS: Sé extremadamente breve (máximo 160 caracteres).
        - Push: Usa un título corto y un mensaje motivador.`;

      const userPrompt = `Tarea: ${task.task_description}. Datos: ${JSON.stringify(task.data)}`;

      // Llamada al servicio de IA
      const stream = await generatorService.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      let generatedMessage = "";
      for await (const chunk of stream) {
        generatedMessage += chunk;
      }

      // 3. SIMULACIÓN DE ENVÍO POR CONSOLA
      console.log(`--------------------------------------------------`);
      console.log(`✉️ ENVIANDO A [${channel.toUpperCase()}]`);
      console.log(`PROVIDER: ${generatorService.name}`);
      console.log(`CONTENIDO:\n${generatedMessage}`);
      console.log(`--------------------------------------------------`);

      results.push({
        channel,
        provider: generatorService.name,
        message: generatedMessage
      });
    }

    // 4. GUARDAR RESULTADOS Y ACTUALIZAR ESTADO
    await historyCollection.insertOne({
      taskId: task._id,
      task_description: task.task_description,
      processed_at: new Date(),
      deliveries: results
    });

    await pendingCollection.updateOne(
      { _id: task._id },
      { $set: { status: 'processed', processed_at: new Date() } }
    );

    res.json({
      message: "Procesamiento multicanal completado",
      task: task.task_description,
      urgency: task.urgency,
      details: results
    });

  } catch (error: any) {
    console.error("❌ Error procesando cola:", error.message);
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
