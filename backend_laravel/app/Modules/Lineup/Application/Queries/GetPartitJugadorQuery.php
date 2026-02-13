<?php

/**
 * Query per obtenir un PartitJugador per ID.
 *
 * Busca un registre concret de jugador-partit pel seu identificador.
 * Llança excepció 404 si no es troba.
 */

namespace App\Modules\Lineup\Application\Queries;

use App\Modules\Lineup\Domain\Entities\PartitJugador;
use App\Modules\Lineup\Domain\Repositories\PartitJugadorRepositoryInterface;
use App\Modules\Lineup\Domain\Exceptions\PartitJugadorNotFoundException;

class GetPartitJugadorQuery
{
    public function __construct(
        private PartitJugadorRepositoryInterface $partitJugadorRepo
    ) {}

    /**
     * Busca un registre de jugador-partit pel seu ID.
     * @throws PartitJugadorNotFoundException si no es troba
     */
    public function execute(string $partitJugadorId): PartitJugador
    {
        $partitJugador = $this->partitJugadorRepo->findById($partitJugadorId);

        if (!$partitJugador) {
            throw new PartitJugadorNotFoundException($partitJugadorId);
        }

        return $partitJugador;
    }
}
