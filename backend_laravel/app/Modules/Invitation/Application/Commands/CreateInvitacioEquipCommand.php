<?php

namespace App\Modules\Invitation\Application\Commands;

use App\Models\Seguro;
use App\Modules\Invitation\Application\DTOs\CreateInvitacioEquipDTO;
use App\Modules\Invitation\Domain\Repositories\InvitacioEquipRepositoryInterface;
use App\Modules\Invitation\Domain\Services\InvitationDomainService;
use Illuminate\Support\Str;

class CreateInvitacioEquipCommand
{
    public function __construct(
        private InvitacioEquipRepositoryInterface $invitacioRepo,
        private InvitationDomainService $domainService
    ) {}

    public function execute(CreateInvitacioEquipDTO $dto): string
    {
        if (!$this->hasPaidActiveInsurance($dto->usuariId)) {
            throw new \RuntimeException("L'usuari convidat ha de tenir el segur pagat i actiu", 422);
        }

        $existing = $this->invitacioRepo->findByEquip($dto->equipId);
        $this->domainService->validateNoDuplicate($existing, $dto->usuariId);

        $invitacio = $this->invitacioRepo->create([
            'id' => Str::uuid()->toString(),
            'equipId' => $dto->equipId,
            'usuariId' => $dto->usuariId,
            'missatge' => $dto->missatge,
            'estat' => 'pendent',
            'isActive' => true,
        ]);

        return $invitacio->id;
    }

    private function hasPaidActiveInsurance(string $usuariId): bool
    {
        return Seguro::query()
            ->where('usuariId', $usuariId)
            ->where('isActive', true)
            ->where('pagat', true)
            ->where(function ($query) {
                $query
                    ->whereNull('dataExpiracio')
                    ->orWhere('dataExpiracio', '>=', now());
            })
            ->exists();
    }
}
