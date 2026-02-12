<?php

namespace App\Modules\Club\Application\Commands;

use App\Modules\Club\Application\DTOs\UpdateEquipUsuariDTO;
use App\Modules\Club\Domain\Exceptions\EquipUsuariNotFoundException;
use App\Modules\Club\Domain\Repositories\EquipUsuariRepositoryInterface;

/**
 * Command per actualitzar un membre d'equip (canviar rol o isActive).
 * Valida que el membre existeixi i que pertanyi a l'equip correcte.
 */
class UpdateEquipUsuariCommand
{
    public function __construct(
        private EquipUsuariRepositoryInterface $equipUsuariRepository
    ) {}

    public function execute(string $membreId, string $equipId, UpdateEquipUsuariDTO $dto): void
    {
        // Comprovar que el membre existeix
        $membre = $this->equipUsuariRepository->findById($membreId);
        if (!$membre || $membre->equipId !== $equipId) {
            throw new EquipUsuariNotFoundException();
        }

        // Filtrar camps no nuls per fer update parcial
        $updateData = array_filter([
            'rolEquip' => $dto->rolEquip,
            'isActive' => $dto->isActive,
        ], fn($value) => $value !== null);

        // Actualitzar el membre a la base de dades
        $this->equipUsuariRepository->update($membreId, $updateData);
    }
}
