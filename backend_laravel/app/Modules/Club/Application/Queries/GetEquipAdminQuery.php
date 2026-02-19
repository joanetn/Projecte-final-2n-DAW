<?php

namespace App\Modules\Club\Application\Queries;

use App\Modules\Club\Domain\Entities\Equip;
use App\Modules\Club\Domain\Exceptions\EquipNotFoundException;
use App\Modules\Club\Domain\Repositories\EquipRepositoryInterface;

class GetEquipAdminQuery
{
    public function __construct(
        private EquipRepositoryInterface $equipRepository
    ) {}

    public function execute(string $equipId): Equip
    {
        $equip = $this->equipRepository->findByIdIncludingInactive($equipId);

        if (!$equip) {
            throw new EquipNotFoundException();
        }

        return $equip;
    }
}
