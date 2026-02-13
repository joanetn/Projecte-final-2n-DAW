<?php

/**
 * DTO per crear una nova Puntuació.
 *
 * Encapsula les dades per registrar la puntuació
 * d'un jugador en un partit concret.
 */

namespace App\Modules\Lineup\Application\DTOs;

class CreatePuntuacioDTO
{
    public function __construct(
        public readonly string $partitId,
        public readonly string $jugadorId,
        public readonly int $punts = 0
    ) {}

    /**
     * Crea el DTO a partir d'un array (normalment del request validat).
     */
    public static function fromArray(array $data): self
    {
        return new self(
            partitId: $data['partitId'],
            jugadorId: $data['jugadorId'],
            punts: $data['punts'] ?? 0
        );
    }
}
