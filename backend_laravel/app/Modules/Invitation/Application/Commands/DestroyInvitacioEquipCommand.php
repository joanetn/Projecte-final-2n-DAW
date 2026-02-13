<?php

namespace App\Modules\Invitation\Application\Commands;

use App\Modules\Invitation\Domain\Exceptions\InvitacioEquipNotFoundException;
use App\Modules\Invitation\Domain\Repositories\InvitacioEquipRepositoryInterface;

class DestroyInvitacioEquipCommand
{
    public function __construct(
        private InvitacioEquipRepositoryInterface $invitacioRepo
    ) {}

    public function execute(string $invitacioId): void
    {
        $invitacio = $this->invitacioRepo->findById($invitacioId);
        if (!$invitacio) {
            throw new InvitacioEquipNotFoundException();
        }

        $this->invitacioRepo->delete($invitacioId);
    }
}
