<?php

/**
 * Query per obtenir totes les Puntuacions.
 *
 * Retorna la llista completa de puntuacions actives.
 * Segueix el patró CQRS: query de lectura pura.
 */

namespace App\Modules\Lineup\Application\Queries;

use App\Modules\Lineup\Domain\Repositories\PuntuacioRepositoryInterface;

class GetPuntuacionsQuery
{
    public function __construct(
        private PuntuacioRepositoryInterface $puntuacioRepo
    ) {}

    /**
     * Retorna totes les puntuacions actives.
     */
    public function execute(): array
    {
        return $this->puntuacioRepo->findAll();
    }
}
