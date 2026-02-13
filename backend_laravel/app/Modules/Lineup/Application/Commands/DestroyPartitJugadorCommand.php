<?php
namespace App\Modules\Lineup\Application\Commands;
use App\Modules\Lineup\Domain\Repositories\PartitJugadorRepositoryInterface;
use App\Modules\Lineup\Domain\Exceptions\PartitJugadorNotFoundException;
class DestroyPartitJugadorCommand
{
    public function __construct(
        private PartitJugadorRepositoryInterface $partitJugadorRepo
    ) {}
    public function execute(string $partitJugadorId): void
    {
        $partitJugador = $this->partitJugadorRepo->findById($partitJugadorId);
        if (!$partitJugador) {
            throw new PartitJugadorNotFoundException($partitJugadorId);
        }
        $this->partitJugadorRepo->delete($partitJugadorId);
    }
}
