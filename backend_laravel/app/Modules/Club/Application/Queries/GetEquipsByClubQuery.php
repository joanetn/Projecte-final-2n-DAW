<?php

namespace App\Modules\Club\Application\Queries;

use App\Modules\Club\Domain\Repositories\EquipRepositoryInterface;

class GetEquipsByClubQuery
{
    public function __construct(
        private EquipRepositoryInterface $equipRepository
    ) {}

    public function execute(string $clubId): array
    {
        return $this->equipRepository->findByClubId($clubId);
    }
}
