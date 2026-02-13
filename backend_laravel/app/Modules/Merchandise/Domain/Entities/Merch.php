<?php

namespace App\Modules\Merchandise\Domain\Entities;

class Merch
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

    public function hasStock(int $quantitat = 1): bool
    {
        return $this->stock !== null && $this->stock >= $quantitat;
    }
}
