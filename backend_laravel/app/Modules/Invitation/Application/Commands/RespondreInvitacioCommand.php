<?php

namespace App\Modules\Invitation\Application\Commands;

use App\Models\EquipUsuari;
use App\Models\Seguro;
use App\Models\UsuariRol;
use App\Modules\Invitation\Domain\Exceptions\InvitacioEquipNotFoundException;
use App\Modules\Invitation\Domain\Exceptions\InvalidInvitacioEstatException;
use App\Modules\Invitation\Domain\Repositories\InvitacioEquipRepositoryInterface;
use App\Modules\Invitation\Domain\Services\InvitationDomainService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RespondreInvitacioCommand
{
    public function __construct(
        private InvitacioEquipRepositoryInterface $invitacioRepo,
        private InvitationDomainService $domainService
    ) {}

    public function execute(string $invitacioId, string $resposta): void
    {
        DB::transaction(function () use ($invitacioId, $resposta) {
            $invitacio = $this->invitacioRepo->findById($invitacioId);
            if (!$invitacio) {
                throw new InvitacioEquipNotFoundException();
            }

            $this->domainService->validateEstat($resposta);

            if (!$this->domainService->canChangeEstat($invitacio->estat, $resposta)) {
                throw new InvalidInvitacioEstatException($resposta);
            }

            if ($resposta === 'acceptada') {
                if (!$this->hasPaidActiveInsurance($invitacio->usuariId)) {
                    throw new \RuntimeException("No pots acceptar la invitació sense tenir el segur pagat i actiu", 422);
                }

                $alreadyMember = EquipUsuari::query()
                    ->where('equipId', $invitacio->equipId)
                    ->where('usuariId', $invitacio->usuariId)
                    ->exists();

                if (!$alreadyMember) {
                    $isTrainer = UsuariRol::query()
                        ->where('usuariId', $invitacio->usuariId)
                        ->where('rol', 'ENTRENADOR')
                        ->where('isActive', true)
                        ->exists();

                    EquipUsuari::query()->create([
                        'id' => Str::uuid()->toString(),
                        'equipId' => $invitacio->equipId,
                        'usuariId' => $invitacio->usuariId,
                        'rolEquip' => $isTrainer ? 'entrenador' : 'jugador',
                        'isActive' => true,
                    ]);
                }
            }

            $this->invitacioRepo->update($invitacioId, ['estat' => $resposta]);
        });
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
