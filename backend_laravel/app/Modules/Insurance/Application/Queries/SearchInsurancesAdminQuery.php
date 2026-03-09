<?php

namespace App\Modules\Insurance\Application\Queries;

use App\Modules\Insurance\Domain\Repositories\InsuranceRepositoryInterface;

class SearchInsurancesAdminQuery
{
    public function __construct(
        private InsuranceRepositoryInterface $repo
    ) {}

    public function execute(
        ?string $q = null,
        ?bool $pagat = null,
        ?string $minPrice = null,
        ?string $maxPrice = null,
        string $sort = 'created_at_desc',
        int $page = 1,
        int $limit = 20
    ): array {
        return $this->repo->searchWithFilters(
            q: $q,
            sort: $sort,
            minPrice: $minPrice,
            maxPrice: $maxPrice,
            pagat: $pagat,
            page: $page,
            limit: $limit
        );
    }
}
