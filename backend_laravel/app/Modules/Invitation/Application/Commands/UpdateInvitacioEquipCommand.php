<?php

namespace App\Modules\Invitation\Application\Commands;

use App\Modules\Invitation\Application\DTOs\UpdateInvitacioEquipDTO;
use App\Modules\Invitation\Domain\Exceptions\InvitacioEquipNotFoundException;
use App\Modules\Invitation\Domain\Exceptions\InvalidInvitacioEstatException;
use App\Modules\Invitation\Domain\Repositories\InvitacioEquipRepositoryInterface;
use App\Modules\Invitation\Domain\Services\InvitationDomainService;

class UpdateInvitacioEquipCommand
{
    public function __construct(
        private InvitacioEquipRepositoryInterface $invitacioRepo,
        private InvitationDomainService $domainService
    ) {}

    public function execute(string $invitacioId, UpdateInvitacioEquipDTO $dto): void
    {
        $invitacio = $this->invitacioRepo->findById($invitacioId);
        if (!$invitacio) {
            throw new InvitacioEquipNotFoundException();
        }

        if ($dto->estat !== null) {
            $this->domainService->validateEstat($dto->estat);
            if (!$this->domainService->canChangeEstat($invitacio->estat, $dto->estat)) {
                throw new InvalidInvitacioEstatException($dto->estat);
            }
        }

        $updateData = array_filter([
            'missatge' => $dto->missatge,
            'estat' => $dto->estat,
            'isActive' => $dto->isActive,
        ], fn($value) => $value !== null);

        $this->invitacioRepo->update($invitacioId, $updateData);
    }
}
