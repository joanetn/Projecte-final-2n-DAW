<?php

namespace App\Modules\Club\Application\Queries;

use App\Modules\Club\Domain\Entities\Club;
use App\Modules\Club\Domain\Exceptions\ClubNotFoundException;
use App\Modules\Club\Domain\Repositories\ClubRepositoryInterface;

class GetClubQuery
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository
    ) {}

    public function execute(string $clubId): Club
    {
        $club = $this->clubRepository->findByIdWithRelations($clubId, ['equips']);

        if (!$club) {
            throw new ClubNotFoundException();
        }

        return $club;
    }
}
