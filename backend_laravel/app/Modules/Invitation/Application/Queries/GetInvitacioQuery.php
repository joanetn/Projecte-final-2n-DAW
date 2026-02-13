<?php

namespace App\Modules\Invitation\Application\Queries;

use App\Modules\Invitation\Domain\Entities\InvitacioEquip;
use App\Modules\Invitation\Domain\Exceptions\InvitacioEquipNotFoundException;
use App\Modules\Invitation\Domain\Repositories\InvitacioEquipRepositoryInterface;

class GetInvitacioQuery
{
    public function __construct(
        private InvitacioEquipRepositoryInterface $invitacioRepo
    ) {}

    public function execute(string $invitacioId): InvitacioEquip
    {
        $invitacio = $this->invitacioRepo->findByIdWithRelations($invitacioId, ['equip', 'usuari']);

        if (!$invitacio) {
            throw new InvitacioEquipNotFoundException();
        }

        return $invitacio;
    }
}
