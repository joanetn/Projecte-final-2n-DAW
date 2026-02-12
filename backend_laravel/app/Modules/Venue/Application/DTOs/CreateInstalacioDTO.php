<?php

/**
 * DTO per crear una nova Instal·lació.
 *
 * Encapsula les dades necessàries per crear una instal·lació.
 * El mètode fromArray() facilita la conversió des de dades del Request.
 * Només conté camps d'entrada, NO l'ID (es genera automàticament).
 */

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

    /**
     * Factory method: crea el DTO des d'un array (normalment del Request validat).
     */
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
