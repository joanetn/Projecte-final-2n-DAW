<?php

namespace App\Modules\Club\Application\Commands;

use App\Modules\Club\Domain\Exceptions\EquipNotFoundException;
use App\Modules\Club\Domain\Repositories\EquipRepositoryInterface;

class DestroyEquipAdminCommand
{
    public function __construct(
        private EquipRepositoryInterface $equipRepository
    ) {}

    public function execute(string $equipId): void
    {
        $equip = $this->equipRepository->findByIdIncludingInactive($equipId);
        if (!$equip) {
            throw new EquipNotFoundException();
        }

        $this->equipRepository->delete($equipId);
    }
}
