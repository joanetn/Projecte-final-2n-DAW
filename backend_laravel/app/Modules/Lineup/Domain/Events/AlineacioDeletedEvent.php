<?php

/**
 * Event de domini: Alineació eliminada.
 *
 * Es dispara quan s'elimina (soft delete) una alineació.
 * Permet a altres mòduls reaccionar a l'eliminació
 * (per exemple, alliberar posicions o actualitzar comptadors).
 */

namespace App\Modules\Lineup\Domain\Events;

use App\Modules\Lineup\Domain\Entities\Alineacio;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AlineacioDeletedEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Alineacio $alineacio
    ) {}
}
