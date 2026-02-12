<?php

namespace App\Modules\Club\Application\Commands;

use App\Modules\Club\Application\DTOs\CreateClubDTO;
use App\Modules\Club\Domain\Repositories\ClubRepositoryInterface;
use App\Modules\Club\Domain\Services\ClubDomainService;

/**
 * Command per crear un Club nou.
 * Primer valida les dades amb el servei de domini i després crida al repositori per persistir.
 */
class CreateClubCommand
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository,
        private ClubDomainService $clubDomainService
    ) {}

    public function execute(CreateClubDTO $dto): string
    {
        // Validar el nom del club amb les regles de negoci
        $this->clubDomainService->validateClubName($dto->nom);

        // Validar l'email si s'ha proporcionat
        $this->clubDomainService->validateEmail($dto->email);

        // Validar el telèfon si s'ha proporcionat
        $this->clubDomainService->validatePhone($dto->telefon);

        // Validar l'any de fundació si s'ha proporcionat
        $this->clubDomainService->validateAnyFundacio($dto->anyFundacio);

        // Crear el club a la base de dades amb totes les dades
        $club = $this->clubRepository->create([
            'nom' => $dto->nom,
            'descripcio' => $dto->descripcio,
            'adreca' => $dto->adreca,
            'ciutat' => $dto->ciutat,
            'codiPostal' => $dto->codiPostal,
            'provincia' => $dto->provincia,
            'telefon' => $dto->telefon,
            'email' => $dto->email,
            'web' => $dto->web,
            'anyFundacio' => $dto->anyFundacio,
            'creadorId' => $dto->creadorId,
            'isActive' => true,
        ]);

        // Retornem l'ID del club creat
        return $club->id;
    }
}
