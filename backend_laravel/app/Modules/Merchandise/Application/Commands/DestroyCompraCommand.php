<?php

namespace App\Modules\Merchandise\Application\Commands;

use App\Modules\Merchandise\Domain\Exceptions\CompraNotFoundException;
use App\Modules\Merchandise\Domain\Repositories\CompraRepositoryInterface;

class DestroyCompraCommand
{
    public function __construct(
        private CompraRepositoryInterface $repository,
    ) {}

    public function execute(string $id): void
    {
        $compra = $this->repository->findById($id);

        if (!$compra) {
            throw new CompraNotFoundException($id);
        }

        $this->repository->delete($id);
    }
}
