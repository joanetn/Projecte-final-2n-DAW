<?php

/**
 * Command per eliminar (soft delete) una Puntuació.
 *
 * Executa la lògica d'eliminació:
 * 1. Busca la puntuació pel seu ID (llança excepció si no existeix)
 * 2. Fa soft delete (isActive = false) en lloc d'eliminar físicament
 */

namespace App\Modules\Lineup\Application\Commands;

use App\Modules\Lineup\Domain\Repositories\PuntuacioRepositoryInterface;
use App\Modules\Lineup\Domain\Exceptions\PuntuacioNotFoundException;

class DestroyPuntuacioCommand
{
    public function __construct(
        private PuntuacioRepositoryInterface $puntuacioRepo
    ) {}

    public function execute(string $puntuacioId): void
    {
        // Busquem la puntuació, si no existeix llancem excepció 404
        $puntuacio = $this->puntuacioRepo->findById($puntuacioId);

        if (!$puntuacio) {
            throw new PuntuacioNotFoundException($puntuacioId);
        }

        // Soft delete: marquem com a inactiva
        $this->puntuacioRepo->delete($puntuacioId);
    }
}
