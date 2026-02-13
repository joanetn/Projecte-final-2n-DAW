<?php

/**
 * Command per actualitzar un PartitJugador existent.
 *
 * Executa la lògica d'actualització:
 * 1. Busca el registre pel seu ID (llança excepció si no existeix)
 * 2. Actualitza només els camps proporcionats (patch parcial)
 */

namespace App\Modules\Lineup\Application\Commands;

use App\Modules\Lineup\Application\DTOs\UpdatePartitJugadorDTO;
use App\Modules\Lineup\Domain\Repositories\PartitJugadorRepositoryInterface;
use App\Modules\Lineup\Domain\Exceptions\PartitJugadorNotFoundException;

class UpdatePartitJugadorCommand
{
    public function __construct(
        private PartitJugadorRepositoryInterface $partitJugadorRepo
    ) {}

    public function execute(string $partitJugadorId, UpdatePartitJugadorDTO $dto): void
    {
        // Busquem el registre, si no existeix llancem excepció 404
        $partitJugador = $this->partitJugadorRepo->findById($partitJugadorId);

        if (!$partitJugador) {
            throw new PartitJugadorNotFoundException($partitJugadorId);
        }

        // Filtrem només els camps no nuls per fer patch parcial
        $updateData = array_filter([
            'punts' => $dto->punts,
            'isActive' => $dto->isActive,
        ], fn($value) => $value !== null);

        $this->partitJugadorRepo->update($partitJugadorId, $updateData);
    }
}
