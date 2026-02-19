<?php

namespace App\Modules\Merchandise\Application\Commands;

use App\Modules\Merchandise\Domain\Exceptions\MerchNotFoundException;
use App\Modules\Merchandise\Domain\Repositories\MerchRepositoryInterface;

class DestroyMerchAdminCommand
{
    public function __construct(
        private MerchRepositoryInterface $repository,
    ) {}

    public function execute(string $id): void
    {
        $merch = $this->repository->findByIdIncludingInactive($id);
        if (!$merch) {
            throw new MerchNotFoundException($id);
        }
        $this->repository->delete($id);
    }
}
