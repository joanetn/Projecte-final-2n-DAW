<?php

namespace App\Modules\Merchandise\Application\Queries;

use App\Modules\Merchandise\Application\DTOs\MerchDTO;
use App\Modules\Merchandise\Domain\Repositories\MerchRepositoryInterface;

class GetMerchsAdminQuery
{
    public function __construct(
        private MerchRepositoryInterface $repository,
    ) {}

    public function execute(): array
    {
        $merchs = $this->repository->findAllIncludingInactive();
        return array_map(fn($merch) => MerchDTO::fromEntity($merch), $merchs);
    }
}
