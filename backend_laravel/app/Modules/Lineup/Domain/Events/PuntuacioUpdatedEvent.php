<?php

/**
 * Event de domini: Puntuació actualitzada.
 *
 * Es dispara quan s'actualitza la puntuació d'un jugador.
 * Útil per recalcular rànquings o actualitzar classificacions
 * en temps real.
 */

namespace App\Modules\Lineup\Domain\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PuntuacioUpdatedEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly string $puntuacioId,
        public readonly string $jugadorId,
        public readonly int $punts
    ) {}
}
