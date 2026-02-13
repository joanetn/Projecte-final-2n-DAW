<?php

namespace App\Modules\Invitation\Application\Queries;

use App\Modules\Invitation\Domain\Repositories\InvitacioEquipRepositoryInterface;

class GetInvitacionsByEquipQuery
{
    public function __construct(
        private InvitacioEquipRepositoryInterface $invitacioRepo
    ) {}

    public function execute(string $equipId): array
    {
        return $this->invitacioRepo->findByEquip($equipId);
    }
}
