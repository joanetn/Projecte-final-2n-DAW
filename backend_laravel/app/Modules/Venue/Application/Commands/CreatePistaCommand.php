<?php

/**
 * Command per crear una nova Pista dins d'una Instal·lació.
 *
 * Valida que la instal·lació existeixi i que el nom de la pista sigui vàlid.
 * Segueix el patró CQRS: les operacions d'escriptura són Commands.
 */

namespace App\Modules\Venue\Application\Commands;

use App\Modules\Venue\Application\DTOs\CreatePistaDTO;
use App\Modules\Venue\Domain\Exceptions\InstalacioNotFoundException;
use App\Modules\Venue\Domain\Repositories\InstalacioRepositoryInterface;
use App\Modules\Venue\Domain\Repositories\PistaRepositoryInterface;
use App\Modules\Venue\Domain\Services\VenueDomainService;

class CreatePistaCommand
{
    public function __construct(
        private InstalacioRepositoryInterface $instalacioRepository,
        private PistaRepositoryInterface $pistaRepository,
        private VenueDomainService $venueDomainService
    ) {}

    public function execute(CreatePistaDTO $dto): string
    {
        // Comprovar que la instal·lació existeix abans de crear la pista
        $instalacio = $this->instalacioRepository->findById($dto->instalacioId);
        if (!$instalacio) {
            throw new InstalacioNotFoundException();
        }

        // Validar el nom de la pista
        $this->venueDomainService->validatePistaName($dto->nom);

        // Crear la pista a la base de dades
        $pista = $this->pistaRepository->create([
            'nom' => $dto->nom,
            'tipus' => $dto->tipus,
            'instalacioId' => $dto->instalacioId,
            'isActive' => true,
        ]);

        // Retornem l'ID de la pista creada
        return $pista->id;
    }
}
