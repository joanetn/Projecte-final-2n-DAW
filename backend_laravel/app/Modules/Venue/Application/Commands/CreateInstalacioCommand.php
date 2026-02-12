<?php

/**
 * Command per crear una nova Instal·lació.
 *
 * Segueix el patró CQRS (Command): operació d'escriptura.
 * Primer valida les dades amb el servei de domini i després
 * crida al repositori per persistir la nova instal·lació.
 */

namespace App\Modules\Venue\Application\Commands;

use App\Modules\Venue\Application\DTOs\CreateInstalacioDTO;
use App\Modules\Venue\Domain\Repositories\InstalacioRepositoryInterface;
use App\Modules\Venue\Domain\Services\VenueDomainService;

class CreateInstalacioCommand
{
    public function __construct(
        private InstalacioRepositoryInterface $instalacioRepository,
        private VenueDomainService $venueDomainService
    ) {}

    public function execute(CreateInstalacioDTO $dto): string
    {
        // Validar el nom de la instal·lació amb les regles de negoci
        $this->venueDomainService->validateInstalacioName($dto->nom);

        // Validar el telèfon si s'ha proporcionat
        $this->venueDomainService->validatePhone($dto->telefon);

        // Validar el número de pistes si s'ha proporcionat
        $this->venueDomainService->validateNumPistes($dto->numPistes);

        // Crear la instal·lació a la base de dades
        $instalacio = $this->instalacioRepository->create([
            'nom' => $dto->nom,
            'adreca' => $dto->adreca,
            'telefon' => $dto->telefon,
            'tipusPista' => $dto->tipusPista,
            'numPistes' => $dto->numPistes,
            'clubId' => $dto->clubId,
            'isActive' => true,
        ]);

        // Retornem l'ID de la instal·lació creada
        return $instalacio->id;
    }
}
