<?php
namespace App\Modules\Lineup\Application\Queries;
use App\Modules\Lineup\Domain\Repositories\PartitJugadorRepositoryInterface;
class GetPartitJugadorsQuery
{
    public function __construct(
        private PartitJugadorRepositoryInterface $partitJugadorRepo
    ) {}
    public function execute(): array
    {
        return $this->partitJugadorRepo->findAll();
    }
}
