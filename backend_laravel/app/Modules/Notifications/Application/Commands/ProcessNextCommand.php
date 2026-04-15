<?php

namespace App\Modules\Notifications\Application\Commands;

use App\Events\AINotificationGenerated;
use App\Enums\NotifStatus;
use App\Modules\Notifications\Application\DTOs\ProcessNotificationResponseDTO;
use App\Modules\Notifications\Application\Services\NotificationEmailSender;
use App\Modules\Notifications\Domain\Entities\Notification;
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
        // private CohereService $cohere,
        private OpenRouterService $open_router,
        private GeminiService $gemini,
        private MistralService $mistral,
        private NotificationEmailSender $notificationEmailSender,
    ) {}

    public function execute(): ProcessNotificationResponseDTO
    {
        $notification = $this->repo->findMostAncient();

        if (!$notification) {
            throw new \RuntimeException('No hay notificaciones pendientes');
        }

        $services = [$this->groq, $this->cerebras, $this->open_router, $this->gemini, $this->mistral];

        $deliveries = [];
        $context = json_encode(
            $notification->data,
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        ) ?: '{}';

        foreach ($notification->channels as $channel) {
            $normalizedChannel = mb_strtolower(trim((string) $channel));

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
                - LA MÁS IMPORTANTE ES QUE QUIERO QUE SEAS DESCRIPTIVO CON LO QUE TE LLEGA DE MENSAJE DE EL USUARIO PARA QUE VEA LO QUE QUIERE EL QUE RECIBE LA NOTIFICACION
                - Cuando vayas a poner cosas de Tu nombre cosas asi pon Joan Nácher (Administrador de Padel Play)

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
                Mensaje: <texto>
                - Muy breve y llamativo.

                🎯 CONTEXTO:
                {$context}

                Genera la notificación ahora.
                ";

            $providerPool = $services;
            shuffle($providerPool);

            $attemptedProviders = [];
            $lastError = null;
            $generatedMessage = null;
            $providerUsed = null;

            foreach ($providerPool as $service) {
                $provider = class_basename($service);
                $attemptedProviders[] = $provider;

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

                    $cleanResponse = trim((string) $response);

                    if ($cleanResponse === '') {
                        throw new \RuntimeException('Respuesta vacía del modelo');
                    }

                    $generatedMessage = $cleanResponse;
                    $providerUsed = $provider;
                    break;
                } catch (\Throwable $e) {
                    $lastError = $e->getMessage();

                    Log::warning('Error procesando canal de notificación; se probará otro modelo', [
                        'notification_id' => $notification->id,
                        'channel' => $channel,
                        'provider' => $provider,
                        'error' => $lastError,
                    ]);
                }
            }

            if ($generatedMessage === null) {
                $deliveries[] = [
                    'channel' => $channel,
                    'provider' => end($attemptedProviders) ?: null,
                    'message' => '',
                    'error' => $lastError ?? 'No se pudo generar la notificación con los modelos disponibles',
                    'attemptedProviders' => $attemptedProviders,
                ];

                Log::error('Todos los modelos fallaron para este canal de notificación', [
                    'notification_id' => $notification->id,
                    'channel' => $channel,
                    'attemptedProviders' => $attemptedProviders,
                    'error' => $lastError,
                ]);

                continue;
            }

            $delivery = [
                'channel' => $channel,
                'provider' => $providerUsed,
                'message' => $generatedMessage,
                'attemptedProviders' => $attemptedProviders,
            ];

            if ($normalizedChannel === 'email') {
                try {
                    $mailMeta = $this->notificationEmailSender->send($notification, $generatedMessage);
                    $delivery['email'] = [
                        'sent' => true,
                        ...$mailMeta,
                    ];
                } catch (\Throwable $mailError) {
                    $delivery['email'] = [
                        'sent' => false,
                        'recipient' => (string) env('NOTIFICATIONS_EMAIL_RECIPIENT', 'jnacherparra@gmail.com'),
                    ];
                    $delivery['error'] = $mailError->getMessage();

                    Log::error('Error enviando email de notificación', [
                        'notification_id' => $notification->id,
                        'channel' => $channel,
                        'provider' => $providerUsed,
                        'error' => $mailError->getMessage(),
                    ]);
                }
            }

            $deliveries[] = $delivery;
        }

        $hasAnySuccess = count(array_filter(
            $deliveries,
            static fn(array $delivery): bool => ($delivery['message'] ?? '') !== '' && !isset($delivery['error'])
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

        if ($updatedNotification->userId !== null && $updatedNotification->userId !== '') {
            event(new AINotificationGenerated($this->toRealtimePayload($updatedNotification, 'processed', [
                'deliveries' => $deliveries,
            ])));
        }

        return ProcessNotificationResponseDTO::fromArray([
            'message' => 'Notificación procesada correctamente',
            'suceso' => $updatedNotification->suceso,
            'urgencia' => $updatedNotification->urgencia,
            'details' => $deliveries,
        ]);
    }

    private function toRealtimePayload(Notification $notification, string $action, array $meta = []): array
    {
        return [
            'action' => $action,
            'id' => $notification->id,
            'user_id' => $notification->userId,
            'userId' => $notification->userId,
            'suceso' => $notification->suceso,
            'status' => $notification->status->value,
            'tone' => $notification->tone,
            'urgencia' => $notification->urgencia,
            'llegit' => $notification->llegit,
            'channels' => $notification->channels,
            'data' => $notification->data,
            'meta' => $meta,
            'createdAt' => $notification->createdAt,
            'updatedAt' => $notification->updatedAt,
            'broadcastedAt' => now()->toIso8601String(),
        ];
    }
}
