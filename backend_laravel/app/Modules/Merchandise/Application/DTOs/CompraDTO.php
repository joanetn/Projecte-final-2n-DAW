<?php

namespace App\Modules\Merchandise\Application\DTOs;

use App\Modules\Merchandise\Domain\Entities\Compra;

class CompraDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $usuariId,
        public readonly string $merchId,
        public readonly int $quantitat,
        public readonly float $total,
        public readonly bool $pagat,
        public readonly ?string $status,
        public readonly bool $isActive,
        public readonly ?string $createdAt,
        public readonly ?array $usuari = null,
        public readonly ?array $merch = null,
    ) {}

    public static function fromEntity(Compra $compra): self
    {
        return new self(
            id: $compra->id,
            usuariId: $compra->usuariId,
            merchId: $compra->merchId,
            quantitat: $compra->quantitat,
            total: $compra->total,
            pagat: $compra->pagat,
            status: $compra->status,
            isActive: $compra->isActive,
            createdAt: $compra->createdAt,
            usuari: $compra->usuari,
            merch: $compra->merch,
        );
    }
}
