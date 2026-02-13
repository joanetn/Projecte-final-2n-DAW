<?php

/**
 * Entitat de domini PartitJugador (Match Player / Jugador per Partit).
 *
 * Representa la participació d'un jugador dins un partit específic.
 * Emmagatzema els punts que ha aconseguit el jugador en aquell partit.
 * Forma part del context d'alineacions i estadístiques.
 */

namespace App\Modules\Lineup\Domain\Entities;

class PartitJugador
{
    public function __construct(
        public readonly string $id,
        public readonly string $partitId,
        public readonly string $jugadorId,
        public readonly string $equipId,
        public readonly int $punts = 0,
        public readonly bool $isActive = true,
        // Relacions opcionals carregades sota demanda
        public readonly ?object $partit = null,
        public readonly ?object $jugador = null,
        public readonly ?object $equip = null
    ) {}

    /**
     * Comprova si el jugador ha puntuat en aquest partit.
     */
    public function hasPunts(): bool
    {
        return $this->punts > 0;
    }

    /**
     * Comprova si el registre està actiu.
     */
    public function isActive(): bool
    {
        return $this->isActive;
    }
}
