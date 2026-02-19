<?php

namespace App\Modules\Lineup\Application\Queries;

use App\Modules\Lineup\Domain\Entities\PartitJugador;
use App\Modules\Lineup\Domain\Repositories\PartitJugadorRepositoryInterface;
use App\Modules\Lineup\Domain\Exceptions\PartitJugadorNotFoundException;

class GetPartitJugadorAdminQuery
{
    public function __construct(
        private PartitJugadorRepositoryInterface $partitJugadorRepo
    ) {}

    public function execute(string $partitJugadorId): PartitJugador
    {
        $partitJugador = $this->partitJugadorRepo->findByIdIncludingInactive($partitJugadorId);

        if (!$partitJugador) {
            throw new PartitJugadorNotFoundException($partitJugadorId);
        }

        return $partitJugador;
    }
}
