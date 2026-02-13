<?php

namespace App\Modules\Merchandise\Application\DTOs;

use App\Modules\Merchandise\Domain\Entities\Merch;

class MerchDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $nom,
        public readonly ?string $marca,
        public readonly ?float $preu,
        public readonly ?int $stock,
        public readonly bool $isActive,
        public readonly ?string $createdAt,
        public readonly ?string $updatedAt,
        public readonly ?array $compras = null,
    ) {}

    public static function fromEntity(Merch $merch): self
    {
        return new self(
            id: $merch->id,
            nom: $merch->nom,
            marca: $merch->marca,
            preu: $merch->preu,
            stock: $merch->stock,
            isActive: $merch->isActive,
            createdAt: $merch->createdAt,
            updatedAt: $merch->updatedAt,
            compras: $merch->compras,
        );
    }
}
