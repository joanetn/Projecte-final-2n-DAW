<?php

/**
 * Query per obtenir totes les Alineacions.
 *
 * Retorna la llista completa d'alineacions actives del sistema.
 * Segueix el patró CQRS (Command Query Responsibility Segregation):
 * les queries només llegeixen dades, mai les modifiquen.
 */

namespace App\Modules\Lineup\Application\Queries;

use App\Modules\Lineup\Domain\Repositories\AlineacioRepositoryInterface;

class GetAlineacionsQuery
{
    public function __construct(
        private AlineacioRepositoryInterface $alineacioRepo
    ) {}

    /**
     * Retorna totes les alineacions actives.
     */
    public function execute(): array
    {
        return $this->alineacioRepo->findAll();
    }
}
