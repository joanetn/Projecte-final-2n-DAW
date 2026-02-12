<?php

/**
 * Command per eliminar (soft delete) una Pista.
 *
 * Valida que la pista existeixi i que pertanyi a la instal·lació correcta.
 * No elimina físicament, sinó que marca isActive = false.
 */

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
        // Comprovar que la pista existeix
        $pista = $this->pistaRepository->findById($pistaId);
        if (!$pista) {
            throw new PistaNotFoundException();
        }

        // Validar que la pista pertany a la instal·lació de la ruta
        $this->venueDomainService->validatePistaBelongsToInstalacio($pistaId, $instalacioId);

        // Soft delete: marca isActive = false
        $this->pistaRepository->delete($pistaId);
    }
}
