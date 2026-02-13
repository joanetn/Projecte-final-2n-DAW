<?php

/**
 * DTO per actualitzar una Alineació existent.
 *
 * Totes les propietats són nullable perquè només es passen
 * els camps que es volen actualitzar (patch parcial).
 */

namespace App\Modules\Lineup\Application\DTOs;

class UpdateAlineacioDTO
{
    public function __construct(
        public readonly ?string $posicio = null,
        public readonly ?bool $isActive = null
    ) {}

    /**
     * Crea el DTO a partir d'un array (normalment del request validat).
     */
    public static function fromArray(array $data): self
    {
        return new self(
            posicio: $data['posicio'] ?? null,
            isActive: isset($data['isActive']) ? (bool) $data['isActive'] : null
        );
    }
}
