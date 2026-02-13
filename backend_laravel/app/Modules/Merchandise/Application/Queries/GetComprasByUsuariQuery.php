<?php

namespace App\Modules\Merchandise\Application\Queries;

use App\Modules\Merchandise\Application\DTOs\CompraDTO;
use App\Modules\Merchandise\Domain\Repositories\CompraRepositoryInterface;

class GetComprasByUsuariQuery
{
    public function __construct(
        private CompraRepositoryInterface $repository,
    ) {}

    public function execute(string $usuariId): array
    {
        $compras = $this->repository->findByUsuari($usuariId);

        return array_map(fn($compra) => CompraDTO::fromEntity($compra), $compras);
    }
}
