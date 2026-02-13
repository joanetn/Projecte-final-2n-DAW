<?php

namespace App\Modules\Merchandise\Application\Queries;

use App\Modules\Merchandise\Application\DTOs\CompraDTO;
use App\Modules\Merchandise\Domain\Repositories\CompraRepositoryInterface;

class GetComprasByMerchQuery
{
    public function __construct(
        private CompraRepositoryInterface $repository,
    ) {}

    public function execute(string $merchId): array
    {
        $compras = $this->repository->findByMerch($merchId);

        return array_map(fn($compra) => CompraDTO::fromEntity($compra), $compras);
    }
}
