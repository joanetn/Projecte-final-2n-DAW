<?php

namespace App\Modules\Lineup\Application\Queries;

use App\Modules\Lineup\Domain\Repositories\AlineacioRepositoryInterface;

class GetAlineacionsAdminQuery
{
    public function __construct(
        private AlineacioRepositoryInterface $alineacioRepo
    ) {}

    public function execute(): array
    {
        return $this->alineacioRepo->findAllIncludingInactive();
    }
}
