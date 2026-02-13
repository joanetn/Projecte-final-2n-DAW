<?php

namespace App\Modules\Venue\Application\Commands;

use App\Modules\Venue\Application\DTOs\UpdatePistaDTO;
use App\Modules\Venue\Domain\Exceptions\PistaNotFoundException;
use App\Modules\Venue\Domain\Repositories\PistaRepositoryInterface;
use App\Modules\Venue\Domain\Services\VenueDomainService;

class UpdatePistaCommand
{
    public function __construct(
        private PistaRepositoryInterface $pistaRepository,
        private VenueDomainService $venueDomainService
    ) {}

    public function execute(string $pistaId, string $instalacioId, UpdatePistaDTO $dto): void
    {
        $pista = $this->pistaRepository->findById($pistaId);
        if (!$pista) {
            throw new PistaNotFoundException();
        }

        $this->venueDomainService->validatePistaBelongsToInstalacio($pistaId, $instalacioId);

        if ($dto->nom !== null) {
            $this->venueDomainService->validatePistaName($dto->nom);
        }

        $updateData = array_filter([
            'nom' => $dto->nom,
            'tipus' => $dto->tipus,
            'isActive' => $dto->isActive,
        ], fn($value) => $value !== null);

        $this->pistaRepository->update($pistaId, $updateData);
    }
}
