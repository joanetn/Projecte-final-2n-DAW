<?php

namespace App\Modules\Club\Application\DTOs;

use App\Modules\Club\Domain\Entities\Club;

class ClubDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $nom,
        public readonly ?string $descripcio = null,
        public readonly ?string $adreca = null,
        public readonly ?string $ciutat = null,
        public readonly ?string $codiPostal = null,
        public readonly ?string $provincia = null,
        public readonly ?string $telefon = null,
        public readonly ?string $email = null,
        public readonly ?string $web = null,
        public readonly ?int $anyFundacio = null,
        public readonly ?string $creadorId = null,
        public readonly bool $isActive = true,
        public readonly string $createdAt = '',
        public readonly string $updatedAt = '',
    ) {}

    public static function fromEntity(Club $club): self
    {
        return new self(
            id: $club->id,
            nom: $club->nom,
            descripcio: $club->descripcio,
            adreca: $club->adreca,
            ciutat: $club->ciutat,
            codiPostal: $club->codiPostal,
            provincia: $club->provincia,
            telefon: $club->telefon,
            email: $club->email,
            web: $club->web,
            anyFundacio: $club->anyFundacio,
            creadorId: $club->creadorId,
            isActive: $club->isActive,
            createdAt: $club->createdAt ?? date('Y-m-d H:i:s'),
            updatedAt: $club->updatedAt ?? date('Y-m-d H:i:s'),
        );
    }
}
