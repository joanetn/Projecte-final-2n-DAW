<?php

/**
 * DTO per actualitzar una Pista existent.
 *
 * Camps opcionals per permetre actualitzacions parcials (PATCH).
 * Només els camps enviats (no nuls) s'actualitzaran.
 */

namespace App\Modules\Venue\Application\DTOs;

class UpdatePistaDTO
{
    public function __construct(
        public readonly ?string $nom = null,
        public readonly ?string $tipus = null,
        public readonly ?bool $isActive = null,
    ) {}

    /**
     * Factory method: crea el DTO des de les dades del Request.
     */
    public static function fromArray(array $data): self
    {
        return new self(
            nom: $data['nom'] ?? null,
            tipus: $data['tipus'] ?? null,
            isActive: isset($data['isActive']) ? (bool) $data['isActive'] : null,
        );
    }
}
