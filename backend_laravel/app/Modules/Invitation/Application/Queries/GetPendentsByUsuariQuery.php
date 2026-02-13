<?php

namespace App\Modules\Invitation\Application\Queries;

use App\Modules\Invitation\Domain\Repositories\InvitacioEquipRepositoryInterface;

class GetPendentsByUsuariQuery
{
    public function __construct(
        private InvitacioEquipRepositoryInterface $invitacioRepo
    ) {}

    public function execute(string $usuariId): array
    {
        return $this->invitacioRepo->findPendentsByUsuari($usuariId);
    }
}
