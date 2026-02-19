<?php

namespace App\Modules\Lineup\Application\Commands;

use App\Modules\Lineup\Application\DTOs\UpdateAlineacioDTO;
use App\Modules\Lineup\Domain\Repositories\AlineacioRepositoryInterface;
use App\Modules\Lineup\Domain\Exceptions\AlineacioNotFoundException;

class UpdateAlineacioAdminCommand
{
    public function __construct(
        private AlineacioRepositoryInterface $alineacioRepo
    ) {}

    public function execute(string $alineacioId, UpdateAlineacioDTO $dto): void
    {
        $alineacio = $this->alineacioRepo->findByIdIncludingInactive($alineacioId);
        if (!$alineacio) {
            throw new AlineacioNotFoundException($alineacioId);
        }

        $updateData = array_filter([
            'posicio' => $dto->posicio,
            'isActive' => $dto->isActive,
        ], fn($value) => $value !== null);

        $this->alineacioRepo->update($alineacioId, $updateData);
    }
}
