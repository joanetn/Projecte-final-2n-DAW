<?php

/**
 * Query per obtenir els Jugadors d'un Partit concret.
 *
 * Retorna tots els jugadors assignats a un partit específic.
 * Ideal per mostrar la llista de jugadors participants.
 */

namespace App\Modules\Lineup\Application\Queries;

use App\Modules\Lineup\Domain\Repositories\PartitJugadorRepositoryInterface;

class GetPartitJugadorsByPartitQuery
{
    public function __construct(
        private PartitJugadorRepositoryInterface $partitJugadorRepo
    ) {}

    /**
     * Retorna els jugadors d'un partit concret.
     */
    public function execute(string $partitId): array
    {
        return $this->partitJugadorRepo->findByPartit($partitId);
    }
}
