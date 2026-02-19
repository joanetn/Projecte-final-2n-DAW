<?php

namespace App\Modules\Lineup\Application\Commands;

use App\Modules\Lineup\Domain\Repositories\PartitJugadorRepositoryInterface;
use App\Modules\Lineup\Domain\Exceptions\PartitJugadorNotFoundException;

class DestroyPartitJugadorAdminCommand
{
    public function __construct(
        private PartitJugadorRepositoryInterface $partitJugadorRepo
    ) {}

    public function execute(string $partitJugadorId): void
    {
        $partitJugador = $this->partitJugadorRepo->findByIdIncludingInactive($partitJugadorId);
        if (!$partitJugador) {
            throw new PartitJugadorNotFoundException($partitJugadorId);
        }

        $this->partitJugadorRepo->delete($partitJugadorId);
    }
}
