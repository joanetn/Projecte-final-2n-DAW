<?php

namespace App\Modules\Venue\Application\Queries;

use App\Modules\Venue\Domain\Entities\Pista;
use App\Modules\Venue\Domain\Exceptions\PistaNotFoundException;
use App\Modules\Venue\Domain\Repositories\PistaRepositoryInterface;

class GetPistaQuery
{
    public function __construct(
        private PistaRepositoryInterface $pistaRepository
    ) {}

    public function execute(string $pistaId): Pista
    {
        $pista = $this->pistaRepository->findById($pistaId);

        if (!$pista) {
            throw new PistaNotFoundException();
        }

        return $pista;
    }
}
