<?php

namespace App\Modules\Club\Application\Commands;

use App\Modules\Club\Domain\Exceptions\EquipNotFoundException;
use App\Modules\Club\Domain\Repositories\EquipRepositoryInterface;
use App\Modules\Club\Domain\Services\ClubDomainService;

/**
 * Command per eliminar (soft delete) un Equip.
 * Valida que l'equip existeixi i que pertanyi al club correcte.
 */
class DestroyEquipCommand
{
    public function __construct(
        private EquipRepositoryInterface $equipRepository,
        private ClubDomainService $clubDomainService
    ) {}

    public function execute(string $equipId, string $clubId): void
    {
        // Comprovar que l'equip existeix
        $equip = $this->equipRepository->findById($equipId);
        if (!$equip) {
            throw new EquipNotFoundException();
        }

        // Validar que l'equip pertany al club de la ruta
        $this->clubDomainService->validateEquipBelongsToClub($equipId, $clubId);

        // Soft delete: marca isActive = false
        $this->equipRepository->delete($equipId);
    }
}
