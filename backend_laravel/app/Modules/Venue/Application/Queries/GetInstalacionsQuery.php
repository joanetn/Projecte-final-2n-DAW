<?php

/**
 * Query per obtenir totes les Instal·lacions.
 *
 * Retorna un array d'entitats de domini Instalacio.
 * Carrega les pistes relacionades per evitar N+1 queries.
 */

namespace App\Modules\Venue\Application\Queries;

use App\Modules\Venue\Domain\Repositories\InstalacioRepositoryInterface;

class GetInstalacionsQuery
{
    public function __construct(
        private InstalacioRepositoryInterface $instalacioRepository
    ) {}

    public function execute(): array
    {
        // Retornar totes les instal·lacions amb les pistes carregades
        return $this->instalacioRepository->findAllWithRelations(['pistes']);
    }
}
