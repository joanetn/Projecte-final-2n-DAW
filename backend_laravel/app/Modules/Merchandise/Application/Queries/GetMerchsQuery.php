<?php

namespace App\Modules\Merchandise\Application\Queries;

use App\Modules\Merchandise\Application\DTOs\MerchDTO;
use App\Modules\Merchandise\Domain\Repositories\MerchRepositoryInterface;

class GetMerchsQuery
{
    public function __construct(
        private MerchRepositoryInterface $repository,
    ) {}

    public function execute(): array
    {
        $merchs = $this->repository->findAllWithRelations(['compras']);

        return array_map(fn($merch) => MerchDTO::fromEntity($merch), $merchs);
    }
}
