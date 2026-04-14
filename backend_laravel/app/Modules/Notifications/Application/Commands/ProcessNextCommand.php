<?php

namespace App\Modules\Notifications\Application\Commands;

use App\Enums\NotifStatus;
use App\Modules\Notifications\Application\DTOs\ProcessNotificationResponseDTO;
use App\Modules\Notifications\Domain\Events\NotificationBroadcastedEvent;
use App\Modules\Notifications\Domain\Repositories\NotificationsRespositoryInterface;
use App\Services\IA\CerebrasService;
use App\Services\IA\CohereService;
use App\Services\IA\GeminiService;
use App\Services\IA\GroqService;
use App\Services\IA\MistralService;
use App\Services\IA\OpenRouterService;
use Illuminate\Support\Facades\Log;

class ProcessNextCommand
{
    public function __construct(
        private NotificationsRespositoryInterface $repo,
        private GroqService $groq,
        private CerebrasService $cerebras,
        private CohereService $cohere,
        private OpenRouterService $open_router,
        private GeminiService $gemini,
        private MistralService $mistral,
    ) {}

    public function execute(): ProcessNotificationResponseDTO
    {
        $notification = $this->repo->findMostAncient();

        if (!$notification) {
            throw new \RuntimeException('No hay notificaciones pendientes');
        }

        $services = [$this->groq, $this->cerebras, $this->cohere, $this->open_router, $this->gemini, $this->mistral];

        $deliveries = [];
        $context = json_encode(
            $notification->data,
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        ) ?: '{}';

        foreach ($notification->channels as $channel) {
            $prompt = "
                Eres un asistente experto en comunicación para una plataforma que gestiona ligas de pádel en España.

                Tu tarea es generar una notificación adaptada al canal especificado.

                Canal: {$channel}
                Tono: {$notification->tone}
                Urgencia: {$notification->urgencia}

                ⚠️ REGLAS GENERALES:
                - El mensaje debe ser claro, natural y adaptado al contexto deportivo (pádel).
                - Ajusta el lenguaje según la urgencia:
                - Baja: informativo
                - Media: activo
                - Alta: directo y prioritario
                - NO expliques nada, SOLO devuelve la notificación final.
                - NO añadas texto fuera del formato solicitado.

                📢 REGLAS POR CANAL:

                👉 WhatsApp:
                - Usa emojis de forma natural (no spam).
                - Usa negritas con *texto* para destacar.
                - Mensaje cercano y dinámico.

                👉 Email:
                - Formato EXACTO:
                Asunto: <texto>
                
                <cuerpo del mensaje>
                - Tono profesional pero cercano.

                👉 SMS:
                - Máximo 160 caracteres.
                - Mensaje directo, sin relleno.
                - Sin emojis innecesarios.

                👉 Push:
                - Formato EXACTO:
                Título: <texto>
                Mensaje: <texto>
                - Muy breve y llamativo.

                🎯 CONTEXTO:
                {$context}

                Genera la notificación ahora.
                ";

            $service = $services[array_rand($services)];
            $provider = class_basename($service);

            try {
                $response = $service->chat([
                    [
                        'role' => 'system',
                        'content' => 'Eres un asistente experto en comunicación multicanal y devuelves solo el mensaje final solicitado.',
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ]);

                $cleanResponse = trim($response);

                $deliveries[] = [
                    'channel' => $channel,
                    'provider' => $provider,
                    'message' => $cleanResponse,
                ];
            } catch (\Throwable $e) {
                Log::error('Error procesando canal de notificación', [
                    'notification_id' => $notification->id,
                    'channel' => $channel,
                    'provider' => $provider,
                    'error' => $e->getMessage(),
                ]);

                $deliveries[] = [
                    'channel' => $channel,
                    'provider' => $provider,
                    'message' => '',
                    'error' => $e->getMessage(),
                ];
            }
        }

        $hasAnySuccess = count(array_filter(
            $deliveries,
            static fn(array $delivery): bool => ($delivery['message'] ?? '') !== ''
        )) > 0;

        $status = $hasAnySuccess ? NotifStatus::COMPLETADA : NotifStatus::ERROR;

        $updatedData = array_merge($notification->data, [
            'deliveries' => $deliveries,
            'processed_at' => now()->toIso8601String(),
        ]);

        $this->repo->update($notification->id, [
            'status' => $status->value,
            'data' => $updatedData,
        ]);

        $updatedNotification = $this->repo->findById($notification->id) ?? $notification;

        event(new NotificationBroadcastedEvent($updatedNotification, 'processed', [
            'deliveries' => $deliveries,
        ]));

        return ProcessNotificationResponseDTO::fromArray([
            'message' => 'Notificación procesada correctamente',
            'suceso' => $updatedNotification->suceso,
            'urgencia' => $updatedNotification->urgencia,
            'details' => $deliveries,
        ]);
    }
}
