<?php

/**
 * Query per obtenir el Rànquing de Jugadors.
 *
 * Retorna els jugadors ordenats per punts totals de manera descendent.
 * Útil per mostrar la classificació individual de jugadors.
 */

namespace App\Modules\Lineup\Application\Queries;

use App\Modules\Lineup\Domain\Repositories\PuntuacioRepositoryInterface;

class GetRankingQuery
{
    public function __construct(
        private PuntuacioRepositoryInterface $puntuacioRepo
    ) {}

    /**
     * Retorna el rànquing de jugadors ordenat per punts totals.
     */
    public function execute(): array
    {
        return $this->puntuacioRepo->getRanking();
    }
}
