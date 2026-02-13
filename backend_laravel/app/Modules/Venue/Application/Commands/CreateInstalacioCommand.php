<?php

namespace App\Modules\Venue\Application\Commands;

use App\Modules\Venue\Application\DTOs\CreateInstalacioDTO;
use App\Modules\Venue\Domain\Repositories\InstalacioRepositoryInterface;
use App\Modules\Venue\Domain\Services\VenueDomainService;

class CreateInstalacioCommand
{
    public function __construct(
        private InstalacioRepositoryInterface $instalacioRepository,
        private VenueDomainService $venueDomainService
    ) {}

    public function execute(CreateInstalacioDTO $dto): string
    {
        $this->venueDomainService->validateInstalacioName($dto->nom);

        $this->venueDomainService->validatePhone($dto->telefon);

        $this->venueDomainService->validateNumPistes($dto->numPistes);

        $instalacio = $this->instalacioRepository->create([
            'nom' => $dto->nom,
            'adreca' => $dto->adreca,
            'telefon' => $dto->telefon,
            'tipusPista' => $dto->tipusPista,
            'numPistes' => $dto->numPistes,
            'clubId' => $dto->clubId,
            'isActive' => true,
        ]);

        return $instalacio->id;
    }
}
