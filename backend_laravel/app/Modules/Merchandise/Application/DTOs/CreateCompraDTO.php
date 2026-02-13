<?php

namespace App\Modules\Merchandise\Application\DTOs;

class CreateCompraDTO
{
    public function __construct(
        public readonly string $usuariId,
        public readonly string $merchId,
        public readonly int $quantitat,
        public readonly ?float $total = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            usuariId: $data['usuariId'],
            merchId: $data['merchId'],
            quantitat: $data['quantitat'],
            total: $data['total'] ?? null,
        );
    }
}
