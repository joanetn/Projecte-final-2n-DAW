<?php

namespace App\Modules\Lineup\Application\Queries;

use App\Modules\Lineup\Domain\Entities\Alineacio;
use App\Modules\Lineup\Domain\Repositories\AlineacioRepositoryInterface;
use App\Modules\Lineup\Domain\Exceptions\AlineacioNotFoundException;

class GetAlineacioAdminQuery
{
    public function __construct(
        private AlineacioRepositoryInterface $alineacioRepo
    ) {}

    public function execute(string $alineacioId): Alineacio
    {
        $alineacio = $this->alineacioRepo->findByIdIncludingInactive($alineacioId);

        if (!$alineacio) {
            throw new AlineacioNotFoundException($alineacioId);
        }

        return $alineacio;
    }
}
