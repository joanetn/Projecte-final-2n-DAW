<?php

namespace App\Modules\Club\Application\Queries;

use App\Modules\Club\Domain\Entities\Club;
use App\Modules\Club\Domain\Exceptions\ClubNotFoundException;
use App\Modules\Club\Domain\Repositories\ClubRepositoryInterface;

class GetClubAdminQuery
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository
    ) {}

    public function execute(string $clubId): Club
    {
        $club = $this->clubRepository->findByIdIncludingInactive($clubId);

        if (!$club) {
            throw new ClubNotFoundException();
        }

        return $club;
    }
}
