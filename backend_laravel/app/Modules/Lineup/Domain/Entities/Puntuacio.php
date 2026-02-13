<?php

/**
 * Entitat de domini Puntuacio (Scoring / Puntuació).
 *
 * Representa la puntuació acumulada d'un jugador en un partit.
 * Serveix per portar les estadístiques individuals de cada jugador.
 * Separada de PartitJugador per mantenir les estadístiques desacoblades.
 */

namespace App\Modules\Lineup\Domain\Entities;

class Puntuacio
{
    public function __construct(
        public readonly string $id,
        public readonly string $partitId,
        public readonly string $jugadorId,
        public readonly int $punts = 0,
        public readonly bool $isActive = true,
        // Relacions opcionals carregades sota demanda
        public readonly ?object $partit = null,
        public readonly ?object $jugador = null
    ) {}

    /**
     * Comprova si el jugador ha puntuat.
     */
    public function hasPunts(): bool
    {
        return $this->punts > 0;
    }

    /**
     * Comprova si el registre de puntuació està actiu.
     */
    public function isActive(): bool
    {
        return $this->isActive;
    }
}
