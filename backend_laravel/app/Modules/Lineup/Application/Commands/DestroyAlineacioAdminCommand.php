<?php

namespace App\Modules\Lineup\Application\Commands;

use App\Modules\Lineup\Domain\Repositories\AlineacioRepositoryInterface;
use App\Modules\Lineup\Domain\Exceptions\AlineacioNotFoundException;

class DestroyAlineacioAdminCommand
{
    public function __construct(
        private AlineacioRepositoryInterface $alineacioRepo
    ) {}

    public function execute(string $alineacioId): void
    {
        $alineacio = $this->alineacioRepo->findByIdIncludingInactive($alineacioId);
        if (!$alineacio) {
            throw new AlineacioNotFoundException($alineacioId);
        }

        $this->alineacioRepo->delete($alineacioId);
    }
}
