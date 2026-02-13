<?php

namespace App\Modules\Merchandise\Application\DTOs;

class UpdateCompraDTO
{
    public function __construct(
        public readonly ?int $quantitat = null,
        public readonly ?float $total = null,
        public readonly ?bool $pagat = null,
        public readonly ?string $status = null,
        public readonly ?bool $isActive = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            quantitat: $data['quantitat'] ?? null,
            total: $data['total'] ?? null,
            pagat: $data['pagat'] ?? null,
            status: $data['status'] ?? null,
            isActive: $data['isActive'] ?? null,
        );
    }
}
