<?php

/**
 * Query per obtenir una Puntuació per ID.
 *
 * Busca una puntuació concreta pel seu identificador.
 * Llança excepció 404 si no es troba.
 */

namespace App\Modules\Lineup\Application\Queries;

use App\Modules\Lineup\Domain\Entities\Puntuacio;
use App\Modules\Lineup\Domain\Repositories\PuntuacioRepositoryInterface;
use App\Modules\Lineup\Domain\Exceptions\PuntuacioNotFoundException;

class GetPuntuacioQuery
{
    public function __construct(
        private PuntuacioRepositoryInterface $puntuacioRepo
    ) {}

    /**
     * Busca una puntuació pel seu ID.
     * @throws PuntuacioNotFoundException si no es troba
     */
    public function execute(string $puntuacioId): Puntuacio
    {
        $puntuacio = $this->puntuacioRepo->findById($puntuacioId);

        if (!$puntuacio) {
            throw new PuntuacioNotFoundException($puntuacioId);
        }

        return $puntuacio;
    }
}
