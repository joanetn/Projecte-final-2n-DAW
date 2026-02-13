<?php

namespace App\Modules\Venue\Application\Queries;

use App\Modules\Venue\Domain\Repositories\PistaRepositoryInterface;

class GetPistesByInstalacioQuery
{
    public function __construct(
        private PistaRepositoryInterface $pistaRepository
    ) {}

    public function execute(string $instalacioId): array
    {
        return $this->pistaRepository->findByInstalacioId($instalacioId);
    }
}
