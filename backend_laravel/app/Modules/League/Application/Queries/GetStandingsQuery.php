<?php

namespace App\Modules\League\Application\Queries;

use App\Modules\League\Domain\Repositories\StandingRepositoryInterface;

class GetStandingsQuery
{
    public function __construct(
        private StandingRepositoryInterface $standingRepositoryInterface
    ) {}

    public function execute(?string $lligaId = null, ?string $equipId = null): array
    {
        if ($lligaId) {
            return $this->standingRepositoryInterface->findByLeague($lligaId);
        }

        if ($equipId) {
            return $this->standingRepositoryInterface->findByEquip($equipId);
        }

        return $this->standingRepositoryInterface->findAll();
    }
}
