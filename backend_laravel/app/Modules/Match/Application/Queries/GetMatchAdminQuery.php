<?php

namespace App\Modules\Match\Application\Queries;

use App\Modules\Match\Domain\Entities\Matches;
use App\Modules\Match\Domain\Repositories\MatchRepositoryInterface;
use App\Modules\Match\Domain\Exceptions\MatchNotFoundException;

class GetMatchAdminQuery
{
    public function __construct(
        private MatchRepositoryInterface $matchRepoInterf
    ) {}

    public function execute(string $matchId): Matches
    {
        $match = $this->matchRepoInterf->findByIdIncludingInactive($matchId);
        if (!$match) {
            throw new MatchNotFoundException($matchId);
        }
        return $match;
    }
}
