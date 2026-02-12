<?php

namespace App\Modules\Club\Application\Commands;

use App\Modules\Club\Domain\Exceptions\EquipUsuariNotFoundException;
use App\Modules\Club\Domain\Repositories\EquipUsuariRepositoryInterface;

/**
 * Command per eliminar un membre d'un equip.
 * Fa un delete real de la taula equip_usuaris (no soft delete).
 */
class DestroyEquipUsuariCommand
{
    public function __construct(
        private EquipUsuariRepositoryInterface $equipUsuariRepository
    ) {}

    public function execute(string $membreId, string $equipId): void
    {
        // Comprovar que el membre existeix i pertany a l'equip
        $membre = $this->equipUsuariRepository->findById($membreId);
        if (!$membre || $membre->equipId !== $equipId) {
            throw new EquipUsuariNotFoundException();
        }

        // Eliminar el registre de la taula equip_usuaris
        $this->equipUsuariRepository->delete($membreId);
    }
}
