<?php

/**
 * Command per eliminar (soft delete) una Instal·lació.
 *
 * No elimina físicament, sinó que marca isActive = false.
 * Comprova que la instal·lació existeixi abans d'eliminar-la.
 */

namespace App\Modules\Venue\Application\Commands;

use App\Modules\Venue\Domain\Exceptions\InstalacioNotFoundException;
use App\Modules\Venue\Domain\Repositories\InstalacioRepositoryInterface;

class DestroyInstalacioCommand
{
    public function __construct(
        private InstalacioRepositoryInterface $instalacioRepository
    ) {}

    public function execute(string $instalacioId): void
    {
        // Comprovar que la instal·lació existeix abans d'eliminar-la
        $instalacio = $this->instalacioRepository->findById($instalacioId);
        if (!$instalacio) {
            throw new InstalacioNotFoundException();
        }

        // Soft delete: marca isActive = false
        $this->instalacioRepository->delete($instalacioId);
    }
}
