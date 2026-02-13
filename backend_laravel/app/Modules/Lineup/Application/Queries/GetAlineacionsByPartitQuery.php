<?php

/**
 * Query per obtenir les Alineacions d'un Partit amb detall.
 *
 * Retorna totes les alineacions d'un partit concret amb les relacions
 * carregades (jugador, equip). Ideal per mostrar la formació completa.
 */

namespace App\Modules\Lineup\Application\Queries;

use App\Modules\Lineup\Domain\Repositories\AlineacioRepositoryInterface;

class GetAlineacionsByPartitQuery
{
    public function __construct(
        private AlineacioRepositoryInterface $alineacioRepo
    ) {}

    /**
     * Retorna les alineacions d'un partit concret.
     */
    public function execute(string $partitId): array
    {
        return $this->alineacioRepo->findByPartit($partitId);
    }
}
