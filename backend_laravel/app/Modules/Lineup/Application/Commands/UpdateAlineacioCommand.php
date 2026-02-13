<?php

/**
 * Command per actualitzar una Alineació existent.
 *
 * Executa la lògica d'actualització:
 * 1. Busca l'alineació pel seu ID (llança excepció si no existeix)
 * 2. Verifica que l'alineació es pugui modificar (que estigui activa)
 * 3. Actualitza només els camps proporcionats (patch parcial)
 */

namespace App\Modules\Lineup\Application\Commands;

use App\Modules\Lineup\Application\DTOs\UpdateAlineacioDTO;
use App\Modules\Lineup\Domain\Repositories\AlineacioRepositoryInterface;
use App\Modules\Lineup\Domain\Services\LineupDomainService;
use App\Modules\Lineup\Domain\Exceptions\AlineacioNotFoundException;

class UpdateAlineacioCommand
{
    public function __construct(
        private AlineacioRepositoryInterface $alineacioRepo,
        private LineupDomainService $domainService
    ) {}

    public function execute(string $alineacioId, UpdateAlineacioDTO $dto): void
    {
        // Busquem l'alineació, si no existeix llancem excepció 404
        $alineacio = $this->alineacioRepo->findById($alineacioId);

        if (!$alineacio) {
            throw new AlineacioNotFoundException($alineacioId);
        }

        // Verifiquem que es pot modificar (activa)
        if (!$this->domainService->canModifyAlineacio($alineacio)) {
            throw new \Exception("No es pot modificar una alineació desactivada");
        }

        // Filtrem només els camps no nuls per fer patch parcial
        $updateData = array_filter([
            'posicio' => $dto->posicio,
            'isActive' => $dto->isActive,
        ], fn($value) => $value !== null);

        $this->alineacioRepo->update($alineacioId, $updateData);
    }
}
