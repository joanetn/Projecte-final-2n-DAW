<?php

namespace App\Modules\Match\Application\Queries;

use App\Modules\Match\Domain\Entities\Matches;
use App\Modules\Match\Domain\Repositories\MatchRepositoryInterface;
use App\Modules\Match\Domain\Exceptions\MatchNotFoundException;

class GetMatchQuery
{
    public function __construct(
        private MatchRepositoryInterface $matchRepoInterf
    ) {}

    public function execute(string $matchId): Matches
    {
        $match = $this->matchRepoInterf->findById($matchId);

        if (!$match) {
            throw new MatchNotFoundException($matchId);
        }

        return $match;
    }
}
