<?php

namespace App\Modules\Venue\Application\Commands;

use App\Modules\Venue\Domain\Exceptions\PistaNotFoundException;
use App\Modules\Venue\Domain\Repositories\PistaRepositoryInterface;
use App\Modules\Venue\Domain\Services\VenueDomainService;

class DestroyPistaCommand
{
    public function __construct(
        private PistaRepositoryInterface $pistaRepository,
        private VenueDomainService $venueDomainService
    ) {}

    public function execute(string $pistaId, string $instalacioId): void
    {
        $pista = $this->pistaRepository->findById($pistaId);
        if (!$pista) {
            throw new PistaNotFoundException();
        }

        $this->venueDomainService->validatePistaBelongsToInstalacio($pistaId, $instalacioId);

        $this->pistaRepository->delete($pistaId);
    }
}
