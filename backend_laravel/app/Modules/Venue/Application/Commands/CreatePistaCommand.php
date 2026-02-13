<?php

namespace App\Modules\Venue\Application\Commands;

use App\Modules\Venue\Application\DTOs\CreatePistaDTO;
use App\Modules\Venue\Domain\Exceptions\InstalacioNotFoundException;
use App\Modules\Venue\Domain\Repositories\InstalacioRepositoryInterface;
use App\Modules\Venue\Domain\Repositories\PistaRepositoryInterface;
use App\Modules\Venue\Domain\Services\VenueDomainService;

class CreatePistaCommand
{
    public function __construct(
        private InstalacioRepositoryInterface $instalacioRepository,
        private PistaRepositoryInterface $pistaRepository,
        private VenueDomainService $venueDomainService
    ) {}

    public function execute(CreatePistaDTO $dto): string
    {
        $instalacio = $this->instalacioRepository->findById($dto->instalacioId);
        if (!$instalacio) {
            throw new InstalacioNotFoundException();
        }

        $this->venueDomainService->validatePistaName($dto->nom);

        $pista = $this->pistaRepository->create([
            'nom' => $dto->nom,
            'tipus' => $dto->tipus,
            'instalacioId' => $dto->instalacioId,
            'isActive' => true,
        ]);

        return $pista->id;
    }
}
