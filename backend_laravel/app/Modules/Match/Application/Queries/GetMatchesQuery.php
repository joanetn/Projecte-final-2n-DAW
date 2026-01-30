<?php

namespace App\Modules\Match\Application\Queries;

use Modules\Match\Domain\Repositories\MatchRepositoryInterface;

class GetMatchesQuery {
    public function __construct(
        private MatchRepositoryInterface $matchRepoInterf
    )
    {}

    public function execute(array $filters = [], int $perPage = 15) {
        return $this->matchRepoInterf->findAll($filters, $perPage);
    }
}