<?php

namespace App\Modules\Notifications\Application\Commands;

use App\Events\AINotificationGenerated;
use App\Modules\Notifications\Application\DTOs\EnqueueNotificationDTO;
use App\Modules\Notifications\Domain\Entities\Notification;
use App\Services\IA\GroqService;
use App\Enums\NotifStatus;
use App\Modules\Notifications\Domain\Repositories\NotificationsRespositoryInterface;
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

        $urgency = 'NORMAL';

        try {
            $urgencyMessages = [
                [
                    'role' => 'user',
                    'content' => "Analiza la siguiente tarea de notificación y responde ÚNICAMENTE con una sola palabra (BAJA, NORMAL, ALTA, CRITICA) según su urgencia: {$dto->suceso}"
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

        $notification = $this->repo->create([
            'user_id' => $dto->userId !== '' ? $dto->userId : null,
            'status' => NotifStatus::PENDENT->value,
            'tone' => $dto->tone ?? 'PROFESIONAL',
            'urgencia' => $urgency,
            'suceso' => $dto->suceso,
            'llegit' => false,
            'channels' => $dto->channels,
            'data' => $dto->data ?? [],
        ]);

        if ($notification->userId !== null && $notification->userId !== '') {
            event(new AINotificationGenerated($this->toRealtimePayload($notification, 'queued')));
        }

        return $notification;
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
