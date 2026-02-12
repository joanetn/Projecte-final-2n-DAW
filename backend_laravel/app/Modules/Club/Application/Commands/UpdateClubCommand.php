<?php

namespace App\Modules\Club\Application\Commands;

use App\Modules\Club\Application\DTOs\UpdateClubDTO;
use App\Modules\Club\Domain\Exceptions\ClubNotFoundException;
use App\Modules\Club\Domain\Repositories\ClubRepositoryInterface;
use App\Modules\Club\Domain\Services\ClubDomainService;

/**
 * Command per actualitzar un Club existent.
 * Només valida i actualitza els camps que s'han enviat (no null).
 */
class UpdateClubCommand
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository,
        private ClubDomainService $clubDomainService
    ) {}

    public function execute(string $clubId, UpdateClubDTO $dto): void
    {
        // Comprovar que el club existeix
        $club = $this->clubRepository->findById($clubId);
        if (!$club) {
            throw new ClubNotFoundException();
        }

        // Validar cada camp només si ha estat enviat al request
        if ($dto->nom !== null) {
            $this->clubDomainService->validateClubName($dto->nom);
        }

        if ($dto->email !== null) {
            $this->clubDomainService->validateEmail($dto->email);
        }

        if ($dto->telefon !== null) {
            $this->clubDomainService->validatePhone($dto->telefon);
        }

        if ($dto->anyFundacio !== null) {
            $this->clubDomainService->validateAnyFundacio($dto->anyFundacio);
        }

        // Filtrar només els camps no nuls per fer l'update parcial
        $updateData = array_filter([
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
            'isActive' => $dto->isActive,
        ], fn($value) => $value !== null);

        // Actualitzar el club a la base de dades
        $this->clubRepository->update($clubId, $updateData);
    }
}
