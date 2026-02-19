<?php

namespace App\Modules\Lineup\Application\Queries;

use App\Modules\Lineup\Domain\Repositories\PartitJugadorRepositoryInterface;

class GetPartitJugadorsAdminQuery
{
    public function __construct(
        private PartitJugadorRepositoryInterface $partitJugadorRepo
    ) {}

    public function execute(): array
    {
        return $this->partitJugadorRepo->findAllIncludingInactive();
    }
}
