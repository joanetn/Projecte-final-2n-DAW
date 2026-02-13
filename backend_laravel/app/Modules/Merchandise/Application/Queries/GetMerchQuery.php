<?php

namespace App\Modules\Merchandise\Application\Queries;

use App\Modules\Merchandise\Application\DTOs\MerchDTO;
use App\Modules\Merchandise\Domain\Exceptions\MerchNotFoundException;
use App\Modules\Merchandise\Domain\Repositories\MerchRepositoryInterface;

class GetMerchQuery
{
    public function __construct(
        private MerchRepositoryInterface $repository,
    ) {}

    public function execute(string $id): MerchDTO
    {
        $merch = $this->repository->findByIdWithRelations($id, ['compras']);

        if (!$merch) {
            throw new MerchNotFoundException($id);
        }

        return MerchDTO::fromEntity($merch);
    }
}
