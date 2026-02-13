<?php
namespace App\Modules\Lineup\Application\Queries;
use App\Modules\Lineup\Domain\Repositories\PuntuacioRepositoryInterface;
class GetPuntuacionsByPartitQuery
{
    public function __construct(
        private PuntuacioRepositoryInterface $puntuacioRepo
    ) {}
    public function execute(string $partitId): array
    {
        return $this->puntuacioRepo->findByPartit($partitId);
    }
}
