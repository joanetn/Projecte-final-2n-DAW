<?php

namespace App\Modules\Venue\Application\Commands;

use App\Modules\Venue\Application\DTOs\UpdateInstalacioDTO;
use App\Modules\Venue\Domain\Exceptions\InstalacioNotFoundException;
use App\Modules\Venue\Domain\Repositories\InstalacioRepositoryInterface;
use App\Modules\Venue\Domain\Services\VenueDomainService;

class UpdateInstalacioCommand
{
    public function __construct(
        private InstalacioRepositoryInterface $instalacioRepository,
        private VenueDomainService $venueDomainService
    ) {}

    public function execute(string $instalacioId, UpdateInstalacioDTO $dto): void
    {
        $instalacio = $this->instalacioRepository->findById($instalacioId);
        if (!$instalacio) {
            throw new InstalacioNotFoundException();
        }

        if ($dto->nom !== null) {
            $this->venueDomainService->validateInstalacioName($dto->nom);
        }

        if ($dto->telefon !== null) {
            $this->venueDomainService->validatePhone($dto->telefon);
        }

        if ($dto->numPistes !== null) {
            $this->venueDomainService->validateNumPistes($dto->numPistes);
        }

        $updateData = array_filter([
            'nom' => $dto->nom,
            'adreca' => $dto->adreca,
            'telefon' => $dto->telefon,
            'tipusPista' => $dto->tipusPista,
            'numPistes' => $dto->numPistes,
            'clubId' => $dto->clubId,
            'isActive' => $dto->isActive,
        ], fn($value) => $value !== null);

        $this->instalacioRepository->update($instalacioId, $updateData);
    }
}
