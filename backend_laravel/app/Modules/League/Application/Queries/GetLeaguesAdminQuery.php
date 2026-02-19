<?php

namespace App\Modules\League\Application\Queries;

use App\Modules\League\Domain\Repositories\LeagueRepositoryInterface;

class GetLeaguesAdminQuery
{
    public function __construct(
        private LeagueRepositoryInterface $leagueRepositoryInterface
    ) {}

    public function execute(): array
    {
        return $this->leagueRepositoryInterface->findAllIncludingInactive();
    }
}
