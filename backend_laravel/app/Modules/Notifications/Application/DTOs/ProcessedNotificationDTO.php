<?php

namespace App\Modules\Notifications\Application\DTOs;

use DateTime;

class ProcessedNotificationDTO
{
    /**
     * @param DeliveryResultDTO[] $deliveries
     */
    public function __construct(
        public readonly string $id,
        public readonly string $suceso,
        public readonly DateTime $processedAt,
        public readonly array $deliveries,
    ) {}

    public static function fromArray(array $data): self
    {
        $deliveries = array_map(
            fn($delivery) => DeliveryResultDTO::fromArray($delivery),
            $data['deliveries'] ?? []
        );

        return new self(
            id: $data['id'] ?? $data['task_id'] ?? $data['taskId'] ?? '',
            suceso: $data['suceso'] ?? $data['task_description'] ?? $data['taskDescription'] ?? '',
            processedAt: $data['processed_at'] instanceof DateTime
                ? $data['processed_at']
                : new DateTime($data['processed_at'] ?? 'now'),
            deliveries: $deliveries,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'suceso' => $this->suceso,
            'processed_at' => $this->processedAt->format('Y-m-d H:i:s'),
            'deliveries' => array_map(fn($d) => $d->toArray(), $this->deliveries),
        ];
    }
}
