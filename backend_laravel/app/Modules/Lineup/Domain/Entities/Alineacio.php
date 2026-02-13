<?php

/**
 * Entitat de domini Alineacio (Lineup).
 *
 * Representa una alineació d'un jugador en un partit concret.
 * Cada alineació vincula un jugador, un equip i un partit amb la seva posició.
 * És immutable gràcies a les propietats readonly (patró Value Object).
 */

namespace App\Modules\Lineup\Domain\Entities;

class Alineacio
{
    public function __construct(
        public readonly string $id,
        public readonly string $partitId,
        public readonly string $jugadorId,
        public readonly string $equipId,
        public readonly ?string $posicio,
        public readonly bool $isActive = true,
        public readonly ?string $creadaAt = null,
        // Relacions opcionals carregades sota demanda
        public readonly ?object $partit = null,
        public readonly ?object $jugador = null,
        public readonly ?object $equip = null
    ) {}

    /**
     * Comprova si l'alineació està activa.
     */
    public function isActive(): bool
    {
        return $this->isActive;
    }

    /**
     * Comprova si l'alineació té posició assignada.
     */
    public function hasPosicio(): bool
    {
        return $this->posicio !== null;
    }
}
