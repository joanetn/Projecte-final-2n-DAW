<?php

namespace App\Modules\Club\Domain\Entities;

class Club
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
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}
}
