<?php

namespace App\Modules\Invitation\Application\Queries;

use App\Modules\Invitation\Domain\Repositories\InvitacioEquipRepositoryInterface;

class GetInvitacionsQuery
{
    public function __construct(
        private InvitacioEquipRepositoryInterface $invitacioRepo
    ) {}

    public function execute(): array
    {
        return $this->invitacioRepo->findAllWithRelations(['equip', 'usuari']);
    }
}
