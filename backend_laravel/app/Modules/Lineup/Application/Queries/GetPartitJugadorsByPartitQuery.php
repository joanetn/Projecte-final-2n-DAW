<?php
namespace App\Modules\Lineup\Application\Queries;
use App\Modules\Lineup\Domain\Repositories\PartitJugadorRepositoryInterface;
class GetPartitJugadorsByPartitQuery
{
    public function __construct(
        private PartitJugadorRepositoryInterface $partitJugadorRepo
    ) {}
    public function execute(string $partitId): array
    {
        return $this->partitJugadorRepo->findByPartit($partitId);
    }
}
