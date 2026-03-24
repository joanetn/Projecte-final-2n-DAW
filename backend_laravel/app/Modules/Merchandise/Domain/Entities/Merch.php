<?php

namespace App\Modules\Merchandise\Domain\Entities;

use App\Enums\MerchBrand;

class Merch
{
    public function __construct(
        public readonly string $id,
        public readonly string $nom,
        public readonly MerchBrand|string $marca,
        public readonly ?string $imageUrl,
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
