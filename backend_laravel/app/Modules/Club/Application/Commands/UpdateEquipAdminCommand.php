<?php

namespace App\Modules\Club\Application\Commands;

use App\Modules\Club\Application\DTOs\UpdateEquipDTO;
use App\Modules\Club\Domain\Exceptions\EquipNotFoundException;
use App\Modules\Club\Domain\Repositories\EquipRepositoryInterface;
use App\Modules\Club\Domain\Services\ClubDomainService;

class UpdateEquipAdminCommand
{
    public function __construct(
        private EquipRepositoryInterface $equipRepository,
        private ClubDomainService $clubDomainService
    ) {}

    public function execute(string $equipId, UpdateEquipDTO $dto): void
    {
        $equip = $this->equipRepository->findByIdIncludingInactive($equipId);
        if (!$equip) {
            throw new EquipNotFoundException();
        }

        if ($dto->nom !== null) {
            $this->clubDomainService->validateEquipName($dto->nom);
        }

        $updateData = array_filter([
            'nom' => $dto->nom,
            'categoria' => $dto->categoria,
            'lligaId' => $dto->lligaId,
            'isActive' => $dto->isActive,
        ], fn($value) => $value !== null);

        $this->equipRepository->update($equipId, $updateData);
    }
}
