<?php

namespace App\Modules\Lineup\Application\Commands;

use App\Modules\Lineup\Domain\Repositories\PuntuacioRepositoryInterface;
use App\Modules\Lineup\Domain\Exceptions\PuntuacioNotFoundException;

class DestroyPuntuacioAdminCommand
{
    public function __construct(
        private PuntuacioRepositoryInterface $puntuacioRepo
    ) {}

    public function execute(string $puntuacioId): void
    {
        $puntuacio = $this->puntuacioRepo->findByIdIncludingInactive($puntuacioId);
        if (!$puntuacio) {
            throw new PuntuacioNotFoundException($puntuacioId);
        }

        $this->puntuacioRepo->delete($puntuacioId);
    }
}
