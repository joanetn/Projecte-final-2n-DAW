<?php

namespace App\Modules\Insurance\Domain\Entities;

class Insurance
{
    public function __construct(
        public readonly string $id,
        public readonly ?string $usuariId,
        public readonly ?string $dataExpiracio,
        public readonly bool $pagat = false,
        public readonly ?string $stripe_payment_intent_id = null,
        public readonly ?float $preu = null,
        public readonly int $mesos = 12,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
        public readonly bool $isActive = true
    ) {}

    public function isPaid(): bool
    {
        return $this->pagat;
    }
}
