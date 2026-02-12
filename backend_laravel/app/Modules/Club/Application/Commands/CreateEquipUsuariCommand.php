<?php

namespace App\Modules\Club\Application\Commands;

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

    public function execute(CreateEquipUsuariDTO $dto, string $clubId): string
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
}
