<?php

namespace App\Modules\Notifications\Application\DTOs;

class DeliveryResultDTO
{
    public function __construct(
        public readonly string $channel,
        public readonly string $provider,
        public readonly string $message,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            channel: $data['channel'] ?? '',
            provider: $data['provider'] ?? '',
            message: $data['message'] ?? '',
        );
    }

    public function toArray(): array
    {
        return [
            'channel' => $this->channel,
            'provider' => $this->provider,
            'message' => $this->message,
        ];
    }
}
