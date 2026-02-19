<?php

namespace App\Modules\Club\Application\Commands;

use App\Modules\Club\Application\DTOs\UpdateClubDTO;
use App\Modules\Club\Domain\Exceptions\ClubNotFoundException;
use App\Modules\Club\Domain\Repositories\ClubRepositoryInterface;
use App\Modules\Club\Domain\Services\ClubDomainService;

class UpdateClubAdminCommand
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository,
        private ClubDomainService $clubDomainService
    ) {}

    public function execute(string $clubId, UpdateClubDTO $dto): void
    {
        $club = $this->clubRepository->findByIdIncludingInactive($clubId);
        if (!$club) {
            throw new ClubNotFoundException();
        }

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

        $this->clubRepository->update($clubId, $updateData);
    }
}
