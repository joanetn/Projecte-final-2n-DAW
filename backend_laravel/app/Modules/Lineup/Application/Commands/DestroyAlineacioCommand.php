<?php

/**
 * Command per eliminar (soft delete) una Alineació.
 *
 * Executa la lògica d'eliminació:
 * 1. Busca l'alineació pel seu ID (llança excepció si no existeix)
 * 2. Fa soft delete (isActive = false) en lloc d'eliminar físicament
 * 3. Dispara l'event AlineacioDeletedEvent per notificar altres mòduls
 */

namespace App\Modules\Lineup\Application\Commands;

use App\Modules\Lineup\Domain\Repositories\AlineacioRepositoryInterface;
use App\Modules\Lineup\Domain\Exceptions\AlineacioNotFoundException;
use App\Modules\Lineup\Domain\Events\AlineacioDeletedEvent;
use Illuminate\Support\Facades\Event;

class DestroyAlineacioCommand
{
    public function __construct(
        private AlineacioRepositoryInterface $alineacioRepo
    ) {}

    public function execute(string $alineacioId): void
    {
        // Busquem l'alineació, si no existeix llancem excepció 404
        $alineacio = $this->alineacioRepo->findById($alineacioId);

        if (!$alineacio) {
            throw new AlineacioNotFoundException($alineacioId);
        }

        // Soft delete: marquem com a inactiva
        $this->alineacioRepo->delete($alineacioId);

        // Disparem l'event d'eliminació
        Event::dispatch(new AlineacioDeletedEvent($alineacio));
    }
}
