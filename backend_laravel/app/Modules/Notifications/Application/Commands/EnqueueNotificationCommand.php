<?php

namespace App\Modules\Notifications\Application\Commands;

use App\Events\AINotificationGenerated;
use App\Modules\Notifications\Application\DTOs\EnqueueNotificationDTO;
use App\Modules\Notifications\Domain\Entities\Notification;
use App\Services\IA\GroqService;
use App\Enums\NotifStatus;
use App\Modules\Notifications\Domain\Repositories\NotificationsRespositoryInterface;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;

class EnqueueNotificationCommand
{
    public function __construct(
        private NotificationsRespositoryInterface $repo,
        private GroqService $groq,
    ) {}

    public function execute(EnqueueNotificationDTO $dto): ?Notification
    {
        if (!$dto->channels || !$dto->suceso) {
            throw new \Exception('Faltan campos obligatorios');
        }

        $recipientIds = $dto->recipientIds();
        if (empty($recipientIds)) {
            throw new \Exception('No se han indicado destinatarios para la notificación');
        }

        $urgency = $this->resolveUrgency($dto->suceso);
        $batchKey = $this->resolveBatchKey($dto, $recipientIds);

        if (count($recipientIds) > 1) {
            Log::info('PAN');
            return $this->enqueueMasterNotification($dto, $recipientIds, $urgency, $batchKey);
        }
        Log::info('CHITO');
        return $this->enqueueSingleRecipientNotification($dto, $recipientIds[0], $urgency, $batchKey);
    }

    private function resolveUrgency(string $suceso): string
    {
        $urgency = 'NORMAL';

        try {
            $urgencyMessages = [
                [
                    'role' => 'user',
                    'content' => "Analiza la siguiente tarea de notificación y responde ÚNICAMENTE con una sola palabra (BAJA, NORMAL, ALTA, CRITICA) según su urgencia: {$suceso}"
                ]
            ];

            $response = $this->groq->chat($urgencyMessages);
            $cleanResponse = trim(strtoupper($response));

            Log::info('Groq urgency response', ['response' => $response, 'clean' => $cleanResponse]);

            if (in_array($cleanResponse, ['BAJA', 'NORMAL', 'ALTA', 'CRITICA'])) {
                $urgency = $cleanResponse;
            }
        } catch (\Exception $e) {
            Log::error('Groq urgency analysis failed', ['error' => $e->getMessage()]);
            $urgency = 'NORMAL';
        }

        return $urgency;
    }

    /**
     * @param string[] $recipientIds
     */
    private function resolveBatchKey(EnqueueNotificationDTO $dto, array $recipientIds): string
    {
        $explicitBatchKey = trim((string) ($dto->batchKey ?? ''));
        if ($explicitBatchKey !== '') {
            return $explicitBatchKey;
        }

        $fromData = trim((string) ($dto->data['batch_key'] ?? ''));
        if ($fromData !== '') {
            return $fromData;
        }

        $channels = $dto->channels;
        sort($channels);

        $recipients = $recipientIds;
        sort($recipients);

        $contextKeys = ['type', 'eventId', 'equipId', 'lligaId', 'invitationId', 'source'];
        $context = [];
        foreach ($contextKeys as $key) {
            if (array_key_exists($key, $dto->data)) {
                $context[$key] = $dto->data[$key];
            }
        }

        $raw = json_encode([
            'suceso' => $dto->suceso,
            'channels' => $channels,
            'recipients' => $recipients,
            'context' => $context,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return hash('sha256', (string) $raw);
    }

    /**
     * @param string[] $recipientIds
     */
    private function enqueueMasterNotification(
        EnqueueNotificationDTO $dto,
        array $recipientIds,
        string $urgency,
        string $batchKey,
    ): Notification {
        $masterId = $this->buildDeterministicUuid('notification-master:' . $batchKey);

        $existing = $this->repo->findById($masterId);
        if ($existing !== null) {
            return $existing;
        }

        $payloadData = array_merge($dto->data, [
            'batch_key' => $batchKey,
            'recipient_ids' => $recipientIds,
            'is_master' => true,
            'fanout_done' => false,
        ]);

        try {
            return $this->repo->create([
                'id' => $masterId,
                'user_id' => null,
                'status' => NotifStatus::PENDENT->value,
                'tone' => $dto->tone ?? 'PROFESIONAL',
                'urgencia' => $urgency,
                'suceso' => $dto->suceso,
                'llegit' => false,
                'channels' => $dto->channels,
                'data' => $payloadData,
            ]);
        } catch (QueryException) {
            $existingAfterRace = $this->repo->findById($masterId);
            if ($existingAfterRace !== null) {
                return $existingAfterRace;
            }

            throw new \RuntimeException('No se pudo encolar la notificación maestra');
        }
    }

    private function enqueueSingleRecipientNotification(
        EnqueueNotificationDTO $dto,
        string $recipientId,
        string $urgency,
        string $batchKey,
    ): Notification {
        $notificationId = $this->buildDeterministicUuid('notification-delivery:' . $batchKey . ':' . $recipientId);

        $existing = $this->repo->findById($notificationId);
        if ($existing !== null) {
            return $existing;
        }

        $payloadData = array_merge($dto->data, [
            'batch_key' => $batchKey,
            'recipient_ids' => [$recipientId],
            'is_master' => false,
        ]);

        try {
            $notification = $this->repo->create([
                'id' => $notificationId,
                'user_id' => $recipientId,
                'status' => NotifStatus::PENDENT->value,
                'tone' => $dto->tone ?? 'PROFESIONAL',
                'urgencia' => $urgency,
                'suceso' => $dto->suceso,
                'llegit' => false,
                'channels' => $dto->channels,
                'data' => $payloadData,
            ]);
        } catch (QueryException) {
            $existingAfterRace = $this->repo->findById($notificationId);
            if ($existingAfterRace !== null) {
                return $existingAfterRace;
            }

            throw new \RuntimeException('No se pudo encolar la notificación');
        }

        if ($notification->userId !== null && $notification->userId !== '') {
            event(new AINotificationGenerated($this->toRealtimePayload($notification, 'queued')));
        }

        return $notification;
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

    private function toRealtimePayload(Notification $notification, string $action): array
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
            'createdAt' => $notification->createdAt,
            'updatedAt' => $notification->updatedAt,
            'broadcastedAt' => now()->toIso8601String(),
        ];
    }
}
