<?php

namespace App\Modules\Match\Application\DTOs;

use App\Modules\Match\Domain\Entities\Matches;

class MatchDTO
{
    public function __construct(
        public readonly string $id,
        public readonly ?string $jornadaId,
        public readonly string $localId,
        public readonly string $visitantId,
        public readonly ?string $dataHora,
        public readonly ?string $pistaId,
        public readonly ?string $arbitreId,
        public readonly string $status,
        public readonly string $createdAt,
        public readonly string $updatedAt
    ) {}

    public static function fromEntity(Matches $partit): self
    {
        return new self(
            id: $partit->id,
            jornadaId: $partit->jornadaId,
            localId: $partit->localId,
            visitantId: $partit->visitantId,
            dataHora: $partit->dataHora,
            pistaId: $partit->pistaId,
            arbitreId: $partit->arbitreId,
            status: $partit->status,
            createdAt: $partit->createdAt,
            updatedAt: $partit->updatedAt
        );
    }
}
