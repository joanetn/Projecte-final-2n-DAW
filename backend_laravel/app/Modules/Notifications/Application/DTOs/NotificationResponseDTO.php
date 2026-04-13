<?php

namespace App\Modules\Notifications\Application\DTOs;

class NotificationResponseDTO
{
    public function __construct(
        public readonly string $message,
        public readonly string $id,
        public readonly string $detectedUrgencia,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            message: $data['message'] ?? 'Notificación encolada',
            id: $data['id'] ?? '',
            detectedUrgencia: $data['detected_urgencia'] ?? $data['detected_urgency'] ?? 'NORMAL',
        );
    }

    public function toArray(): array
    {
        return [
            'message' => $this->message,
            'id' => $this->id,
            'detected_urgencia' => $this->detectedUrgencia,
        ];
    }
}
