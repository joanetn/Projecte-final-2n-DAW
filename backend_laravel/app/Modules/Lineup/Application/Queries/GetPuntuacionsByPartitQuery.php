<?php

/**
 * Query per obtenir les Puntuacions d'un Partit concret.
 *
 * Retorna totes les puntuacions d'un partit específic.
 * Ideal per mostrar les estadístiques del partit.
 */

namespace App\Modules\Lineup\Application\Queries;

use App\Modules\Lineup\Domain\Repositories\PuntuacioRepositoryInterface;

class GetPuntuacionsByPartitQuery
{
    public function __construct(
        private PuntuacioRepositoryInterface $puntuacioRepo
    ) {}

    /**
     * Retorna les puntuacions d'un partit concret.
     */
    public function execute(string $partitId): array
    {
        return $this->puntuacioRepo->findByPartit($partitId);
    }
}
