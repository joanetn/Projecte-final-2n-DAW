<?php

namespace App\Modules\Notifications\Application\DTOs;

class ProviderStatusDTO
{
    public function __construct(
        public readonly string $provider,
        public readonly string $status,
        public readonly string $latency,
        public readonly ?string $error = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            provider: $data['provider'] ?? '',
            status: $data['status'] ?? '❌ OFFLINE',
            latency: $data['latency'] ?? 'N/A',
            error: $data['error'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'provider' => $this->provider,
            'status' => $this->status,
            'latency' => $this->latency,
            'error' => $this->error,
        ];
    }
}
