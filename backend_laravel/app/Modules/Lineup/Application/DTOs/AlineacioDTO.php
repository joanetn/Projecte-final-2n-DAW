<?php

/**
 * DTO de lectura per Alineació.
 *
 * S'utilitza per transformar l'entitat de domini en un objecte
 * de transferència llegible per la capa de presentació.
 * Desacobla l'entitat del format de resposta.
 */

namespace App\Modules\Lineup\Application\DTOs;

use App\Modules\Lineup\Domain\Entities\Alineacio;

class AlineacioDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $partitId,
        public readonly string $jugadorId,
        public readonly string $equipId,
        public readonly ?string $posicio,
        public readonly bool $isActive,
        public readonly ?string $creadaAt
    ) {}

    /**
     * Crea el DTO a partir de l'entitat de domini.
     */
    public static function fromEntity(Alineacio $alineacio): self
    {
        return new self(
            id: $alineacio->id,
            partitId: $alineacio->partitId,
            jugadorId: $alineacio->jugadorId,
            equipId: $alineacio->equipId,
            posicio: $alineacio->posicio,
            isActive: $alineacio->isActive,
            creadaAt: $alineacio->creadaAt
        );
    }
}
