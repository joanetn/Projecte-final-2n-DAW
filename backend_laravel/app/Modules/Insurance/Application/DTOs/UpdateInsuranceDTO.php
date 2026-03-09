<?php

namespace App\Modules\Insurance\Application\DTOs;

class UpdateInsuranceDTO
{
    public function __construct(
        public readonly ?string $usuariId = null,
        public readonly ?string $dataExpiracio = null,
        public readonly ?bool $pagat = null,
        public readonly ?string $stripe_payment_intent_id = null,
        public readonly ?float $preu = null,
        public readonly ?int $mesos = null,
        public readonly ?bool $isActive = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            usuariId: $data['usuariId'] ?? null,
            dataExpiracio: $data['dataExpiracio'] ?? null,
            pagat: $data['pagat'] ?? null,
            stripe_payment_intent_id: $data['stripe_payment_intent_id'] ?? null,
            preu: $data['preu'] ?? null,
            mesos: $data['mesos'] ?? null,
            isActive: $data['isActive'] ?? null,
        );
    }
}
