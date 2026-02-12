<?php

/**
 * Query per obtenir una Instal·lació per ID.
 *
 * Segueix el patró CQRS (Query): operació de lectura.
 * Carrega les pistes relacionades per evitar N+1 queries.
 * Llença InstalacioNotFoundException si no existeix.
 */

namespace App\Modules\Venue\Application\Queries;

use App\Modules\Venue\Domain\Entities\Instalacio;
use App\Modules\Venue\Domain\Exceptions\InstalacioNotFoundException;
use App\Modules\Venue\Domain\Repositories\InstalacioRepositoryInterface;

class GetInstalacioQuery
{
    public function __construct(
        private InstalacioRepositoryInterface $instalacioRepository
    ) {}

    public function execute(string $instalacioId): Instalacio
    {
        // Carregar la instal·lació amb les pistes relacionades (eager loading)
        $instalacio = $this->instalacioRepository->findByIdWithRelations($instalacioId, ['pistes']);

        if (!$instalacio) {
            throw new InstalacioNotFoundException();
        }

        return $instalacio;
    }
}
