<?php

namespace App\Modules\Invitation\Application\Commands;

use App\Modules\Invitation\Domain\Exceptions\InvitacioEquipNotFoundException;
use App\Modules\Invitation\Domain\Exceptions\InvalidInvitacioEstatException;
use App\Modules\Invitation\Domain\Repositories\InvitacioEquipRepositoryInterface;
use App\Modules\Invitation\Domain\Services\InvitationDomainService;

class RespondreInvitacioCommand
{
    public function __construct(
        private InvitacioEquipRepositoryInterface $invitacioRepo,
        private InvitationDomainService $domainService
    ) {}

    public function execute(string $invitacioId, string $resposta): void
    {
        $invitacio = $this->invitacioRepo->findById($invitacioId);
        if (!$invitacio) {
            throw new InvitacioEquipNotFoundException();
        }

        $this->domainService->validateEstat($resposta);

        if (!$this->domainService->canChangeEstat($invitacio->estat, $resposta)) {
            throw new InvalidInvitacioEstatException($resposta);
        }

        $this->invitacioRepo->update($invitacioId, ['estat' => $resposta]);
    }
}
