<?php

namespace App\Modules\Notifications\Application\DTOs;

class EnqueueNotificationDTO
{
    public function __construct(
        public readonly string $userId,
        public readonly string $suceso,
        public readonly array $channels,
        public readonly string $tone = 'PROFESIONAL',
        public readonly array $data = [],
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            userId: $data['userId'] ?? '',
            suceso: $data['suceso'] ?? $data['task_description'] ?? '',
            channels: is_array($data['channels']) ? $data['channels'] : [$data['channels'] ?? ''],
            tone: $data['tone'] ?? 'PROFESIONAL',
            data: $data['data'] ?? [],
        );
    }

    public function toArray(): array
    {
        return [
            'userId' => $this->userId,
            'suceso' => $this->suceso,
            'channels' => $this->channels,
            'tone' => $this->tone,
            'data' => $this->data,
        ];
    }
}
