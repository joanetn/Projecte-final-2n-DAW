<?php

namespace App\Modules\Notifications\Application\DTOs;

class ProcessNotificationResponseDTO
{
    /**
     * @param DeliveryResultDTO[] $details
     */
    public function __construct(
        public readonly string $message,
        public readonly string $suceso,
        public readonly string $urgencia,
        public readonly array $details,
    ) {}

    public static function fromArray(array $data): self
    {
        $details = array_map(
            fn($detail) => DeliveryResultDTO::fromArray($detail),
            $data['details'] ?? []
        );

        return new self(
            message: $data['message'] ?? 'Procesamiento multicanal completado',
            suceso: $data['suceso'] ?? $data['task'] ?? '',
            urgencia: $data['urgencia'] ?? $data['urgency'] ?? 'NORMAL',
            details: $details,
        );
    }

    public function toArray(): array
    {
        return [
            'message' => $this->message,
            'suceso' => $this->suceso,
            'urgencia' => $this->urgencia,
            'details' => array_map(fn($d) => $d->toArray(), $this->details),
        ];
    }
}
