<?php

namespace App\Modules\Match\Application\Queries;

use App\Modules\Match\Domain\Repositories\MatchRepositoryInterface;

class GetMatchesAdminQuery
{
    public function __construct(
        private MatchRepositoryInterface $matchRepoInterf
    ) {}

    public function execute(): array
    {
        return $this->matchRepoInterf->findAllIncludingInactive();
    }
}
