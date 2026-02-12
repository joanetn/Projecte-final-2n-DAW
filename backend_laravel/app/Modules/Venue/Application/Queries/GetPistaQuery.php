<?php

/**
 * Query per obtenir una Pista per ID.
 *
 * Retorna l'entitat de domini Pista amb la instal·lació relacionada.
 * Llença PistaNotFoundException si no existeix.
 */

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
