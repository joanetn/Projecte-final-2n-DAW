<?php

namespace App\Modules\League\Application\Queries;

use App\Modules\League\Domain\Entities\League;
use App\Modules\League\Domain\Exceptions\LeagueNotFoundException;
use App\Modules\League\Domain\Repositories\LeagueRepositoryInterface;

class GetLeagueDetailAdminQuery
{
    public function __construct(
        private LeagueRepositoryInterface $leagueRepositoryInterface
    ) {}

    public function execute(string $leagueId): League
    {
        $league = $this->leagueRepositoryInterface->findByIdIncludingInactiveWithRelations($leagueId, [
            'jornades',
            'equips',
            'classificacions'
        ]);
        if (!$league) {
            throw new LeagueNotFoundException($leagueId);
        }
        return $league;
    }
}
