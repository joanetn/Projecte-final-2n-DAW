<?php

/**
 * DTO per crear una nova Alineació.
 *
 * Data Transfer Object que encapsula les dades necessàries
 * per crear una alineació. Valida l'estructura de les dades
 * abans de passar-les al Command.
 */

namespace App\Modules\Lineup\Application\DTOs;

class CreateAlineacioDTO
{
    public function __construct(
        public readonly string $partitId,
        public readonly string $jugadorId,
        public readonly string $equipId,
        public readonly ?string $posicio = null
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
            posicio: $data['posicio'] ?? null
        );
    }
}
