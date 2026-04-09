<?php

namespace App\Modules\Match\Application\Queries;

use App\Modules\Match\Domain\Repositories\MatchRepositoryInterface;

class GetMatchesQuery
{
    public function __construct(
        private MatchRepositoryInterface $matchRepoInterf
    ) {}

    public function execute(?string $arbitreId = null, ?string $equipId = null, array $equipIds = [], ?string $status = null): array
    {
        return $this->matchRepoInterf->findFiltered($arbitreId, $equipId, $equipIds, $status);
    }
}
