<?php

namespace App\Modules\Venue\Application\DTOs;

class CreateInstalacioDTO
{
    public function __construct(
        public readonly string $nom,
        public readonly ?string $adreca = null,
        public readonly ?string $telefon = null,
        public readonly ?string $tipusPista = null,
        public readonly ?int $numPistes = null,
        public readonly ?string $clubId = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nom: $data['nom'],
            adreca: $data['adreca'] ?? null,
            telefon: $data['telefon'] ?? null,
            tipusPista: $data['tipusPista'] ?? null,
            numPistes: isset($data['numPistes']) ? (int) $data['numPistes'] : null,
            clubId: $data['clubId'] ?? null,
        );
    }
}
