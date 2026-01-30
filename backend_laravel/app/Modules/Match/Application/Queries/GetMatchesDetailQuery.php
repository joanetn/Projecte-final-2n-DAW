<?php

namespace App\Modules\Match\Application\Queries;

use Modules\Match\Domain\Entities\Matches;
use Modules\Match\Domain\Repositories\MatchRepositoryInterface;
use Modules\Match\Domain\Exceptions\MatchNotFoundException;

class GetMatchesDetailQuery {
    public function __construct(
        private MatchRepositoryInterface $matchRepoInterf
    )
    {}

    public function execute(string $matchId): Matches {
        $match = $this->matchRepoInterf->findByIdWithRelations($matchId, [
            'local',
            'visitant',
            'jornada',
            'pista',
            'arbitre',
            'setPartits',
            'alineacions',
            'acta'
        ]);

        if (!$match) {
            throw new MatchNotFoundException($matchId);
        }

        return $match;
    }
}