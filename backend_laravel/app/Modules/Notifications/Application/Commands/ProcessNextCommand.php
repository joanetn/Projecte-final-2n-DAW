<?php

namespace App\Modules\Notifications\Application\Commands;

use App\Events\AINotificationGenerated;
use App\Enums\NotifStatus;
use App\Modules\Notifications\Application\DTOs\ProcessNotificationResponseDTO;
use App\Modules\Notifications\Application\Services\NotificationEmailSender;
use App\Modules\Notifications\Application\Services\NotificationSmsSender;
use App\Modules\Notifications\Domain\Entities\Notification;
use App\Modules\Notifications\Domain\Repositories\NotificationsRespositoryInterface;
use App\Services\IA\CerebrasService;
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
        private OpenRouterService $open_router,
        private GeminiService $gemini,
        private MistralService $mistral,
        private NotificationEmailSender $notificationEmailSender,
        private NotificationSmsSender $notificationSmsSender,
    ) {}

    public function execute(): ProcessNotificationResponseDTO
    {
        $notification = $this->repo->findMostAncient();

        if (!$notification) {
            throw new \RuntimeException('No hay notificaciones pendientes');
        }

        if ($this->isMasterNotification($notification)) {
            return $this->processMasterNotification($notification);
        }

        return $this->processDeliveryNotification($notification);
    }

    private function processMasterNotification(Notification $notification): ProcessNotificationResponseDTO
    {
        $services = $this->servicePool();
        $context = json_encode(
            $notification->data,
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        ) ?: '{}';

        [$generatedMessages, $generationDetails] = $this->generateMessagesByChannel(
            $notification,
            $services,
            $context
        );

        if (empty($generatedMessages)) {
            $updatedData = array_merge($notification->data, [
                'fanout_done' => false,
                'deliveries' => $generationDetails,
                'processed_at' => now()->toIso8601String(),
            ]);

            $this->repo->update($notification->id, [
                'status' => NotifStatus::ERROR->value,
                'data' => $updatedData,
            ]);

            return ProcessNotificationResponseDTO::fromArray([
                'message' => 'No se pudo generar contenido para el fanout',
                'suceso' => $notification->suceso,
                'urgencia' => $notification->urgencia,
                'details' => $generationDetails,
            ]);
        }

        $recipientIds = $this->extractRecipientIds($notification);
        $batchKey = $this->extractBatchKey($notification);
        $fanoutCreated = 0;
        $fanoutSkipped = 0;

        foreach ($recipientIds as $recipientId) {
            $deliveryId = $this->buildDeterministicUuid('notification-delivery:' . $batchKey . ':' . $recipientId);

            if ($this->repo->findById($deliveryId) !== null) {
                $fanoutSkipped++;
                continue;
            }

            $childData = $notification->data;
            unset($childData['recipient_ids']);
            unset($childData['fanout_done']);
            unset($childData['generated_messages']);

            $childData = array_merge($childData, [
                'batch_key' => $batchKey,
                'master_id' => $notification->id,
                'is_master' => false,
                'delivery_channel_payload' => $generatedMessages,
            ]);

            try {
                $deliveryNotification = $this->repo->create([
                    'id' => $deliveryId,
                    'user_id' => $recipientId,
                    'status' => NotifStatus::PENDENT->value,
                    'tone' => $notification->tone,
                    'urgencia' => $notification->urgencia,
                    'suceso' => $notification->suceso,
                    'llegit' => false,
                    'channels' => $notification->channels,
                    'data' => $childData,
                ]);

                if ($deliveryNotification->userId !== null && $deliveryNotification->userId !== '') {
                    event(new AINotificationGenerated($this->toRealtimePayload($deliveryNotification, 'queued', [
                        'masterId' => $notification->id,
                        'batchKey' => $batchKey,
                    ])));
                }

                $fanoutCreated++;
            } catch (\Throwable $e) {
                $fanoutSkipped++;

                Log::warning('Error creando notificación hija en fanout', [
                    'master_id' => $notification->id,
                    'recipient_id' => $recipientId,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $updatedData = array_merge($notification->data, [
            'is_master' => true,
            'batch_key' => $batchKey,
            'generated_messages' => $generatedMessages,
            'fanout_done' => true,
            'fanout_created' => $fanoutCreated,
            'fanout_skipped' => $fanoutSkipped,
            'processed_at' => now()->toIso8601String(),
            'deliveries' => $generationDetails,
        ]);

        $this->repo->update($notification->id, [
            'status' => NotifStatus::COMPLETADA->value,
            'data' => $updatedData,
        ]);

        return ProcessNotificationResponseDTO::fromArray([
            'message' => "Fanout completado: {$fanoutCreated} creadas, {$fanoutSkipped} omitidas",
            'suceso' => $notification->suceso,
            'urgencia' => $notification->urgencia,
            'details' => $generationDetails,
        ]);
    }

    private function processDeliveryNotification(Notification $notification): ProcessNotificationResponseDTO
    {
        $services = $this->servicePool();
        $deliveries = [];
        $context = json_encode(
            $notification->data,
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        ) ?: '{}';

        $preGeneratedMessages = $this->extractPreGeneratedMessages($notification);

        foreach ($notification->channels as $channel) {
            $normalizedChannel = mb_strtolower(trim((string) $channel));

            $generatedMessage = $this->findPreGeneratedMessageForChannel($preGeneratedMessages, (string) $channel);
            $attemptedProviders = [];
            $providerUsed = null;

            if ($generatedMessage !== null && trim($generatedMessage) !== '') {
                $providerUsed = 'MasterFanoutPayload';
                $attemptedProviders[] = 'MasterFanoutPayload';
            } else {
                [$generatedMessage, $providerUsed, $attemptedProviders, $generationError] = $this->generateMessageForChannel(
                    $notification,
                    (string) $channel,
                    $services,
                    $context
                );

                if ($generatedMessage === null) {
                    $deliveries[] = [
                        'channel' => $channel,
                        'provider' => $providerUsed,
                        'message' => '',
                        'error' => $generationError ?? 'No se pudo generar la notificación con los modelos disponibles',
                        'attemptedProviders' => $attemptedProviders,
                    ];

                    Log::error('Todos los modelos fallaron para este canal de notificación', [
                        'notification_id' => $notification->id,
                        'channel' => $channel,
                        'attemptedProviders' => $attemptedProviders,
                        'error' => $generationError,
                    ]);

                    continue;
                }
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
                        'recipient' => (string) env('NOTIFICATIONS_EMAIL_RECIPIENT', 'notifications@example.com'),
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

            if ($normalizedChannel === 'sms' || $normalizedChannel === 'whatsapp') {
                $twilioDeliveryKey = $normalizedChannel === 'whatsapp' ? 'whatsapp' : 'sms';

                try {
                    $smsMeta = $this->notificationSmsSender->send($notification, $generatedMessage, $twilioDeliveryKey);
                    $delivery[$twilioDeliveryKey] = [
                        'sent' => true,
                        ...$smsMeta,
                    ];
                } catch (\Throwable $smsError) {
                    $delivery[$twilioDeliveryKey] = [
                        'sent' => false,
                    ];
                    $delivery['error'] = $smsError->getMessage();

                    Log::error('Error enviando notificación Twilio', [
                        'notification_id' => $notification->id,
                        'channel' => $channel,
                        'twilio_channel' => $twilioDeliveryKey,
                        'provider' => $providerUsed,
                        'error' => $smsError->getMessage(),
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

    /**
     * @param array<int, object> $services
     * @return array{0: array<string, string>, 1: array<int, array<string, mixed>>}
     */
    private function generateMessagesByChannel(Notification $notification, array $services, string $context): array
    {
        $generatedMessages = [];
        $details = [];

        foreach ($notification->channels as $channel) {
            [$generatedMessage, $providerUsed, $attemptedProviders, $generationError] = $this->generateMessageForChannel(
                $notification,
                (string) $channel,
                $services,
                $context
            );

            if ($generatedMessage === null) {
                $details[] = [
                    'channel' => $channel,
                    'provider' => $providerUsed,
                    'message' => '',
                    'error' => $generationError,
                    'attemptedProviders' => $attemptedProviders,
                ];
                continue;
            }

            $generatedMessages[(string) $channel] = $generatedMessage;

            $details[] = [
                'channel' => $channel,
                'provider' => $providerUsed,
                'message' => $generatedMessage,
                'attemptedProviders' => $attemptedProviders,
            ];
        }

        return [$generatedMessages, $details];
    }

    /**
     * @param array<int, object> $services
     * @return array{0: ?string, 1: ?string, 2: array<int, string>, 3: ?string}
     */
    private function generateMessageForChannel(
        Notification $notification,
        string $channel,
        array $services,
        string $context,
    ): array {
        $prompt = $this->buildPrompt($notification, $channel, $context);

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
            return [
                null,
                end($attemptedProviders) ?: null,
                $attemptedProviders,
                $lastError ?? 'No se pudo generar la notificación con los modelos disponibles',
            ];
        }

        return [$generatedMessage, $providerUsed, $attemptedProviders, null];
    }

    private function buildPrompt(Notification $notification, string $channel, string $context): string
    {
        return "
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
                - Si el mensaje requiere firma o remitente, usa 'Administrador de la plataforma'.
                - Para el email y todos en general pero sobre todo el email NO PUEDES PONER COSAS COMO PARA RELLENAR. Ejemplos: [Tu Nombre]. 
                ¿Porque? Porque esto es lo que va a ver el usuario final, ni mostrar id ni cosas sensibles ni poner cosas genéricas.

                📢 REGLAS POR CANAL:

                👉 Email:
                - Formato EXACTO:
                Asunto: <texto>

                <cuerpo del mensaje>
                - Tono profesional pero cercano.

                👉 SMS:
                - Máximo 160 caracteres.
                - Mensaje directo, sin relleno.
                - Sin emojis innecesarios.

                👉 Whatsapp:
                - Mensaje descriptivo.
                - Tono amable.
                - Con muchos emotes pero que tengan que ver con el mensaje.

                👉 Push:
                - Formato EXACTO:
                Mensaje: <texto>
                - Muy breve y llamativo.

                🎯 CONTEXTO:
                {$context}

                Genera la notificación ahora.
                ";
    }

    /**
     * @return array<int, object>
     */
    private function servicePool(): array
    {
        return [$this->groq, $this->cerebras, $this->open_router, $this->gemini, $this->mistral];
    }

    private function isMasterNotification(Notification $notification): bool
    {
        if ($notification->userId !== null && trim($notification->userId) !== '') {
            return false;
        }

        return count($this->extractRecipientIds($notification)) > 0;
    }

    /**
     * @return string[]
     */
    private function extractRecipientIds(Notification $notification): array
    {
        $recipientIds = $notification->data['recipient_ids'] ?? [];
        if (!is_array($recipientIds)) {
            return [];
        }

        return array_values(array_unique(array_filter(array_map(
            static fn($recipientId): string => trim((string) $recipientId),
            $recipientIds
        ), static fn(string $recipientId): bool => $recipientId !== '')));
    }

    private function extractBatchKey(Notification $notification): string
    {
        $batchKey = trim((string) ($notification->data['batch_key'] ?? ''));
        if ($batchKey !== '') {
            return $batchKey;
        }

        $base = ($notification->userId ?? 'master') . ':' . $notification->id;

        return hash('sha256', $base);
    }

    /**
     * @return array<string, string>
     */
    private function extractPreGeneratedMessages(Notification $notification): array
    {
        $payload = $notification->data['delivery_channel_payload']
            ?? $notification->data['generated_messages']
            ?? [];

        if (!is_array($payload)) {
            return [];
        }

        $normalized = [];
        foreach ($payload as $channel => $message) {
            $channelKey = trim((string) $channel);
            $channelMessage = trim((string) $message);

            if ($channelKey === '' || $channelMessage === '') {
                continue;
            }

            $normalized[$channelKey] = $channelMessage;
        }

        return $normalized;
    }

    private function findPreGeneratedMessageForChannel(array $payload, string $channel): ?string
    {
        foreach ($payload as $payloadChannel => $payloadMessage) {
            if (strcasecmp(trim((string) $payloadChannel), trim((string) $channel)) === 0) {
                $message = trim((string) $payloadMessage);
                return $message !== '' ? $message : null;
            }
        }

        return null;
    }

    private function buildDeterministicUuid(string $seed): string
    {
        $hash = hash('sha256', $seed);

        return sprintf(
            '%s-%s-%s-%s-%s',
            substr($hash, 0, 8),
            substr($hash, 8, 4),
            substr($hash, 12, 4),
            substr($hash, 16, 4),
            substr($hash, 20, 12)
        );
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
