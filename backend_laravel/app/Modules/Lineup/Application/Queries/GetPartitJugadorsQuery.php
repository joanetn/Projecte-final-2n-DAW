<?php

/**
 * Query per obtenir tots els PartitJugadors.
 *
 * Retorna la llista completa de jugadors assignats a partits.
 * Segueix el patró CQRS: query de lectura pura.
 */

namespace App\Modules\Lineup\Application\Queries;

use App\Modules\Lineup\Domain\Repositories\PartitJugadorRepositoryInterface;

class GetPartitJugadorsQuery
{
    public function __construct(
        private PartitJugadorRepositoryInterface $partitJugadorRepo
    ) {}

    /**
     * Retorna tots els registres actius de jugadors en partits.
     */
    public function execute(): array
    {
        return $this->partitJugadorRepo->findAll();
    }
}
