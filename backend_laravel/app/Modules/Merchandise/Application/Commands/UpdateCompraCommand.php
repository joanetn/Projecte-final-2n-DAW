<?php

namespace App\Modules\Merchandise\Application\Commands;

use App\Modules\Merchandise\Application\DTOs\UpdateCompraDTO;
use App\Modules\Merchandise\Domain\Exceptions\CompraNotFoundException;
use App\Modules\Merchandise\Domain\Repositories\CompraRepositoryInterface;

class UpdateCompraCommand
{
    public function __construct(
        private CompraRepositoryInterface $repository,
    ) {}

    public function execute(string $id, UpdateCompraDTO $dto): void
    {
        $compra = $this->repository->findById($id);

        if (!$compra) {
            throw new CompraNotFoundException($id);
        }

        $data = [];

        if ($dto->quantitat !== null) $data['quantitat'] = $dto->quantitat;
        if ($dto->total !== null) $data['total'] = $dto->total;
        if ($dto->pagat !== null) $data['pagat'] = $dto->pagat;
        if ($dto->status !== null) $data['status'] = $dto->status;
        if ($dto->isActive !== null) $data['isActive'] = $dto->isActive;

        if (!empty($data)) {
            $this->repository->update($id, $data);
        }
    }
}
