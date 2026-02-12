<?php

namespace App\Modules\Club\Application\Queries;

use App\Modules\Club\Domain\Repositories\EquipUsuariRepositoryInterface;

class GetEquipMembresQuery
{
    public function __construct(
        private EquipUsuariRepositoryInterface $equipUsuariRepository
    ) {}

    public function execute(string $equipId): array
    {
        return $this->equipUsuariRepository->findByEquipId($equipId);
    }
}
