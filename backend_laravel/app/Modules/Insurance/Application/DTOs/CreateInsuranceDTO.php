<?php

namespace App\Modules\Insurance\Application\DTOs;

class CreateInsuranceDTO
{
    public function __construct(
        public readonly ?string $usuariId,
        public readonly ?string $dataExpiracio,
        public readonly bool $pagat = false,
        public readonly ?string $stripe_payment_intent_id = null,
        public readonly ?float $preu = null,
        public readonly int $mesos = 12,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            usuariId: $data['usuariId'] ?? null,
            dataExpiracio: $data['dataExpiracio'] ?? null,
            pagat: $data['pagat'] ?? false,
            stripe_payment_intent_id: $data['stripe_payment_intent_id'] ?? null,
            preu: $data['preu'] ?? null,
            mesos: $data['mesos'] ?? 12,
        );
    }
}
