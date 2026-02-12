<?php

namespace App\Modules\Club\Application\Commands;

use App\Modules\Club\Application\DTOs\UpdateEquipDTO;
use App\Modules\Club\Domain\Exceptions\EquipNotFoundException;
use App\Modules\Club\Domain\Repositories\EquipRepositoryInterface;
use App\Modules\Club\Domain\Services\ClubDomainService;

/**
 * Command per actualitzar un Equip existent.
 * Valida que l'equip existeixi i que pertanyi al club correcte.
 */
class UpdateEquipCommand
{
    public function __construct(
        private EquipRepositoryInterface $equipRepository,
        private ClubDomainService $clubDomainService
    ) {}

    public function execute(string $equipId, string $clubId, UpdateEquipDTO $dto): void
    {
        // Comprovar que l'equip existeix
        $equip = $this->equipRepository->findById($equipId);
        if (!$equip) {
            throw new EquipNotFoundException();
        }

        // Validar que l'equip pertany al club indicat a la ruta
        $this->clubDomainService->validateEquipBelongsToClub($equipId, $clubId);

        // Validar el nom si s'ha enviat
        if ($dto->nom !== null) {
            $this->clubDomainService->validateEquipName($dto->nom);
        }

        // Filtrar només els camps no nuls per fer l'update parcial
        $updateData = array_filter([
            'nom' => $dto->nom,
            'categoria' => $dto->categoria,
            'lligaId' => $dto->lligaId,
            'isActive' => $dto->isActive,
        ], fn($value) => $value !== null);

        // Actualitzar l'equip a la base de dades
        $this->equipRepository->update($equipId, $updateData);
    }
}
