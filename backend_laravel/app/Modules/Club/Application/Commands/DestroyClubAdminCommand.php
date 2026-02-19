<?php

namespace App\Modules\Club\Application\Commands;

use App\Modules\Club\Domain\Exceptions\ClubNotFoundException;
use App\Modules\Club\Domain\Repositories\ClubRepositoryInterface;

class DestroyClubAdminCommand
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository
    ) {}

    public function execute(string $clubId): void
    {
        $club = $this->clubRepository->findByIdIncludingInactive($clubId);
        if (!$club) {
            throw new ClubNotFoundException();
        }

        $this->clubRepository->delete($clubId);
    }
}
