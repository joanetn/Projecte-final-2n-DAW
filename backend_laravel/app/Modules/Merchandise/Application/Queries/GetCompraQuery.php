<?php

namespace App\Modules\Merchandise\Application\Queries;

use App\Modules\Merchandise\Application\DTOs\CompraDTO;
use App\Modules\Merchandise\Domain\Exceptions\CompraNotFoundException;
use App\Modules\Merchandise\Domain\Repositories\CompraRepositoryInterface;

class GetCompraQuery
{
    public function __construct(
        private CompraRepositoryInterface $repository,
    ) {}

    public function execute(string $id): CompraDTO
    {
        $compra = $this->repository->findByIdWithRelations($id, ['usuari', 'merch']);

        if (!$compra) {
            throw new CompraNotFoundException($id);
        }

        return CompraDTO::fromEntity($compra);
    }
}
