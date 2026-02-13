<?php

namespace App\Modules\Merchandise\Application\DTOs;

class UpdateMerchDTO
{
    public function __construct(
        public readonly ?string $nom = null,
        public readonly ?string $marca = null,
        public readonly ?float $preu = null,
        public readonly ?int $stock = null,
        public readonly ?bool $isActive = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nom: $data['nom'] ?? null,
            marca: $data['marca'] ?? null,
            preu: $data['preu'] ?? null,
            stock: $data['stock'] ?? null,
            isActive: $data['isActive'] ?? null,
        );
    }
}
