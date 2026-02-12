<?php

namespace App\Modules\Club\Application\Commands;

use App\Modules\Club\Application\DTOs\CreateEquipDTO;
use App\Modules\Club\Domain\Exceptions\ClubNotFoundException;
use App\Modules\Club\Domain\Repositories\ClubRepositoryInterface;
use App\Modules\Club\Domain\Repositories\EquipRepositoryInterface;
use App\Modules\Club\Domain\Services\ClubDomainService;

/**
 * Command per crear un Equip nou dins d'un Club.
 * Valida que el club existeixi i que el nom de l'equip sigui vàlid.
 */
class CreateEquipCommand
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository,
        private EquipRepositoryInterface $equipRepository,
        private ClubDomainService $clubDomainService
    ) {}

    public function execute(CreateEquipDTO $dto): string
    {
        // Comprovar que el club existeix abans de crear l'equip
        $club = $this->clubRepository->findById($dto->clubId);
        if (!$club) {
            throw new ClubNotFoundException();
        }

        // Validar el nom de l'equip
        $this->clubDomainService->validateEquipName($dto->nom);

        // Crear l'equip a la base de dades
        $equip = $this->equipRepository->create([
            'nom' => $dto->nom,
            'categoria' => $dto->categoria,
            'clubId' => $dto->clubId,
            'lligaId' => $dto->lligaId,
            'isActive' => true,
        ]);

        // Retornem l'ID de l'equip creat
        return $equip->id;
    }
}
