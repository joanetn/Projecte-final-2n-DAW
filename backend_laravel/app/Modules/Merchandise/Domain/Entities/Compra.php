<?php

namespace App\Modules\Merchandise\Domain\Entities;

class Compra
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

    public function isPagat(): bool
    {
        return $this->pagat;
    }

    public function isPendent(): bool
    {
        return $this->status === 'PENDENT';
    }
}
