<?php

namespace App\Modules\Club\Application\Queries;

use App\Modules\Club\Domain\Repositories\EquipRepositoryInterface;

class GetEquipsAdminQuery
{
    public function __construct(
        private EquipRepositoryInterface $equipRepository
    ) {}

    public function execute(): array
    {
        return $this->equipRepository->findAllIncludingInactive();
    }
}
