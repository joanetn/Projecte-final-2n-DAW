<?php

namespace App\Modules\Notifications\Application\DTOs;

class EnqueueNotificationDTO
{
    public function __construct(
        public readonly string $userId,
        public readonly array $userIds,
        public readonly string $suceso,
        public readonly array $channels,
        public readonly string $tone = 'PROFESIONAL',
        public readonly array $data = [],
        public readonly ?string $batchKey = null,
    ) {}

    public static function fromArray(array $data): self
    {
        $singleUserId = trim((string) ($data['userId'] ?? ''));

        $rawUserIds = $data['userIds'] ?? [];
        if (is_object($rawUserIds) && method_exists($rawUserIds, 'all')) {
            $rawUserIds = $rawUserIds->all();
        }
        if (!is_array($rawUserIds)) {
            $rawUserIds = [$rawUserIds];
        }

        $userIds = array_values(array_unique(array_filter(array_map(
            static fn($id): string => trim((string) $id),
            $rawUserIds
        ), static fn(string $id): bool => $id !== '')));

        if ($singleUserId !== '' && !in_array($singleUserId, $userIds, true)) {
            $userIds[] = $singleUserId;
        }

        $rawChannels = $data['channels'] ?? [];
        if (is_object($rawChannels) && method_exists($rawChannels, 'all')) {
            $rawChannels = $rawChannels->all();
        }
        if (!is_array($rawChannels)) {
            $rawChannels = [$rawChannels];
        }

        $channels = array_values(array_filter(array_map(
            static fn($channel): string => trim((string) $channel),
            $rawChannels
        ), static fn(string $channel): bool => $channel !== ''));

        return new self(
            userId: $singleUserId !== '' ? $singleUserId : ($userIds[0] ?? ''),
            userIds: $userIds,
            suceso: $data['suceso'] ?? $data['task_description'] ?? '',
            channels: $channels,
            tone: $data['tone'] ?? 'PROFESIONAL',
            data: $data['data'] ?? [],
            batchKey: isset($data['batchKey'])
                ? trim((string) $data['batchKey'])
                : (isset($data['batch_key']) ? trim((string) $data['batch_key']) : null),
        );
    }

    public function recipientIds(): array
    {
        return $this->userIds;
    }

    public function toArray(): array
    {
        return [
            'userId' => $this->userId,
            'userIds' => $this->userIds,
            'suceso' => $this->suceso,
            'channels' => $this->channels,
            'tone' => $this->tone,
            'data' => $this->data,
            'batchKey' => $this->batchKey,
        ];
    }
}
