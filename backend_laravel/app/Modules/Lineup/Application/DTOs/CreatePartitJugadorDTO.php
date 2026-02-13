<?php

/**
 * DTO per crear un nou PartitJugador.
 *
 * Encapsula les dades necessàries per registrar un jugador
 * dins un partit amb els seus punts inicials.
 */

namespace App\Modules\Lineup\Application\DTOs;

class CreatePartitJugadorDTO
{
    public function __construct(
        public readonly string $partitId,
        public readonly string $jugadorId,
        public readonly string $equipId,
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
            equipId: $data['equipId'],
            punts: $data['punts'] ?? 0
        );
    }
}
