<?php
namespace App\Modules\Lineup\Application\Queries;
use App\Modules\Lineup\Domain\Entities\Puntuacio;
use App\Modules\Lineup\Domain\Repositories\PuntuacioRepositoryInterface;
use App\Modules\Lineup\Domain\Exceptions\PuntuacioNotFoundException;
class GetPuntuacioQuery
{
    public function __construct(
        private PuntuacioRepositoryInterface $puntuacioRepo
    ) {}
    public function execute(string $puntuacioId): Puntuacio
    {
        $puntuacio = $this->puntuacioRepo->findById($puntuacioId);
        if (!$puntuacio) {
            throw new PuntuacioNotFoundException($puntuacioId);
        }
        return $puntuacio;
    }
}
