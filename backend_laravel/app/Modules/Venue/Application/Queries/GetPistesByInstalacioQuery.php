<?php

/**
 * Query per obtenir totes les Pistes d'una Instal·lació.
 *
 * Filtra les pistes per l'ID de la instal·lació pare.
 * S'utilitza a la ruta niuada GET /instalacions/{id}/pistes.
 */

namespace App\Modules\Venue\Application\Queries;

use App\Modules\Venue\Domain\Repositories\PistaRepositoryInterface;

class GetPistesByInstalacioQuery
{
    public function __construct(
        private PistaRepositoryInterface $pistaRepository
    ) {}

    public function execute(string $instalacioId): array
    {
        // Retornar totes les pistes de la instal·lació indicada
        return $this->pistaRepository->findByInstalacioId($instalacioId);
    }
}
