<?php

namespace App\Modules\Venue\Domain\Entities;

class Instalacio
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
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
        // Relació carregada opcionalment (array de Pista)
        public readonly array $pistes = [],
    ) {}
}
