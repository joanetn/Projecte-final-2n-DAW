<?php

namespace App\Modules\Merchandise\Application\Queries;

use App\Modules\Merchandise\Application\DTOs\CompraDTO;
use App\Modules\Merchandise\Domain\Repositories\CompraRepositoryInterface;

class GetComprasQuery
{
    public function __construct(
        private CompraRepositoryInterface $repository,
    ) {}

    public function execute(): array
    {
        $compras = $this->repository->findAllWithRelations(['usuari', 'merch']);

        return array_map(fn($compra) => CompraDTO::fromEntity($compra), $compras);
    }
}
