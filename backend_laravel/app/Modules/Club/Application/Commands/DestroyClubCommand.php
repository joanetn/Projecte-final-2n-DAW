<?php

namespace App\Modules\Club\Application\Commands;

use App\Modules\Club\Domain\Exceptions\ClubNotFoundException;
use App\Modules\Club\Domain\Repositories\ClubRepositoryInterface;

/**
 * Command per eliminar (soft delete) un Club.
 * No elimina físicament, sinó que marca isActive = false.
 */
class DestroyClubCommand
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository
    ) {}

    public function execute(string $clubId): void
    {
        // Comprovar que el club existeix abans d'eliminar-lo
        $club = $this->clubRepository->findById($clubId);
        if (!$club) {
            throw new ClubNotFoundException();
        }

        // Soft delete: marca isActive = false
        $this->clubRepository->delete($clubId);
    }
}
