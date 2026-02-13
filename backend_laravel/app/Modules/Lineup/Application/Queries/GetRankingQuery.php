<?php
namespace App\Modules\Lineup\Application\Queries;
use App\Modules\Lineup\Domain\Repositories\PuntuacioRepositoryInterface;
class GetRankingQuery
{
    public function __construct(
        private PuntuacioRepositoryInterface $puntuacioRepo
    ) {}
    public function execute(): array
    {
        return $this->puntuacioRepo->getRanking();
    }
}
