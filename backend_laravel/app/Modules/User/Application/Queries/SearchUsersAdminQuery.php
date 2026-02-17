<?php

namespace App\Modules\User\Application\Queries;

use App\Modules\User\Domain\Repositories\UserRepositoryInterface;

class SearchUsersAdminQuery
{
    public function __construct(
        private UserRepositoryInterface $userRepositoryInterface
    ) {}

    public function execute(
        ?string $q = null,
        ?string $nivell = null,
        string $sort = 'created_at_desc',
        int $page = 1,
        int $limit = 20
    ): array {
        return $this->userRepositoryInterface->searchWithFilters(
            q: $q,
            nivell: $nivell,
            sort: $sort,
            page: $page,
            limit: $limit
        );
    }
}
