<?php

namespace App\Modules\Club\Application\Queries;

use App\Modules\Club\Domain\Entities\Equip;
use App\Modules\Club\Domain\Exceptions\EquipNotFoundException;
use App\Modules\Club\Domain\Repositories\EquipRepositoryInterface;

class GetEquipQuery
{
    public function __construct(
        private EquipRepositoryInterface $equipRepository
    ) {}

    public function execute(string $equipId): Equip
    {
        $equip = $this->equipRepository->findByIdWithRelations($equipId, ['club', 'equipUsuaris']);

        if (!$equip) {
            throw new EquipNotFoundException();
        }

        return $equip;
    }
}
