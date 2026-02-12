<?php

/**
 * Command per actualitzar una Pista existent.
 *
 * Valida que la pista existeixi i que pertanyi a la instal·lació correcta.
 * Segueix el patró CQRS per separar operacions de lectura i escriptura.
 */

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
        // Comprovar que la pista existeix
        $pista = $this->pistaRepository->findById($pistaId);
        if (!$pista) {
            throw new PistaNotFoundException();
        }

        // Validar que la pista pertany a la instal·lació indicada a la ruta
        $this->venueDomainService->validatePistaBelongsToInstalacio($pistaId, $instalacioId);

        // Validar el nom si s'ha enviat
        if ($dto->nom !== null) {
            $this->venueDomainService->validatePistaName($dto->nom);
        }

        // Filtrar només els camps no nuls per fer l'update parcial
        $updateData = array_filter([
            'nom' => $dto->nom,
            'tipus' => $dto->tipus,
            'isActive' => $dto->isActive,
        ], fn($value) => $value !== null);

        // Actualitzar la pista a la base de dades
        $this->pistaRepository->update($pistaId, $updateData);
    }
}
