<?php

namespace App\Modules\Club\Application\Queries;

use App\Modules\Club\Domain\Repositories\ClubRepositoryInterface;

class GetClubsAdminQuery
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository
    ) {}

    public function execute(): array
    {
        return $this->clubRepository->findAllIncludingInactive();
    }
}
