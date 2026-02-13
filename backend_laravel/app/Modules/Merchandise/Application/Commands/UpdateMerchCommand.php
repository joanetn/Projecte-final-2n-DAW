<?php

namespace App\Modules\Merchandise\Application\Commands;

use App\Modules\Merchandise\Application\DTOs\UpdateMerchDTO;
use App\Modules\Merchandise\Domain\Exceptions\MerchNotFoundException;
use App\Modules\Merchandise\Domain\Repositories\MerchRepositoryInterface;

class UpdateMerchCommand
{
    public function __construct(
        private MerchRepositoryInterface $repository,
    ) {}

    public function execute(string $id, UpdateMerchDTO $dto): void
    {
        $merch = $this->repository->findById($id);

        if (!$merch) {
            throw new MerchNotFoundException($id);
        }

        $data = [];

        if ($dto->nom !== null) $data['nom'] = $dto->nom;
        if ($dto->marca !== null) $data['marca'] = $dto->marca;
        if ($dto->preu !== null) $data['preu'] = $dto->preu;
        if ($dto->stock !== null) $data['stock'] = $dto->stock;
        if ($dto->isActive !== null) $data['isActive'] = $dto->isActive;

        if (!empty($data)) {
            $this->repository->update($id, $data);
        }
    }
}
