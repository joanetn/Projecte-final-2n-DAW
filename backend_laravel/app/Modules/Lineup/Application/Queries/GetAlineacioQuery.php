<?php

/**
 * Query per obtenir una Alineació per ID.
 *
 * Busca una alineació concreta pel seu identificador.
 * Llança excepció 404 si no es troba.
 * Segueix el patró CQRS: query de lectura pura.
 */

namespace App\Modules\Lineup\Application\Queries;

use App\Modules\Lineup\Domain\Entities\Alineacio;
use App\Modules\Lineup\Domain\Repositories\AlineacioRepositoryInterface;
use App\Modules\Lineup\Domain\Exceptions\AlineacioNotFoundException;

class GetAlineacioQuery
{
    public function __construct(
        private AlineacioRepositoryInterface $alineacioRepo
    ) {}

    /**
     * Busca una alineació pel seu ID.
     * @throws AlineacioNotFoundException si no es troba
     */
    public function execute(string $alineacioId): Alineacio
    {
        $alineacio = $this->alineacioRepo->findById($alineacioId);

        if (!$alineacio) {
            throw new AlineacioNotFoundException($alineacioId);
        }

        return $alineacio;
    }
}
