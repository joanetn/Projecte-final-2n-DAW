<?php

namespace App\Modules\Merchandise\Application\DTOs;

class CreateMerchDTO
{
    public function __construct(
        public readonly string $nom,
        public readonly ?string $marca,
        public readonly ?float $preu,
        public readonly ?int $stock,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nom: $data['nom'],
            marca: $data['marca'] ?? null,
            preu: $data['preu'] ?? null,
            stock: $data['stock'] ?? null,
        );
    }
}
