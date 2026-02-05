<?php

namespace App\Modules\League\Application\Queries;

use App\Modules\League\Domain\Entities\Standing;
use App\Modules\League\Domain\Exceptions\StandingNotFoundException;
use App\Modules\League\Domain\Repositories\StandingRepositoryInterface;

class GetStandingsDetailQuery
{
    public function __construct(
        private StandingRepositoryInterface $standingRepositoryInterface
    ) {}

    public function execute(string $standingId): Standing
    {
        $standing = $this->standingRepositoryInterface->findByIdWithRelations($standingId, [
            'lliga',
            'equip'
        ]);

        if (!$standing) {
            throw new StandingNotFoundException($standingId);
        }

        return $standing;
    }
}
