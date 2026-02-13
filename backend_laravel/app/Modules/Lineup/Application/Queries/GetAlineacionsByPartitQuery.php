<?php
namespace App\Modules\Lineup\Application\Queries;
use App\Modules\Lineup\Domain\Repositories\AlineacioRepositoryInterface;
class GetAlineacionsByPartitQuery
{
    public function __construct(
        private AlineacioRepositoryInterface $alineacioRepo
    ) {}
    public function execute(string $partitId): array
    {
        return $this->alineacioRepo->findByPartit($partitId);
    }
}
