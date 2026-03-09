<?php

namespace App\Modules\Insurance\Application\DTOs;

use App\Modules\Insurance\Domain\Entities\Insurance;

class InsuranceDTO
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

    public static function fromEntity(Insurance $insurance): self
    {
        return new self(
            id: $insurance->id,
            usuariId: $insurance->usuariId,
            dataExpiracio: $insurance->dataExpiracio,
            pagat: $insurance->pagat,
            stripe_payment_intent_id: $insurance->stripe_payment_intent_id,
            preu: $insurance->preu,
            mesos: $insurance->mesos,
            createdAt: $insurance->createdAt,
            updatedAt: $insurance->updatedAt,
            isActive: $insurance->isActive
        );
    }
}
