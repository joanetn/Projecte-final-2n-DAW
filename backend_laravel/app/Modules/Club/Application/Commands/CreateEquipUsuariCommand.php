<?php

namespace App\Modules\Club\Application\Commands;

use App\Models\Seguro;
use App\Modules\Club\Application\DTOs\CreateEquipUsuariDTO;
use App\Modules\Club\Domain\Exceptions\EquipNotFoundException;
use App\Modules\Club\Domain\Repositories\EquipRepositoryInterface;
use App\Modules\Club\Domain\Repositories\EquipUsuariRepositoryInterface;
use App\Modules\Club\Domain\Services\ClubDomainService;

/**
 * Command per afegir un membre (EquipUsuari) a un equip.
 * Valida que l'equip existeixi, que pertanyi al club i que l'usuari no sigui ja membre.
 */
class CreateEquipUsuariCommand
{
    public function __construct(
        private EquipRepositoryInterface $equipRepository,
        private EquipUsuariRepositoryInterface $equipUsuariRepository,
        private ClubDomainService $clubDomainService
    ) {}

    public function execute(CreateEquipUsuariDTO $dto, string $clubId, bool $skipInsuranceValidation = false): string
    {
        // Comprovar que l'equip existeix
        $equip = $this->equipRepository->findById($dto->equipId);
        if (!$equip) {
            throw new EquipNotFoundException();
        }

        // Validar que l'equip pertany al club de la ruta
        $this->clubDomainService->validateEquipBelongsToClub($dto->equipId, $clubId);

        // Validar que l'usuari no sigui ja membre d'aquest equip
        if ($this->clubDomainService->isUsuariAlreadyInEquip($dto->equipId, $dto->usuariId)) {
            throw new \Exception("L'usuari ja és membre d'aquest equip");
        }

        if (!$skipInsuranceValidation && !$this->hasPaidActiveInsurance($dto->usuariId)) {
            throw new \RuntimeException("L'usuari ha de tenir el segur pagat i actiu per formar part d'un equip", 422);
        }

        // Crear el registre a equip_usuaris
        $membre = $this->equipUsuariRepository->create([
            'equipId' => $dto->equipId,
            'usuariId' => $dto->usuariId,
            'rolEquip' => $dto->rolEquip,
            'isActive' => true,
        ]);

        // Retornem l'ID del membre creat
        return $membre->id;
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
