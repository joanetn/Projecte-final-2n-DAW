<?php

namespace App\Modules\League\Application\DTOs;

use App\Modules\League\Domain\Entities\Round;

class RoundDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $nom,
        public readonly string $lligaId,
        public readonly string $dataInici,
        public readonly string $status,
        public readonly bool $isActive,
        public readonly string $createdAt,
        public readonly string $updatedAt,
        public readonly ?string $dataFi = null,
    ) {}

    public static function fromEntity(Round $round): self
    {
        return new self(
            id: $round->id,
            nom: $round->nom,
            lligaId: $round->lligaId,
            dataInici: $round->dataInici,
            status: $round->status,
            isActive: $round->isActive,
            createdAt: $round->createdAt,
            updatedAt: $round->updatedAt,
            dataFi: $round->dataFi,
        );
    }
}
