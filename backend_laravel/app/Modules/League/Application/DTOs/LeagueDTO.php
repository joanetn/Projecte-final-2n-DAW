<?php

namespace App\Modules\League\Application\DTOs;

use App\Modules\League\Domain\Entities\League;

class LeagueDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $nom,
        public readonly string $categoria,
        public readonly string $dataInici,
        public readonly string $status,
        public readonly bool $isActive,
        public readonly string $createdAt,
        public readonly string $updatedAt,
    ) {}

    public static function fromEntity(League $lliga): self
    {
        return new self(
            id: $lliga->id,
            nom: $lliga->nom,
            categoria: $lliga->categoria,
            dataInici: $lliga->dataInici,
            status: $lliga->status,
            isActive: $lliga->isActive,
            createdAt: $lliga->createdAt,
            updatedAt: $lliga->updatedAt,
        );
    }
}
