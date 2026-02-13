<?php

namespace App\Modules\Venue\Application\DTOs;

use App\Modules\Venue\Domain\Entities\Instalacio;

class InstalacioDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $nom,
        public readonly ?string $adreca = null,
        public readonly ?string $telefon = null,
        public readonly ?string $tipusPista = null,
        public readonly ?int $numPistes = null,
        public readonly ?string $clubId = null,
        public readonly bool $isActive = true,
        public readonly string $createdAt = '',
        public readonly string $updatedAt = '',
    ) {}

    public static function fromEntity(Instalacio $instalacio): self
    {
        return new self(
            id: $instalacio->id,
            nom: $instalacio->nom,
            adreca: $instalacio->adreca,
            telefon: $instalacio->telefon,
            tipusPista: $instalacio->tipusPista,
            numPistes: $instalacio->numPistes,
            clubId: $instalacio->clubId,
            isActive: $instalacio->isActive,
            createdAt: $instalacio->createdAt ?? date('Y-m-d H:i:s'),
            updatedAt: $instalacio->updatedAt ?? date('Y-m-d H:i:s'),
        );
    }
}
