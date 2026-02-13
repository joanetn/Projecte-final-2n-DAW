<?php

/**
 * Command per eliminar (soft delete) un PartitJugador.
 *
 * Executa la lògica d'eliminació:
 * 1. Busca el registre pel seu ID (llança excepció si no existeix)
 * 2. Fa soft delete (isActive = false) en lloc d'eliminar físicament
 */

namespace App\Modules\Lineup\Application\Commands;

use App\Modules\Lineup\Domain\Repositories\PartitJugadorRepositoryInterface;
use App\Modules\Lineup\Domain\Exceptions\PartitJugadorNotFoundException;

class DestroyPartitJugadorCommand
{
    public function __construct(
        private PartitJugadorRepositoryInterface $partitJugadorRepo
    ) {}

    public function execute(string $partitJugadorId): void
    {
        // Busquem el registre, si no existeix llancem excepció 404
        $partitJugador = $this->partitJugadorRepo->findById($partitJugadorId);

        if (!$partitJugador) {
            throw new PartitJugadorNotFoundException($partitJugadorId);
        }

        // Soft delete: marquem com a inactiu
        $this->partitJugadorRepo->delete($partitJugadorId);
    }
}
