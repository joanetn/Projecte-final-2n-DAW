<?php

namespace App\Modules\Merchandise\Application\Queries;

use App\Modules\Merchandise\Domain\Repositories\MerchRepositoryInterface;

class SearchMerchQuery
{
    public function __construct(
        private MerchRepositoryInterface $merchRepositoryInterface
    ) {}

    public function execute(
        ?string $q = null,
        ?string $marca = null,
        ?string $minPrice = null,
        ?string $maxPrice = null,
        string $sort = 'id',
        int $page = 1,
        int $limit = 20
    ): array {
        return $this->merchRepositoryInterface->searchWithFilters(
            q: $q,
            marca: $marca,
            minPrice: $minPrice,
            maxPrice: $maxPrice,
            sort: $sort,
            page: $page,
            limit: $limit
        );
    }
}
