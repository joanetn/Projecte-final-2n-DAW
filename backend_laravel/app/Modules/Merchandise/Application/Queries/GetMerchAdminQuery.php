<?php

namespace App\Modules\Merchandise\Application\Queries;

use App\Modules\Merchandise\Application\DTOs\MerchDTO;
use App\Modules\Merchandise\Domain\Exceptions\MerchNotFoundException;
use App\Modules\Merchandise\Domain\Repositories\MerchRepositoryInterface;

class GetMerchAdminQuery
{
    public function __construct(
        private MerchRepositoryInterface $repository,
    ) {}

    public function execute(string $id): MerchDTO
    {
        $merch = $this->repository->findByIdIncludingInactive($id);
        if (!$merch) {
            throw new MerchNotFoundException($id);
        }
        return MerchDTO::fromEntity($merch);
    }
}
