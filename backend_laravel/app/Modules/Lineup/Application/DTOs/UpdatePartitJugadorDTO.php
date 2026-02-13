<?php

/**
 * DTO per actualitzar un PartitJugador existent.
 *
 * Permet modificar els punts o l'estat actiu d'un jugador en un partit.
 * Les propietats nullable indiquen que només s'actualitzen els camps proporcionats.
 */

namespace App\Modules\Lineup\Application\DTOs;

class UpdatePartitJugadorDTO
{
    public function __construct(
        public readonly ?int $punts = null,
        public readonly ?bool $isActive = null
    ) {}

    /**
     * Crea el DTO a partir d'un array (normalment del request validat).
     */
    public static function fromArray(array $data): self
    {
        return new self(
            punts: $data['punts'] ?? null,
            isActive: isset($data['isActive']) ? (bool) $data['isActive'] : null
        );
    }
}
