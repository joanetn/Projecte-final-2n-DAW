<?php

/**
 * DTO per actualitzar una Instal·lació existent.
 *
 * Tots els camps són opcionals (nullable) perquè es tracta d'un PATCH.
 * Només els camps amb valor no nul s'actualitzaran a la BD.
 */

namespace App\Modules\Venue\Application\DTOs;

class UpdateInstalacioDTO
{
    public function __construct(
        public readonly ?string $nom = null,
        public readonly ?string $adreca = null,
        public readonly ?string $telefon = null,
        public readonly ?string $tipusPista = null,
        public readonly ?int $numPistes = null,
        public readonly ?string $clubId = null,
        public readonly ?bool $isActive = null,
    ) {}

    /**
     * Factory method: crea el DTO des d'un array amb camps opcionals.
     */
    public static function fromArray(array $data): self
    {
        return new self(
            nom: $data['nom'] ?? null,
            adreca: $data['adreca'] ?? null,
            telefon: $data['telefon'] ?? null,
            tipusPista: $data['tipusPista'] ?? null,
            numPistes: isset($data['numPistes']) ? (int) $data['numPistes'] : null,
            clubId: $data['clubId'] ?? null,
            isActive: isset($data['isActive']) ? (bool) $data['isActive'] : null,
        );
    }
}
